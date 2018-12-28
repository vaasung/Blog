const mongoose = require('mongoose'),
    bcrypt = require('mongoose-bcrypt')

userScheme = new mongoose.Schema({
    firstName: {
        type: String,
        required: [true, 'First name is required....']
    },
    lastName: {
        type: String,
        required: [true, 'Last name is required....']
    },
    email: {
        type: String,
        unique: true
    },
    password: {
        type: String,
        required: [true, 'Password Required'],
        bcrypt: true
    },
    photo: String,
    dob: Date,
    gender: String,
    createdAt: {
        type: Date,
        default: Date.now()
    }
})
userScheme.plugin(bcrypt)

module.exports = mongoose.model('User', userScheme)