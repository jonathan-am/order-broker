import { insertValue } from "~/clients/redis.client";
import { postCreateOrder, putUpdateOrder } from "~/clients/orderService.client";
import GenericException from "~/exceptions/generic.exception";
import { validate } from "~/validator/order.validator";
const orderStatus = {
    INITIAL: "initial",
    CREATED: "created",
    PROCESSING: "processing",
    CANCELLED: "cancelled",
    PROCESSED: "processed",
}

export const processOrder = async (order) => {
    logger.info('orderService.processOrder - Iniciando processamento do pedido:', order);
    validate(order);
    await realizaDePara(order);
}

const realizaDePara = async (order)=> {
    if(order.status === orderStatus.INITIAL) {
        order = await createOrderInDb(order);
    }
    if(!order.fraudCheck) {
        if(order.status === orderStatus.CREATED) {
            order = await processPaymentStatus(order);
        }
        if(order.status === orderStatus.PROCESSING) {
            //faz o fluxo da order.. envia pros correio ou envia pra um terceiro o pedido...
            order.status = orderStatus.PROCESSED;
            order = await putUpdateOrder(order);
        }
    }
    insertValue(order.orderId, order);
    logger.info('orderService.processOrder - Pedido processado, order:', order);
}

const processPaymentStatus = async (order) => {
    if(order.payment.status==="paid") {
        order.status === orderStatus.PROCESSING;
        return await putUpdateOrder(order);
    }
    if(order.payment.status==="error") {
        order.status === orderStatus.CANCELLED;
        return await putUpdateOrder(order);
    }
    return order;
}

const createOrderInDb = async (order) => {
    const response = await postCreateOrder(order);
    if(response.status==201) {
        if(response.data) {
            return response.data;
        }
    }
    throw new GenericException(500, 'Erro ao criar a ordem.');
}

export default {
    processOrder
}