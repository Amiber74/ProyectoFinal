import { cartServices } from "../services/cartServices.js";
import { productServices } from "../services/productServices.js";
import { userServices } from "../services/userServices.js";
import { phraseDay } from '../utils/phraseTime.js'
import moment from "moment"

const PS = new productServices()
const CS = new cartServices()
const US = new userServices()


export class viewController {

    ReqFlash = (req, res) => {
        let color
        const msgs = req.flash()
        if(msgs.failMessage){
            return {
                message:msgs.failMessage,
                color: 'rgba(252, 181, 181, 0.5)'
            }
        } else if( msgs.info){
            return {
                message: msgs.info,
                color: 'rgba(181, 181, 252, 0.5)'
            }
        } else if( msgs.success){
            return {
                message: msgs.success,
                color: 'rgba(153, 205, 50, 0.5)'
            }
        }else {
            return {
                message: false,
                color: ''
            }
        }
    }

    controllerHome = async (req, res) => {
        const msg = this.ReqFlash(req, res)
        const userLogin = req.session.user || false
        const Products = await PS.getAllProducts()

        if(msg.message){
            res.status(400).render('home', {
                Products, 
                userLogin, 
                msg: msg.message,
                backgrounColor: msg.color
            })
        }else{
            res.status(200).render('home',{
                Products,
                userLogin
            })
        }
        
    
    }

    controllerSession = async (req, res) => {
        if(req.session.user){
            req.flash('info', 'ya inicio sesion')
            res.redirect('/home')
        } else {
            const msg = this.ReqFlash(req, res)
            if(msg.message){
                res.status(401).render('session', {
                    msg: msg.message,
                    backgrounColor: msg.color
                })
            } else {
                res.status(200).render('session')
            }
        }
    }

    controllerCart = async (req, res) => {
        const msg = this.ReqFlash(req, res)
        const cart = await CS.getCart(req.session.cart)
        res.render('cart', {
            cart: cart.products,
            msg: msg.message,
            backgrounColor: msg.color
        })
    }

    controllerProfile = async (req, res) => {
        const msg = this.ReqFlash(req, res)
        const time = phraseDay()
        const user = await US.getUserDto(req.session.user)
        const statusProd = {
            create: user.role === 'admin',
            delete: user.role === 'admin' || user.role === 'premium',
            update: user.role === 'admin'
        }
        res.render('perfil', {
            statusProd,
            time,
            user,
            msg: msg.message,
            backgrounColor: msg.color
        })
    }

    controllerChangePass = async (req, res) => {
        const msg = this.ReqFlash(req, res)
        const email = req.session.email|| false
        if(!req.cookies['limitPass']){
            const limit = moment().add(1, 'h').format('HH:mm')
            const formatLimit =  String(limit.replace(':',''))
            res.cookie('limitPass', formatLimit)
        }
        const limit = moment(req.cookies['limitPass'],'HH:mm').format('HH:mm')
        const now = moment().format('HH:mm')
        if(moment(now,'HH:mm').isAfter(moment(limit,'HH:mm'))){
            res.clearCookie('limitPass')
            res.redirect('/session')
        }
        
        res.render('changePass',{
            status:email,
            msg: msg.message,
            backgrounColor: msg.color
        })
    }
}