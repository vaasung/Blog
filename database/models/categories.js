const mongoose = require('mongoose')

const CategorySchema = mongoose.model({
    name: {
        type: [String]
    }
})

module.exports = mongoose.model('Category', CategorySchema)