const mongoose = require('mongoose')
const { Schema } = mongoose

const showSchema = new Schema({
    title: {
        type: String,
        required: true
    },
    releasedate:{
        type: String,
        required: true
    },
    tilldate:{
        type: String,
        required: true
    },
    ottplatform:{
        required: String,
        required: true
    },
    season:{
        required: String,
        required: true
    },
    episodecount:{
        required: String,
        required: true
    },
    genre: {
        type: String,
        required: true
    },
    rating: {
        type: string,
        required: true
    },
    summary: {
        type: string,
        required: true
    },
}, {timestamps: true})

module.exports = mongoose.model('show', showSchema)