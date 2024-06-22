import {userModel} from '../models/userModel.js'
import {userDTO} from './DTOs/userDto.js'
import {cartServices} from './cartServices.js'
import { HandleErr, ValidationError, userDtoNotFoundError, DBerror, SamePasswordError, PasswordMismatchError , UserNotFoundError, InvalidCredentialsError, DuplicateEmailError} from './errors/userErr.js'
import {createHash, isValidPassword} from '../utils/bcrypt.js'
import __dirname from '../utils/dirname.js'
import moment from 'moment'

const CS = new cartServices()

export class userServices{

    async createUser(firstName, lastName, email, password, phone = 0, avatar = '/img/profiles/default.jpg'){
        let role
        try {
            
            if(!firstName || !lastName || !email || !password){throw new ValidationError('Campos Incompletos')}
            
            const emailExist = await userModel.findOne({email}).lean()
            if(emailExist){throw new DuplicateEmailError(` email: ${email} ya existe`)}

            if(email == 'premium@email.com') role = 'premium'
            if(email == 'admin@email.com') role = 'admin'
            
            const userCart = email != ' ' ? email : firstName

            const cart = await CS.createCart(userCart)

            const newUser = {
                avatar,
                firstName,
                lastName,
                fullName:`${firstName} ${lastName}`,
                role,
                email,
                password: createHash(password),
                phone,
                cart,
                lastConnection: ''
            }
            
            const result = await userModel.create(newUser)
            return result
        } catch(err) {
            HandleErr(err)
        }
    }

    async updateProfileImage(Uid, thumbnail) {
        
        try {
            if(!Uid || !thumbnail ){throw new ValidationError ('Campos incompletos')}
            const user = await userModel.findOne({_id:Uid})
            if(!user){throw new UserNotFoundError('Usuario no encontrado')}
            user.avatar = `/img/profiles/${thumbnail}`
            const result = await userModel.updateOne({_id:Uid}, user)
            return result
        } catch(err) {
            HandleErr(err)
        }
    }

    async getUserDto(Uid){
        try {
            if(!Uid){throw new ValidationError('Campo incompleto')}
            const user = await userModel.findOne({_id: Uid}).lean()
            if(!user){ throw new UserNotFoundError('Error al obtener el usuario')}

            const result = new userDTO(user)
            if(!result){ throw new userDtoNotFoundError('Error al obtener dto del usuario')}

            return result
        } catch(err) {
            HandleErr(err)
        }
    }

    async getAllUser(){
        try {
            const users = await userModel.find({},{password:0}).lean()
            if(!users){throw new DBerror('Error al conseguir a los usuarios')}
            return users
        } catch(err) {
            HandleErr(err)
        }
    }

    async getUserByEmail(email){
        try {
            if(!email){throw new ValidationError ('Campo incompleto')}
            const result = await userModel.findOne({email}).lean()
            if(!result){throw new UserNotFoundError('Email no encontrado')}
            return result
        } catch(err) {
            HandleErr(err)
        }
    }

    async getUserBy_Id(id){
        try {
            if(!id) throw new ValidationError ('Campo incompleto')

            const user = await userModel.findOne({_id:id}).lean()
            if(!user) throw new UserNotFoundError('error al obtener el usuario')

            return user
        } catch(err) {
            HandleErr(err)
        }
    }

    async getUserForGitHub(name){
        try {
            if(!name){ throw new ValidationError('Campo de nombre sin completar')}

            const user = await userModel.findOne({phone:'99', firstName:name}).lean()
            if(!user) throw new UserNotFoundError('Usuario no encontrado')

            return user
            
        } catch(err) {
            console.error(err.message)
        }
    }

    async updatePassword(email, newPassword, repeatPassword){
        try {
            if(!email || !newPassword|| !repeatPassword){throw new ValidationError ('Campos incompletos')}
            if(!(repeatPassword==newPassword)){throw new PasswordMismatchError('No coinciden las contraseñas')}

            const user = await this.getUserByEmail(email)
            if(!user){throw new UserNotFoundError('Email no encontrado')}

            if(isValidPassword(user, newPassword)){throw new SamePasswordError('Contraseña igual a la anterior')}

            const result = await userModel.updateOne({email}, {password:createHash(newPassword)})
            return result
        } catch(err) {
            HandleErr(err)
        }
    }

    async deleteUser(email, password){
        try {
            if(!email||!password){throw new ValidationError ('Campos incompletos')}

            const user = await this.getUserByEmail(email)
            if(!user){throw new UserNotFoundError('usuario no encontrado')}

            const pass = this.validPass(user, password)
            if(!pass){throw new PasswordMismatchError('No coinciden las contraseñas')}

            await CS.removeCart(user.cart)

            const result = await userModel.deleteOne({email})
            return result
        } catch(err) {
            HandleErr(err)
        }
    }

    async updateRole(email){
        try {
            if(!email){throw new ValidationError ('Campo "email" incompleto')}
            const user = await userModel.findOne({email}).lean()
            if(!user){throw new UserNotFoundError('Usuario no encontrado')}
            if(!(user.role=='premium' || user.role=='user')){
                throw new InvalidCredentialsError('No cuenta con los permisos adecuados')
            }
            user.role=='premium' ? user.role='user' : user.role='premium'
            const result = await userModel.findOneAndUpdate({email}, {role:user.role})
            return result
        } catch(err) {
            HandleErr(err)
        }
    }

    async updateConnection (Uid){
        try {
            const now = moment().format('DD-MM-YYYY HH:mm')
            await userModel.updateOne({_id:Uid}, {lastConnection:now})
        } catch(err) {
            HandleErr(err)
        }
    }

    async validPass(user, password){
        try {
            const result = isValidPassword(user, password)
            await this.updateConnection(user._id)
            return result
        } catch(err) {
            HandleErr(err)
        }
    }

    async validUser (email, password){
        const now = moment().format('DD-MM-YYYY HH:mm')
        try {
            const user = await this.getUserByEmail(email)
            if(!user){return false}
            
            await userModel.updateOne({_id:user._id}, {lastConnection:now})
            const pass = this.validPass(user, password)
            
            return pass
        } catch(err){
            HandleErr(err)
        }
    }

    async aadDocument (Uid, files){
        try {
            if(!Uid || !files){throw new ValidationError ('Campos incompletos')}
            const user = await userModel.findOne({_id:Uid})
            for (let i = 0; i < files.length; i++) {
                const newDoc = {
                    name: files[i].filename, 
                    reference: files[i].path
                }
                user.documents.push(newDoc)
            }
            const result = await userModel.updateOne({_id:Uid}, user)
            return result
        } catch(err) {
            HandleErr(err)
        }
    }

}