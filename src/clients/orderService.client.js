import axios from "axios"
import ClientRequestException from "~/exceptions/request.exception";

export const postCreateOrder = async (data) => {
    const options = {
        url: 'http://localhost:4003/v1/order', 
        method: 'POST',
        data,
        headers: { 
            "Content-Type": 'application/json'
        }
    }
    return await axios(options)
        .then((response))
        .catch(error=>{throw new ClientRequestException(500, error.message)});
}

export const putUpdateOrder = async (data) => {
    const options = {
        url: 'http://localhost:4003/v1/order', 
        method: 'PUT',
        data,
        headers: { 
            "Content-Type": 'application/json'
        }
    }
    return await axios(options)
        .then((response))
        .catch(error=>{throw new ClientRequestException(500, error.message)});
}

export default {
    postCreateOrder,
    putUpdateOrder
}