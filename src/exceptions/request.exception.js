import GenericException from "./generic.exception";

export default class ClientRequestException extends GenericException{
    constructor(code, message) {
        super(code, message)
    }
}