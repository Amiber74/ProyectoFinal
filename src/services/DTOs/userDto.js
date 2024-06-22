export class userDTO {
    constructor(user){
        this.avatar = user.avatar
        this.id = user._id,
        this.firstName = user.firstName,
        this.lastName = user.lastName,
        this.fullName = user.firstName + ' ' + user.lastName
        this.email = user.email,
        this.phone= user.phone? user.phone.split('-').join(''):'' ,
        this.role = user.role,
        this.cart = user.cart,
        this.lastConnection = user.lastConnection
    }
}
