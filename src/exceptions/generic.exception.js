export default class GenericException extends Error{
    constructor(code, message) {
        super(message)
        this.code=code;
    }
}