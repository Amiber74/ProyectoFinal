import { HandleErr } from "../services/errors/cartErr.js";
import { userServices } from "../services/userServices.js";
import { transport } from "../utils/transportEmail.js";

const US = new userServices()

export class userController{

    controllerLoginUser = async (req, res) => {
        try {
            const {email, password} = req.body
            const result = await US.validUser(
                email,
                password
            )
            
            if(!result){throw 'Contraseña o correo incorrectos'}

            const user = await US.getUserByEmail(email)
            
            if(!user){
                throw 'Error al iniciar sesion'
            }
            req.session.user = user._id
            req.session.cart = user.cart
            res.status(200).redirect('/home')
        } catch(err) {
            req.flash('failMessage', err)
            res.status(401).redirect('/session')
        }
    }

    controllerRegister = async (req, res) => {
    
        try {
            const {firstName, lastName, email, password, phone} = req.body
            const result = await US.createUser(
                firstName, 
                lastName, 
                email, 
                password, 
                phone
            )
            if(!result) throw 'Error al registrarse, intente de nuevo'

            req.flash('success', 'Se ha registrado con exito')
            res.status(200).redirect('/session')
        } catch(err) {
            req.flash('failMessage', err)
            res.status(401).redirect('/session')
        }
    
    }

    controllerLogout = async (req, res) => {
        try {
            await US.updateConnection(req.session.user)
            req.session.destroy(() => {
                res.status(200).redirect('/home')
            })
        } catch(err) {
            req.flash('failMessage', err)
            res.status(400).redirect('/profile')
        }

    
    }

    controllerCurrent = async (req, res) => {
        try {
            const user = await US.getUserDto(req.session.user)
            if(!user) throw 'Eror al obtener usuario'
            res.stauts(200).send(user)
        } catch(err) {
            res.status(400).send('Error:' + err)
        }
    }

    controllerRole = async (req, res) => {
        try {
            const user = await US.getUserDto(req.session.user)
            const result = await US.updateRole(user.email)
            if(!result) throw 'No puede cambiar su rol en este momento'
            res.status(200).redirect('/profile')
        } catch(err) {
            req.flash('failMessage', err)
            res.status(200).redirect('/profile')
        }
    
    }

    controllerChangePass = async (req, res) => {
        try {
            const {emailUser, newPassword, repeatPassword} = req.body
            
            const result = await US.updatePassword(
                emailUser,
                newPassword,
                repeatPassword
            )
            req.session.email=''
            if(!result) throw 'Ocurrio un error con el cambio de contraseña, intente de nuevo'
            res.status(200).redirect('/session')
        } catch(err) {
            req.flash('failMessage', err)
            res.status(400).redirect('/changePass')
        }
    
    }

    controllerSendEmail = async (req, res) => {
        try {
            const {email} = req.body
            if(email){
                req.session.email = email
                await transport.sendMail({
                    from: '<rojas.facundo2002@gmail.com>',
                    to:email,
                    subject:'Cambio de contraseña',
                    html:`
                        <div>
                            <h1>Cambio de Contraseña</h1>
                            <p>Para cambiar de contraseña haga click en el boton de ser caso contrario ignore este email</p>
                            <a href="http://localhost:8080/changePass">
                                <button> Cambiar Contraseña </button>
                            </a>
                        </div>
                    `
                })
                res.status(200).redirect('/session')
            } else {
                throw 'Email no ingresasdo'
            }
        } catch(err) {
            req.flash('failMessage', err)
            res.status(400).redirect('/changePass')
        }
    
    }

    controllerProfileImage = async (req, res) => {
    
        try {
            const user = req.session.user
            const file = req.file.filename
            if(!file) throw 'No hay imagen seleccionada'
            const result = await US.updateProfileImage(user, file)
            if(!result) throw 'Error al actualizar la foto de perfil'
            res.status(200).redirect('/profile')
        } catch(err) {
            req.flash('failMessage', err)
            res.status(400).redirect('/profile')
        }
    
    }

    controllerDocument = async (req, res) => {
    
        try {
            const user = req.session.user
            const result = await US.aadDocument(user, req.files)
            if(!result) throw 'Error al agregar los documentos'
            res.status(200).redirect('/profile')
        } catch(err) {
            req.flash('FailMessage', err)
            res.status(400).redirect('/profile')
        }
    
    }

    controllerGoogle = async (req, res) => {

        try {
            const user = await US.getUserByEmail(req.user.email)
            req.session.user = user._id
            req.session.cart = user.cart
            res.status(200).redirect('/home')
        } catch(err) {
            req.flash('FailMessage', err)
            res.status(400).redirect('/session')
        }

    
    }

    controllerGitHub = async (req, res) => {
    
        try {
            
            const user = await US.getUserForGitHub(req.user.firstName)
            req.session.user = user._id
            req.session.cart = user.cart
            res.redirect('/home')

        } catch(err) {
            req.flash('FailMessage', err)
            res.status(400).redirect('/session')
        }
    
    }
}