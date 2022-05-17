const mongoose = require('mongoose')
const {Schema} = mongoose

const userSchema = new Schema({
    username:{
        type: String,
        required: true
    },
    email:{
        type: String,
        required: true,
        unique: true
    },
    password:{
        type: String,
        required: true,
    },
    role:{
        type: String,
        required: true,
        default: "isUser"
    },
    tokenVersion:{
        type:Number,
        default: 0
    }
}, {timestamps: true})

module.exports = mongoose.model('user', userSchema)