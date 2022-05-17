const mongoose = require('mongoose')
const { Schema } = mongoose

const movieSchema = new Schema({
    title: {
        type: String,
        required: true
    },
    slug: {
        type: String,
        required: true,
        unique: true
    },
    titleposter: {
        type: String,
        required: true
    },
    bgimg: {
        type: String,
        required: true
    },
    crew: [{
        crewID: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'person'
        },
        job: {
            type: String,
        }
    }],
    cast: [{
        castID: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'person'
        },
        playing: {
            type: String
        }
    }],
    genre: [{
        type: String,
        required: true
    }],
    summary: {
        type: String,
        required: true
    },
    releaseDate: {
        type: String,
        required: true
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
    userRating: {
        type: Number,
    },
    adminRating: {
        rating: {
            type: Number,
        },
        review: {
            type: String
        }
    },
    video: [{
        type: Object,
    }],
    approved: {
        type: Boolean,
        required: true,
        default: false
    }
}, { timestamps: true })

module.exports = mongoose.model('movie', movieSchema)