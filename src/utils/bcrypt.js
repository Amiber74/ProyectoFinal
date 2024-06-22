import bcrypt from 'bcrypt'

function SaltRandom (){
    const Min = 10; const Max = 22
    const SaltRandom = Math.floor(Math.random() * (Max - Min + 1)) + Min
    return SaltRandom
} 

export const createHash = (passsword) => {
    return bcrypt.hashSync(passsword, bcrypt.genSaltSync(SaltRandom()))
}

export const isValidPassword = (user, password) => {
    return bcrypt.compareSync(password, user.password)
}