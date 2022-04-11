const mongoose = require('mongoose')
const {Schema} = mongoose

const directorSchema = new Schema({
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

module.exports = mongoose.model('director', directorSchema)