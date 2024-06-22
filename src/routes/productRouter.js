import { Router } from "express";
import {authorization} from '../utils/middlewares.js';
import { uploader } from "../utils/multer.js";
import { productController } from "../controller/productController.js";

const route = Router()
const controller = new productController()

route.post('/newProduct', authorization(['premium','admin']), uploader.single('thumbnail'), controller.controllerCreateProduct )

route.post('/deleteProduct', authorization(['premium','admin']), controller.controllerDeleteProduct )

route.post('/updateProduct', authorization(['admin']), uploader.single('thumbnail'), controller.controllerUpdateProduct )

export default route