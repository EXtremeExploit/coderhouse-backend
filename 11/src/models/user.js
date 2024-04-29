import { Schema, model } from "mongoose";
import cartModel from './cart.js'

const userSchema = new Schema({
    first_name: {
        type: String,
        required: true
    },
    last_name: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    age: {
        type: Number,
        required: true
    },
    email: {
        type: String,
        unique: true,
        index: true
    },
    rol: {
        type: String,
        default: "User"
    },
    cartId: {
        type: Schema.Types.ObjectId,
        ref: 'cart'
    }
});

userSchema.pre('save', async function(next) {
    try {
        const newCart = await cartModel.create({ products: [] })
        this.cartId = newCart._id;
    } catch (error) {
        next(error);
    }
});

userSchema.pre('find', function() {
    this.populate('cartId');
});

export const userModel = model("users", userSchema);