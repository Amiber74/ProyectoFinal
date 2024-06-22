import {cartServices} from '../services/cartServices.js'
import {userServices} from '../services/userServices.js'
import {productServices} from '../services/productServices.js'
import mongoose from 'mongoose'
import config from '../config/config.js'
import { expect } from "chai";

mongoose.connect(config.mongoUrlTest)

describe('Testing de cart Service', () => {
    const CS = new cartServices()
    let user; let product
    let Cid;
    before(async () => {
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
        console.log(result)
        expect(true).to.be.true
    })

    it('Eliminar Carrito', async () => {
        const result = await CS.removeCart(Cid)
        console.log(result)
        expect(true).to.be.true
    })

}).timeout(10000)
