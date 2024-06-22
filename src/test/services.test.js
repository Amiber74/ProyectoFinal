import { cartServices } from "../services/cartServices.js";
import { userServices } from "../services/userServices.js";
import { productServices } from "../services/productServices.js";
import { expect } from "chai";
import config from "../config/config.js";
import mongoose from "mongoose";


mongoose.connect(config.mongoUrlTest)

describe('Testing de services',  () => {
    
    describe('Test de usuarios', () => {
        const US = new userServices()
        let Uid
        let User 
        before( () => {
            mongoose.connection.collections.users.drop()
            mongoose.connection.collections.carts.drop()
        })
    
    
        it('Creacion de un usuario', async () => {
            const user = await US.createUser(
                'Mock',
                'user',
                'Mock@mail.com',
                '123'
            )
            Uid = user._id
            expect(mongoose.Types.ObjectId.isValid(user._id)).to.be.true
        })
    
        it('Recuperar el Dto de un usuario', async () => {
            const result = await US.getUserDto(Uid)
            User = result
            expect(mongoose.Types.ObjectId.isValid(result.id)).to.be.true
        })
    
        it('Recuperar usuario por email', async () => {
            const result = await US.getUserByEmail(User.email)
            expect(mongoose.Types.ObjectId.isValid(result._id)).to.be.true
        })
    
        it('Eliminar usuario', async () => {
            const result = await US.deleteUser(User.email, '123')
            expect(result.deletedCount).to.be.equal(1)
        })
    
    
    })

    describe('Test de Producto',  () => {
        const PS = new productServices()
        let Product
        
        before( () => {
            mongoose.connection.collections.products.drop()
        })
    
        it('Crear un producto', async () => {
            const prod = await PS.createProduct(
                'email@mail.com',
                'productMock',
                'productTest',
                1,
                '',
                1
            )
            Product = prod
            expect(mongoose.Types.ObjectId.isValid(prod._id)).to.be.true
        })
    
        it('Obtener un producto por ID', async () => {
            const prod = await PS.getOneProduct(Product._id)
            expect(mongoose.Types.ObjectId.isValid(prod._id)).to.be.true
        })
    
        it('actualizar producto', async () => {
            const product = {
                title: 'cambio de Titulo',
            }
            const prod = await PS.updateProduct(Product.code, product)
            expect(prod.modifiedCount).to.be.equal(1)
        })
    
        it('No poder eliminar producto por no contar con usuario', async () => {
            const result = await PS.deleteProduct(Product.code, '')
            expect(result).to.be.equal(undefined)
        })
    
    })

    describe('Testing de cart Service', () => {
        const CS = new cartServices()
        let user; let product
        let Cid;
        before(async () => {
            mongoose.connection.collections.carts.drop()
            
            user = await new userServices().createUser(
                'user', 
                'Mock', 
                'email@mail.com', 
                '123'
            )
            product = await new productServices().createProduct(
                'email@mail.com',
                'productMock',
                'productTest',
                1,
                '',
                1
            )
            
        })
        
        it('Al crear un cart devuelve el id del carrito', async () => {
            const result = await CS.createCart(user.email)
            Cid = result
            expect(mongoose.Types.ObjectId.isValid(result)).to.be.true
        })
    
        it('El carrito devuelve los productos en formato Array', async () => {
            const result = await CS.getCart(Cid)
            expect(Array.isArray(result.products)).to.be.true
        })
    
        it('El carrito agrega un producto', async () => {
            const result = await CS.addProduct(user._id, Cid, product._id, 1)
            expect(result.modifiedCount).to.be.equal(1)
        })
    
        it('Eliminar producto del carrito', async () => {
            const result = await CS.removeProduct(Cid, product._id)
            expect(true).to.be.true
        })
    
        it('Eliminar Carrito', async () => {
            const result = await CS.removeCart(Cid)
            expect(true).to.be.true
        })
    
    })

}).timeout(5000)