const mongoose = require('mongoose')
const {Schema} = mongoose

const personSchema = new Schema({
    name:{
        type: String,
        required: true
    },
    img:{
        type: String,
    },
}, {timestamps: true})

module.exports = mongoose.model('person', personSchema)