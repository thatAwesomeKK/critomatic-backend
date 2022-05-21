const mongoose = require('mongoose')
const { Schema } = mongoose

const showRatingSchema = new Schema({
    showID:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'show',
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

module.exports = mongoose.model('showRating',showRatingSchema)