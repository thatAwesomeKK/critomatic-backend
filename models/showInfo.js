const mongoose = require('mongoose')
const { Schema } = mongoose

const showInfoSchema = new Schema({
    showID: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'show'
    },
    slug: {
        type: String,
        required: true,
        unique: true
    },
    platform: {
        type: String,
    },
    userRating: {
        episode: {
            type: String,
            default: ""
        },
        rating: {
            type: Number,
            default: 0
        }
    },
    episode:{
        number: {
            type: String
        },
        name: {
            type: String,
            required: true
        }
    },
    adminRating: {
            rate: {
                type: String,
                required: true
            },
            review: {
                type: String,
                required: true
            }
    },
}, { timestamps: true })

module.exports = mongoose.model('showInfo', showInfoSchema)