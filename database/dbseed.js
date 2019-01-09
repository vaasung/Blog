// import {mongoose} from 'mongoose'
const mongoose = require('mongoose'),
    Post = require('./models/post')
console.clear()
mongoose.connect('mongodb://localhost:27017/blog')
    .then(d => {
        console.log(`Mongo DB started... \n${d.connections[0].name} DB connected...`);
        console.log('----------------------')
        const data = [{
            title: 'First Post',
            description: 'Sample descriptions',
            content: 'Hi this is my first Post',
            image: 'url',
            comments: 25,
            tags: ['Photography', 'Wild Life'],
            author: 'Vasu'
        }, {
            title: 'Second Post',
            description: 'Sample descriptions',
            content: 'Hi this is my Second Post',
            image: 'url',
            comments: 25,
            tags: ['Science', 'Neuro'],
            author: 'Deva'
        }]

        Post.insertMany(data)
            .then(d => {
                console.log(d, ' Data saved')
                mongoose.disconnect()
                process.on('exit', () => {
                    console.log('\n\nYour dummy database updated.\n\n --- Happy to Hacking :) ---')
                })
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