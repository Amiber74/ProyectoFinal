import { logger } from "../../utils/logger.js"

export class ValidationError extends Error{
    constructor(message){
        super(message),
        this.name='ValidationError'
    }
}
export class userDtoNotFoundError extends Error{
    constructor(message){
        super(message),
        this.name='userDtoNotFoundError'
    }
}
export class DBerror extends Error{
    constructor(message){
        super(message),
        this.name='DBerror'
    }
}
export class SamePasswordError extends Error{
    constructor(message){
        super(message),
        this.name='SamePasswordError'
    }
}
export class PasswordMismatchError extends Error{
    constructor(message){
        super(message),
        this.name='PasswordMismatchError'
    }
}
export class UserNotFoundError extends Error{
    constructor(message){
        super(message),
        this.name='UserNotFoundError'
    }
}
export class InvalidCredentialsError extends Error{
    constructor(message){
        super(message),
        this.name='InvalidCredentialsError'
    }
}
export class DuplicateEmailError extends Error{
    constructor(message){
        super(message),
        this.name='DuplicateEmailError'
    }
}

export const HandleErr = (err) =>{
    switch(true){
        case err instanceof DuplicateEmailError:
            logger.error(`Error en Users: ${err.message} | tipo DuplicateEmailError`)
            break;
        case err instanceof InvalidCredentialsError:
            logger.error(`Error en Users: ${err.message} | tipo InvalidCredentialsError`)
            break;
        case err instanceof UserNotFoundError:
            logger.error(`Error en Users: ${err.message} | tipo UserNotFoundError`)
            break;
        case err instanceof PasswordMismatchError:
            logger.error(`Error en Users: ${err.message} | tipo PasswordMismatchError`)
            break;
        case err instanceof SamePasswordError:
            logger.error(`Error en Users: ${err.message} | tipo SamePasswordError`)
            break;
        case err instanceof DBerror:
            logger.error(`Error en Users: ${err.message} | tipo DBerror`)
            break;
        case err instanceof userDtoNotFoundError:
            logger.error(`Error en Users: ${err.message} | tipo userDtoNotFoundError`)
            break;
        case err instanceof ValidationError:
            logger.error(`Error en Users: ${err.message} | tipo ValidationError`)
            break;
        default:
            logger.warn(`Error inesperado en Users: ${err.message}`)
    }
}