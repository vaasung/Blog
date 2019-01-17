const mongoose = require('mongoose')

const TagSchema = mongoose.Schema({
    title: String,
    topic: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Topic'
    }]
})

module.exports = mongoose.model('Tag', TagSchema)