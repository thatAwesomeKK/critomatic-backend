const mongoose = require('mongoose')
const { Schema } = mongoose

const movieInfoSchema = new Schema({
    movieID:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'movie'
    },
    slug: {
        type: String,
        required: true,
        unique: true
    },
    boxoffice: {
        type: String,
    },
    platform: {
        type: String,
    },
    duration: {
        type: String,
    },
    rating:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'rating'
    }
}, { timestamps: true })

module.exports = mongoose.model('movieInfo', movieInfoSchema)