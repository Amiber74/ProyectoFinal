import {cartModel} from '../models/cartModel.js';
import { userModel } from '../models/userModel.js';
import {productModel} from '../models/productModel.js';
import { HandleErr, CartNotFoundError, CartCreationError, ValidationError, ProdCartNotFoundError, CartUpdateError, ProductAlreadyExistError } from './errors/cartErr.js';
import {UserNotFoundError, InvalidCredentialsError} from './errors/userErr.js'

export class cartServices {
    async createCart(email){
        try {

            if(!email){throw new ValidationError('campo inexistente')}

            const existCart = await cartModel.findOne({email})

            if(existCart){
                throw new CartCreationError('Cart already exist')
            }

            const newCart = {
                user:email,
                products:[]
            }

            const result = await cartModel.create(newCart)
            
            return result._id
        } catch(err) {
            HandleErr(err)
        }
    }

    async getCarts(){
        try {
            const result = await cartModel.find().lean()
            
            if(!result) throw new CartNotFoundError('Error al conseguir los carritos')
            
            return result
        } catch(err) {
            HandleErr(err)
        }
    }

    async getCart (Cid){
        try {
            if(!Cid){ throw new ValidationError('Campo sin completar')}
            
            const result = await cartModel.findOne({_id:Cid}).populate({path:'products.product'}).lean()
            
            if(!result){ throw new CartNotFoundError('Error al encontrar el carrito')}

            return result
        } catch(err) {
            HandleErr(err)
        }
    }

    async addProduct(Uid, Cid, Pid, quantity){
        try {
            if(!Cid || !Pid || !quantity){ throw new ValidationError('Campo sin completar')}

            const existCart = await cartModel.findOne({_id:Cid}).lean()
            if(!existCart){ throw new CartNotFoundError('Error al encontrar el carrito')}

            const existProduct = await productModel.findOne({_id:Pid}).lean()
            if(!existProduct){throw new ProductAlreadyExistError('Error al encontrar el producto')}

            const existUser = await userModel.findOne({_id:Uid},{password:0}).lean()
            if(!existUser){throw new UserNotFoundError('error al no obtener user')}

            if(existUser.role == 'premium' && existUser.email == existProduct.owner){throw new InvalidCredentialsError('Error de permisos Premiums')}  
            
            //Verifica si existe el producto en el carrito
            const productIndex = existCart.products.findIndex((prod) => prod.product.toString() == Pid.toString())

            if (productIndex !== -1){
                existCart.products[productIndex].quantity += Number(quantity)
            }else{
                existCart.products.push({product:Pid, quantity:Number(quantity)})
            }
            
            const result = await cartModel.updateOne({_id:Cid}, existCart).lean()
            return result
        } catch(err) {
            HandleErr(err)
        }
    }

    async updateProduct (cid, products){
        try {
            const result = await cartModel.updateOne({_id:cid}, products)
            return result
        } catch(err) {
            HandleErr(err)
        }
    }

    async removeProduct(Cid, Pid){
        try {
            if(!Cid || !Pid){ throw new ValidationError('Campo sin completar')}

            const existCart = await cartModel.findOne({_id:Cid}).lean()
            if(!existCart){ throw new CartNotFoundError('Error al encontrar el carrito')}

            const existProd = existCart.products.findIndex((prod) => prod.product.toString() == Pid.toString())

            if(existProd == -1){
                throw new ProdCartNotFoundError('Producto no existe dentro del carrito')
            }
            const newCart = existCart.products.filter( (prod) => prod.product.toString() != Pid.toString() )
            
            existCart.products = newCart

            const result = await cartModel.updateOne({_id:Cid}, existCart).lean()
            return result
        } catch(err) {
            HandleErr(err)
        }
    }

    async removeProducts (Cid){
        try {
            if(!Cid){throw new ValidationError('Campo Incompleto')}

            const existCart = await cartModel.findOne({_id:Cid}).lean()
            if(!existCart){ throw new CartNotFoundError('Error al encontrar el carrito')}
            
            existCart.products=[]

            if(!existCart.products.length() !== 0){ throw new CartUpdateError ('Error al actualizar los productos')}

            const result = await cartModel.updateOne({_id:Cid}, existCart).save()
            return result
        } catch(err) {
            HandleErr(err)
        }
    }

    async removeCart (Cid){
        try {
            if(!Cid){throw new ValidationError('Campo Incompleto')}

            const existCart = await cartModel.findOne({_id:Cid}).lean()
            if(!existCart){ throw new CartNotFoundError('Error al encontrar el carrito')}
            
            const result = await cartModel.deleteOne({_id:Cid})
            return result
        } catch(err) {
            console.error(err.message)
        }
    }

}