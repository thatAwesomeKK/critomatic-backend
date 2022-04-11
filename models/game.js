const mongoose = require('mongoose')
const { Schema } = mongoose

const gameSchema = new Schema({
    title: {
        type: String,
        required: true
    },
    publisher: {
        type: String,
        required: true
    },
    leaddesigner: {
        type: String,
        required: true
    },
    platform: {
        type: String,
        required: true
    },
    releasedate: {
        type: String,
        required: true
    },
    genre: {
        type: String,
        required: true
    },
    mode: {
        type: String,
        required: true
    },
    rating: {
        type: String,
        required: true
    },
    desc: {
        type: String,
        required: true
    },
}, {timestamps: true})

module.exports = mongoose.model('game', gameSchema)