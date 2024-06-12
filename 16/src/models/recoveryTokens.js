import { Schema, model } from "mongoose";

const recoveryTokensSchema = new Schema({
    token: {
        type: String,
        required: true
    },
    user: {
        type: String,
        required: true
    },
    expiry: {
        type: Number, // UNIX date
        required: true
    }
});

export const recoveryTokensModel = model("recoveryTokens", recoveryTokensSchema);