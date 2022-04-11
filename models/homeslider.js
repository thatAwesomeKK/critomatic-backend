const mongoose = require('mongoose')
const { Schema } = mongoose

const homesliderSchema = new Schema({
    img: {
        type: String,
        required: true
    },
})

module.exports = mongoose.model('homeslider', homesliderSchema)