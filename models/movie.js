const mongoose = require('mongoose')
const { Schema } = mongoose

const movieSchema = new Schema({
    slug: {
        type: String,
        required: true,
        unique: true
    },
    title: {
        type: String,
        required: true
    },
    titleposter: {
        type: String,
        required: true
    },
    stills: [{
        type: String
    }],
    bgimg: {
        type: String,
        required: true
    },
    director: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'director'
    },
    cast: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'cast'
    }],
    rating: {
        type: String,
    },
    userrating: {
        type: String,
    },
    genre: [{
        type: String,
        required: true
    }],
    summary: {
        type: String,
        required: true
    },
    boxoffice: {
        type: String,
    },
    ottplatform: {
        type: String,
    },
    duration: {
        type: String,
        required: true
    }
}, { timestamps: true })

module.exports = mongoose.model('movie', movieSchema)