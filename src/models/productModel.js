import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
    owner:{
        type: String,
        default: 'none'
    },
    title:{
        type: String,
        trim: true,
        required: true
    },
    description:{
        type: String,
        trim: true,
        required: true
    },
    price: {
        type: Number,
        trim: true,
        required: true
    },
    code: {
        type: String,
        required: true,
        unique: true,
        index:true
    },
    thumbnail:{
        type: String,
        trim: true,
    },
    stock:{
        type: Number,
        required: true,
        default: 0
    }
})

export const productModel = mongoose.model('products', productSchema);