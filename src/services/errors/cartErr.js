import {logger} from '../../utils/logger.js'

export class CartCreationError extends Error{
    constructor(message){
        super(message),
        this.name='CartCreationError'
    }
}
export class CartNotFoundError extends Error{
    constructor(message){
        super(message),
        this.name='CartNotFoundError'
    }
}
export class ValidationError extends Error{
    constructor(message){
        super(message),
        this.name='ValidationError'
    }
}
export class ProdCartNotFoundError extends Error{
    constructor(message){
        super(message),
        this.name='ProdCartNotFoundError'
    }
}
export class CartUpdateError extends Error{
    constructor(message){
        super(message),
        this.name='CartUpdateError'
    }
}
export class ProductAlreadyExistError extends Error{
    constructor(message){
        super(message),
        this.name='ProductAlreadyExistError'
    }
}



export const HandleErr = (err) =>{
    switch(true){
        case err instanceof ProductAlreadyExistError:
            logger.error(`Error en Cart: ${err.message} | tipo ProductAlreadyExistError`)
            break;
        case err instanceof CartUpdateError:
            logger.error(`Error en Cart: ${err.message} | tipo CartUpdateError`)
            break;
        case err instanceof ProdCartNotFoundError:
            logger.error(`Error en Cart: ${err.message} | tipo ProdCartNotFoundError`)
            break;
        case err instanceof ValidationError:
            logger.error(`Error en Cart: ${err.message} | tipo ValidationError`)
            break;
        case err instanceof CartNotFoundError:
            logger.error(`Error en Cart: ${err.message} | tipo CartNotFoundError`)
            break;
        case err instanceof CartCreationError:
            logger.error(`Error en Cart: ${err.message} | tipo CartCreationError`)
            break;
        default:
            logger.warn(`Error inesperado en Cart: ${err.message}`)
    }
}