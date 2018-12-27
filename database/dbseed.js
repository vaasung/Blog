// import {mongoose} from 'mongoose'
const mongoose = require('mongoose'),
    Post = require('./post')
console.clear()
mongoose.connect('mongodb://localhost:27017/blog')
    .then(d => {
        console.log(`Mongo DB started... \n${d.connections[0].name} DB connected...`);
        console.log('----------------------')
        const data = [{
            name: 'First Post',
            description: 'Sample descriptions',
            content: 'Hi this is my first Post'
        }, {
            name: 'Second Post',
            description: 'Sample descriptions',
            content: 'Hi this is my 2nd Post'
        }]

        Post.insertMany(data)
            .then(d => {
                console.log(d, ' Data saved')
                mongoose.disconnect()
            })
            .catch(e => {
                console.log(e, ' Error has created')
            })
    })
    .catch(e => {
        console.log(e, ' Mongo DB connection error')
        mongoose.disconnect()
        // return
    })