import { logger } from "../../utils/logger.js"

export class ProductNotFoundError extends Error{
    constructor(message){
        super(message),
        this.name='ProductNotFoundError'
    }
}

export class ValidationError extends Error{
    constructor(message){
        super(message),
        this.name='ValidationError'
    }
}

export class InvalidProductIdError extends Error{
    constructor(message){
        super(message),
        this.name='InvalidProductIdError'
    }
}

export class ProductAlreadyExistsError extends Error{
    constructor(message){
        super(message),
        this.name='ProductAlreadyExistsError'
    }
}

export const HandleErr = (err) => {
    switch(true){
        case err instanceof ProductAlreadyExistsError:
            logger.error(`Error en Productos: ${err.message} | tipo ProductAlreadyExistsError`)
            break
        case err instanceof InvalidProductIdError:
            logger.error(`Error en Productos: ${err.message} | tipo InvalidProductIdError`)
            break
        case err instanceof ValidationError:
            logger.error(`Error en Productos: ${err.message} | tipo ValidationError`)
            break
        case err instanceof ProductNotFoundError:
            logger.error(`Error en Productos: ${err.message} | tipo ProductNotFoundError`)
            break
        default:
            logger.warn(`Error inesperado en Productos: ${err.message}`)
    }
}