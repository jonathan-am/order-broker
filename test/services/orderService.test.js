import { beforeAll, describe, expect, it, vi } from 'vitest';
import { processOrder } from '../../src/services/order.service';
import { initRedis } from '../../src/clients/redis.client';
import axios from "axios"

const orderRequest = await import('../resources/OrderRequest.json', { with: {type: 'json'}});

beforeAll(()=> {
    vi.mock('axios', ()=> ({
        default: vi.fn((options)=>new Promise((resolve, reject)=>{
            const response = {...options.data, orderId: 321994};
            if(options.data.payment.type==="error") {
                response.payment.type="error"
                resolve({status: 400, data: response})
            }
            if(options.method==='POST') {
                response.status = 'created';
                resolve({status: 201, data: response})
            } else if(options.method==='PUT'){
                resolve({status: 200, data: response})
            }
        }))
    }))

    initRedis({
        get: ()=> ("teste"),
        del: ()=> ("teste"),
        set: ()=> ("teste"),
        hGetAll: ()=> (["teste"])
    })
})

describe('Testes fluxo service', ()=> {
    it('teste succes - processOrder', async ()=> {
        processOrder(orderRequest.default).then(()=> expect(axios).toBeCalledTimes(3))
    })

    it('teste error badRequest axios - processOrder', async ()=> {
        const throwOrder = orderRequest.default;
        throwOrder.payment.type='error';
        processOrder(orderRequest.default).catch((error)=> {
            expect(error.message).toEqual('Erro ao criar a ordem.')
            expect(error.code).toEqual(500)
        })
    })

    it('teste error badRequest axios - processOrder', async ()=> {
        const throwOrder = orderRequest.default;
        throwOrder.status='created';
        throwOrder.payment.status='error';
        processOrder(orderRequest.default).catch((error)=> {
            expect(error.message).toEqual('Erro ao atualizar a ordem.')
            expect(error.code).toEqual(500)
        })
    })

    it('teste error badRequest axios - processOrder', async ()=> {
        const throwOrder = orderRequest.default;
        throwOrder.status='processing';
        processOrder(orderRequest.default).catch((error)=> {
            expect(error.message).toEqual('Erro ao atualizar a ordem.')
            expect(error.code).toEqual(500)
        })
    })

    it('teste error invalid_data - processOrder', async ()=> {
        const throwOrder = orderRequest.default;
        throwOrder.billing=null;
        processOrder(orderRequest.default).catch((error)=> {
            expect(error.code).toEqual('INVALID_DATA')
        })
    })
})