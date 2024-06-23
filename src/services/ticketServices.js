import {ticketModel} from '../models/ticketModel.js'
import {cartServices} from './cartServices.js'
import {v4 as uuidv4} from 'uuid'
import moment from 'moment'
import {productServices} from './productServices.js'
import { HandleErr, ValidationError } from './errors/productErr.js'
import { userServices } from './userServices.js'
import { transport } from '../utils/transportEmail.js'

const US = new userServices()
const CS = new cartServices()
const PS = new productServices()

export class ticketServices {

    async createTicket(Cid, Uid){

        try {
            if(!Cid || !Uid){
                throw new ValidationError('Campos faltantes')
            }
            const user = await US.getUserDto(Uid)
            const cart = await CS.getCart(Cid)

            let productsFails = {
                user: user.email,
                products:[]
            }
            let amount = 0

            for (let i = 0; i < cart.products.length; i++) {
                const stock = await PS.updateStock(cart.products[i].product._id, cart.products[i].quantity)

                if(stock.status){
                    amount = amount + (cart.products[i].product.price * cart.products[i].quantity)
                } else {
                    productsFails.products.push({
                        product: cart.products[i].product._id,
                        quantity: cart.products[i].quantity,
                        _id: cart.products[i]._id
                    })
                }
            }
            const newTicket = {
                purchaser: user.email,
                code: uuidv4(),
                purchase_datetime: moment().format('DD-MM-YYY HH:mm:ss'),
                amount
            }

            await CS.updateProduct(Cid, productsFails)

            const result = await ticketModel.create(newTicket).lean()

            return result
        } catch(err) {
            HandleErr(err)
        }

    }

}