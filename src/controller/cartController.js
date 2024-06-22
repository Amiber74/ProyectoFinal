import { cartServices } from "../services/cartServices.js";

const CS = new cartServices()


export class cartController {
    controllerAddProduct = async (req, res) => {
        try {
            const {Pid} = req.params
            const Cid = req.session.cart
            const Uid = req.session.user || false
            const {quantity} = req.body 
            
            if(!Uid){
                throw {msg: 'Para agregar al carrito necesitas iniciar sesion', redirect: '/home'}
            } else if(!quantity || !Uid){
                throw {msg: 'Para agregar un producto debe especificar la cantidad ', redirect: '/home'}
            }else{
                await CS.addProduct(
                    Uid, 
                    Cid, 
                    Pid, 
                    quantity
                )
                res.status(200).redirect('/home')
            }

        } catch(err) {
            req.flash('failMessage', err.msg)
            res.status(401).redirect(err.redirect)
        }
    }

    controllerDeleteProduct = async (req, res) => {
        try {
            const Cid = req.session.cart
            const {Pid} = req.params
            await CS.removeProduct(Cid, Pid)
            res.status(200).redirect('/cart')
        } catch(err) {
            req.flash('failMessage', err)
            res.status(401).redirect('/cart')
        }
    
    }

}