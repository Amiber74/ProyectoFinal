import { Router } from "express";
import { authorization } from "../utils/middlewares.js";
import { cartController } from "../controller/cartController.js";

const route = Router()
const controller = new cartController()

route.post('/addproduct/:Pid', authorization(['user']), controller.controllerAddProduct)

route.post('/:Pid', controller.controllerDeleteProduct)

export default route