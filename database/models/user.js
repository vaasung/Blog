const mongoose = require('mongoose'),
    bcrypt = require('mongoose-bcrypt')


const emailValidation = (email => {
    let emailRegex = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return emailRegex.test(email)
}, 'You r invalid email')


UserScheme = new mongoose.Schema({
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
        required: [true, 'Email is required....'],
        unique: true
        // validate: emailValidation
    },
    password: {
        type: String,
        required: [true, 'Password Required'],
        bcrypt: true
    },
    nickName: String,
    title: String,
    country: String,
    dob: Date,
    gender: String,
    website: String,
    profilePic: {
        type: String,
        default: '/cl/files/images/profile_images/d/avatarD.png'
    },
    coverPic: {
        type: String,
        default: '/cl/files/images/profile_images/d/coverD.jpg'
    },
    description: {
        type: String,
        default: 'Lorum ipsum'
    },
    createdAt: {
        type: Date,
        default: Date.now()
    }
})

UserScheme.plugin(bcrypt)

UserScheme.path('email').validate(email => {
    let emailRegex = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return emailRegex.test(email)
}, 'This Email is invalid...')

module.exports = mongoose.model('User', UserScheme)