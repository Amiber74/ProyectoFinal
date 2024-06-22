import nodemailer from 'nodemailer'

export const transport = nodemailer.createTransport({
    service: 'gmail',
    port:587,
    auth:{
        user:'rojas.facundo2002@gmail.com',
        pass:'ffbh chqn awzt aiya'
    }
})