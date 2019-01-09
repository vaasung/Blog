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
        // required: [true, 'Image required']
    },
    createdAt: {
        type: Date,
        default: Date.now()
    },
    comments: {
        type: Number
    },
    tags: {
        // type: mongoose.Schema.Types.ObjectId,
        // ref: 'Category'
        type: [String]
    },
    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
        // type: String
        // default: 'Vasu' // Remove later this default
    }
})

module.exports = mongoose.model('Post', PostSchema, 'post')