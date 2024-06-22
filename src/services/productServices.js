import {productModel } from "../models/productModel.js";
import {HandleErr, ValidationError, ProductAlreadyExistsError, ProductNotFoundError} from './errors/productErr.js'
import {v4 as uuidv4} from 'uuid'
import { UserNotFoundError, InvalidCredentialsError } from './errors/userErr.js'
import { userServices } from "./userServices.js";

const US = new userServices()

export class productServices{
    
    async createProduct(owner='admin', title, description, price, thumbnail='default.jpg', stock){
        try {
            if(!title || !description || !price || !stock){
                throw new ValidationError('Campos incompletos')
            }

            const existProd = await productModel.findOne({title}).lean()
            if(existProd){ throw new ProductAlreadyExistsError('titulo de producto ya existente')}

            const newProduct = {
                owner,
                title,
                description,
                price,
                code: uuidv4(),
                thumbnail,
                stock
            }
            
            const result = await productModel.create(newProduct)
            return result
        } catch(err) {
            HandleErr(err)
        }
    }

    async getAllProducts (){
        try {
            const result = await productModel.find().lean()
            if(!result){throw new ProductNotFoundError('Productos no Encontrados')}
            return result
        } catch(err) {
            HandleErr(err)
        }
    }

    async getOneProduct (Pid){
        try {
            if(!Pid){throw new ValidationError('Campo incompleto')}
            const result = await productModel.findOne({_id:Pid}).lean()
            if(!result){throw new ProductNotFoundError('Producto no Encontrado')}
            return result
        } catch(err) {
            HandleErr(err)
        }
    }

    async getProductByCode (code){
        try {
            if(!code){throw new ValidationError('Campo incompleto')}
            const result = await productModel.findOne({code}).lean()
            if(!result){throw new ProductNotFoundError('Producto no Encontrado')}
            return result
        } catch(err) {
            HandleErr(err)
        }
    }

    async updateProduct(code, product){
        try {
            if(!code || !product){throw new ValidationError('Campo/s incompleto')}

            const prod = await this.getProductByCode(code)
            if(!prod){throw new ProductNotFoundError('Producto no Encontrado')}

            for (const [key] of Object.entries(product)) {
                prod[key] = product[key];
            } 
            const result = await productModel.updateOne({code}, prod)

            return result
        } catch(err) {
            HandleErr(err)
        }
    }

    async updateStock(Pid, quantity){
        try {
            const prod = await this.getOneProduct(String(Pid))
            if(prod.stock < quantity){
                return {
                    status: false,
                    payload: 'Stock insuficiente'
                }
            }
            prod.stock = prod.stock - quantity

            await productModel.updateOne({_id:Pid}, prod)
            return {
                status: true,
                payload: 'Stock suficiente'
            }
        } catch(err) {
            HandleErr(err)
        }
    }

    async deleteProduct(code, Uid){
        let result
        try {
            if(!code || !Uid){throw new ValidationError('Campos Incompletos')}
            const prod = this.getProductByCode(code)
            if(!prod){throw new ProductNotFoundError('Producto no Encontrado')}
            const user = await US.getUserDto(Uid)
            if(!user){throw new UserNotFoundError('Usuario no encontrado')}
            if(user.role=='admin' || (user.role=='premium' && user.email==prod.owner)){
                return result = await productModel.deleteOne({code})
            }
            throw new InvalidCredentialsError('No cuenta con los permisos adecuados')
        } catch(err) {
            HandleErr(err)
        }
    }

}