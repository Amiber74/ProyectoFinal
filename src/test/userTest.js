import {userServices} from '../services/userServices.js'
import mongoose from 'mongoose'
import config from '../config/config.js'
import { expect } from "chai";

mongoose.connect(config.mongoUrlTest)

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


}).timeout(10000)