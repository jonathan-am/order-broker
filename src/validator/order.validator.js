import Joi from "joi";
import InvalidOrderException from "~/exceptions/invalidOrder.exception";

const schemaMessageOrder = Joi.object().keys({
    payment: Joi.object({
        type: Joi.string().trim(false).required(),
        identifier: Joi.string().trim(false).required(),
        status: Joi.string().required()
    }).required(),
    fraudCheck: Joi.boolean().required(),
    status: Joi.string().required(),
    item: Joi.object({
        name: Joi.string().trim().required(),
        quantity: Joi.number().integer().required(),
        unitPrice: Joi.number().required(),
    }).required(),
    value: Joi.number().required(),
    billing: Joi.object({
        name: Joi.string().trim(false).required(),
        lastname: Joi.string().trim(false).required(),
        address: Joi.string().trim().required()
    }).required()
})

export const validate = async (order) => {
    const { error } = schemaMessageOrder.validate(order);
    if(error) {
        throw new InvalidOrderException("INVALID_DATA", "Invalid Order Format");
    }
}

export default {
    validate
}