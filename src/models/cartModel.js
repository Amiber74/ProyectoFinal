import mongoose from 'mongoose'

const cartSchema = new mongoose.Schema({
    user:{
        type: String,
        ref: 'users',
        required: true,
        localField: 'email'
    },
    products: [
        {
            product: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'products'
            },
            quantity:{
                type: Number,
                required: true
            }
        }
    ]
}) 


export const cartModel = mongoose.model('carts', cartSchema)