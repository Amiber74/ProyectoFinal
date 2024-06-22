import {userServices} from '../services/userServices.js'
import {productServices} from '../services/productServices.js'
import mongoose from 'mongoose'
import config from '../config/config.js'
import { expect } from "chai";

mongoose.connect(config.mongoUrlTest)

describe('Test de Producto', async () => {
    const PS = new productServices()
    let Product
    
    after( () => {
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