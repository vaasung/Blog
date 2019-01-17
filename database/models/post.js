const mongoose = require('mongoose')

const PostSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, 'Title is required!']
    },
    description: {
        type: String,
        required: [true, 'Description is requires']
    },
    content: {
        type: String,
        required: [true, 'Cannot post without contents']
    },
    image: {
        type: String,
        required: [true, 'Image required']
    },
    createdAt: {
        type: Date,
        default: Date.now()
    },
    comments: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Comments'
    }],
    topic: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Topic'
    },
    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }
})

module.exports = mongoose.model('Post', PostSchema, 'post')