const mongoose = require('mongoose')

const PostSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Name is required!']
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
        url: String,
        // required: [true, 'Image required']
    },
    createdAt: {
        type: Date,
        default: Date.now()
    },
    comments: {
        type: Number
    },
    tags: [],
    comments: [{
        author: {
            type: String
        }
    }],
    author: {
        type: String,
        // ref: 'User',
        default: 'Vasu' // Remove later this default
    }
})

module.exports = mongoose.model('Post', PostSchema, 'post')