import { Router } from "express";
import {ticketServices} from '../services/ticketServices.js'


const route = Router()
const TS = new ticketServices()

route.post('/purchase', async (req, res) => {
    const {user, cart} = req.session
    const result = await TS.createTicket(cart, user)
    
    if(result){
        req.flash('info', 'Si algun producto sigue en el carrito es debido a que no hay stock suficiente')
        res.redirect('/cart')
    }else{
        req.flash('failMessage', 'Error al crear el ticket')
        res.redirect('/cart')
    }

})

export default route
