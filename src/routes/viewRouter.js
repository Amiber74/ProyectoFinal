import { Router } from "express"
import { viewController } from '../controller/viewController.js'

const route = Router()
const controller = new viewController()

route.get('/', (req, res) => { res.redirect('/home') })

route.get('/home', controller.controllerHome)

route.get('/session', controller.controllerSession)

route.get('/cart', controller.controllerCart)

route.get('/profile', controller.controllerProfile)

route.get('/changePass', controller.controllerChangePass)

route.get('/chat', controller.controllerChat)

export default route