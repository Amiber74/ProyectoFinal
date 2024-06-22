import winston from 'winston'
import moment from 'moment'

const CustomLogger ={
    levels:{
        fatal:0,
        error:1,
        warn:2,
        info:3,
        http:4,
        debug:5
    },
    colors: {
        fatal: 'red',
        error: 'black', 
        warn: 'yellow',
        info: 'blue',
        debug: 'white',
    }
}

export let logger = winston.createLogger({
    levels: CustomLogger.levels,
    transports: [
        new winston.transports.Console({
            level: "debug",
            format: winston.format.combine(
                winston.format.colorize({colors:CustomLogger.colors}),
                winston.format.simple()
            )
        }),
        new winston.transports.File({
            filename: './error.log',
            level:'warn',
            format: winston.format.simple()
        })
    ]
})

export const addLogger = (req, res, next) => {
    req.logger = logger
    req.logger.http(` Peticion tipo '${req.method}' en 'localhost:8080${req.url}' fecha: ${moment().format('DD-MM-YYYY HH:mm:ss')}`)
    next()
}
