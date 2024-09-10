import GenericException from "./generic.exception";

export default class InvalidOrderException extends GenericException {
    constructor(code, message) {
        super(code, message);
    }
}