const mongoose = require('mongoose')
const { Schema } = mongoose

const movieSchema = new Schema({
    title: {
        type: String,
        required: true
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
    video:[
        {
            type: Object,
        }
    ]
}, { timestamps: true })

module.exports = mongoose.model('movie', movieSchema)