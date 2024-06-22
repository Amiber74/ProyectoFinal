import express from 'express'
import handlebars from 'express-handlebars'
import session from 'express-session'
import cookieParser from 'cookie-parser'
import mongoose from 'mongoose'
import MongoStore from 'connect-mongo'
import passport from 'passport'
import flash from 'connect-flash'
import swaggerJsdoc from 'swagger-jsdoc'
import swaggerUiExpress from 'swagger-ui-express'

import {addLogger, logger} from './utils/logger.js'
import __dirname from './utils/dirname.js'
import config from './config/config.js'
import initializeGoogle from './config/googleConfig.js'
import initializeGitHub from './config/githubConfig.js'

import viewsRouter from './routes/viewRouter.js'
import userRouter from './routes/userRouter.js'
import productRouter from './routes/productRouter.js'
import cartRouter from './routes/cartRouter.js'
import ticketRouter from './routes/ticketRouter.js'

const app = express()

const swaggerOptions = {
    definition:{
        openapi: '3.0.1',
        info:{
            title:'Documentacion de Proyecto Final'
        },
        server:{
            url: `http://localhost:${config.port}`
        }
    },
    apis:[`${__dirname}/./../docs/**/*.yaml`]
}
const specs = swaggerJsdoc(swaggerOptions)
app.use('/api/docs', swaggerUiExpress.serve, swaggerUiExpress.setup(specs))

app.use(express.json())
app.use(express.urlencoded({extended:true}))

app.engine('handlebars', handlebars.engine())
app.set('views', __dirname + './../views')
app.set('view engine', 'handlebars')
app.use(express.static(__dirname + './../public'))

app.use(cookieParser(config.cookieKey))

app.use(session({
    store: MongoStore.create({
        mongoUrl: config.mongoUrl,
        ttl:30
    }),
    secret: config.mongoKey,
    resave: true,
    saveUninitialized: true
}))
app.use(flash())
app.use(addLogger)

initializeGoogle()
initializeGitHub()

app.use(passport.initialize())
app.use(passport.session())

mongoose.connect(config.mongoUrl)

app.use('/', viewsRouter)
app.use('/api/user', userRouter)
app.use('/api/product', productRouter)
app.use('/api/cart', cartRouter)
app.use('/api/ticket', ticketRouter)



const PORT = config.port || 8080
app.listen( config.port, () => {
    logger.info(`Servidor levantado en el puerto ${PORT}`)
})