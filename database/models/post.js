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
    tags: [],
    comments: [{
        author: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        },
        comment: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Comments'
        }],
        commentedDate: {
            type: Date,
            default: Date.now()
        }
    }],
    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        default: 'Vasu' // Remove later this default
    }
})

module.exports = mongoose.model('Post', PostSchema, 'post')