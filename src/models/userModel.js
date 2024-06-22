import mongoose from "mongoose";
import __dirname from "../utils/dirname.js";

const userSchema = new mongoose.Schema({
    avatar: String,
    firstName: {
        type: String,
        required: true,
        trim: true,
        maxlength: 100
    },
    lastName: {
        type: String,
        trim: true,
        maxlength: 100
    },
    fullName: String,
    role:{ 
        type: String,
        enum:['user', 'premium', 'admin'],
        default:'user'
    },
    email: {
        type: String,
        index:true,
        trim: true,
        unique: true,
        lowercase: true
    },
    password: {
        type: String,
        required: true
    },
    phone:{
        type: String,
        index:true,
    },
    cart:{
        type: mongoose.Schema.Types.ObjectId,
        ref:'carts'
    },
    documents:[{
        name: String,
        reference: String
    }],
    lastConnection:{
        type: String,
        default: false
    }
});

export const userModel = mongoose.model('users', userSchema);
