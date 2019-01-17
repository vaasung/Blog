const mongoose = require('mongoose')

module.exports = mongoose.model('Topic', {
    title: String
})