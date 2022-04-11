const mongoose = require('mongoose')
const {Schema} = mongoose

const castSchema = new Schema({
    name:{
        type: String,
        required: true
    },
    dob:{
        type: String,
        required: true
    },
    img:{
        type: String,
        required: true,
    },
    desc:{
        type: String,
        required: true,
    },
}, {timestamps: true})

module.exports = mongoose.model('cast', castSchema)