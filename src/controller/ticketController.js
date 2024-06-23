import {ticketServices} from '../services/ticketServices.js'
import { userServices } from '../services/userServices.js'
import { logger } from '../utils/logger.js'
import { transport } from '../utils/transportEmail.js'

const TS = new ticketServices()
const US = new userServices()

export class ControllerTicket{

    sendEmail = async (req, res, ticket) => {
        const user = await US.getUserDto(req.session.user)
        await transport.sendMail({
            from: '<no-reply@PF.com>',
            to: user.email,
            subject: 'Eliminacion de Producto',
            html:`
                <div>
                    <h1>Felicidades por su compra</h1>
                    <h3>Se le informa que los productos que signa en su carrito es debido a una falta de stock, lamentamos el inconveniente y esperamos abastecernos proximamente</h3>

                    <p> Informacion de la compra: </p>
                    
                    <p> <strong> Codigo:</strong> ${ticket.code} </p>
                    <p> <strong> Hora:</strong> ${ticket.purchase_datetime} </p>
                    <p> <strong> Total:</strong> ${ticket.amount} </p>

                </div>
            `
        })
    
    }

    newTicket = async (req, res) => {
        const {user, cart} = req.session
        const result = await TS.createTicket(cart, user)
        await this.sendEmail(req,res,result)
        if(result){
            req.flash('info', 'Si algun producto sigue en el carrito es debido a que no hay stock suficiente')
            res.redirect('/cart')
        }else{
            req.flash('failMessage', 'Error al crear el ticket')
            res.redirect('/cart')
        }
    
    }

}
