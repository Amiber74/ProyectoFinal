import { userServices } from "../services/userServices.js"
const US = new userServices()


export const authorization = (role) => {

    return async (req, res, next) => {

        if(!req.session.user){
            if(req.rawHeaders[33] === 'http://localhost:8080/home'){
                req.flash('failMessage', 'Para agregar productos al carrito debe iniciar sesion')
            }
            return res.status(401).redirect('/session')
        }

        let status; let index = 0
        const user = await US.getUserDto(req.session.user)


        while(index < role.length){
            if(role.length == 1){
                status = user.role == role[index] ? true : false 
                index = role.length
            } else {
                if(role[index] == user.role){
                    index = role.length
                    status = true
                } else {
                    ++index
                    status = false
                }
            }
        }

        if(status){
            return next()
        } else {
            req.flash('failMessage', 'No cuenta con la autorizacion suficiente')
            res.redirect('/home')
        }

    }
}
