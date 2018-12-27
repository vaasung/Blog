const mongoose = require('mongoose')

userScheme = new mongoose.Schema({
    firstName: {
        type: String,
        required: [true, 'First name is required']
    },
    lastName: {
        type: String,
        required: [true, 'Last name is required']
    },
    email: {
        type: String,
        unique: true
    },
    password: {
        type: String,
        required: [true, 'Password Required']
    },
    avatorUrl: String
})
module.exports = mongoose.model('User', userScheme)