const mongoose = require('mongoose')
const { Schema } = mongoose

const ratingSchema = new Schema({
    movieID:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'movie'
    },
    rating: {
        type: String,
    },
    userrating: {
        type: String,
    },
}, { timestamps: true })

module.exports = mongoose.model('rating',ratingSchema)