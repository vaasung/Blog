const mongoose = require('mongoose')

const commentScheme = mongoose.Schema({
    postId: {
        type: String
    },
    author: {
        type: String
    },
    comments: [],
    createdAt: {
        type: Date,
        default: Date.now()
    }
})

module.exports = mongoose.model('Comments', commentScheme)