const mongoose = require('mongoose')
const { Schema } = mongoose

const ratingSchema = new Schema({
    movieID:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'movie',
        required: true
    },
    userID:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user',
        required: true
    },
    userRating: {
        rating:{
            type: Number,
            required: true
        },
        review:{
            type: String,
            required: true
        }
    },
}, { timestamps: true })

module.exports = mongoose.model('rating',ratingSchema)