const http = require('http'),
    fs = require('fs'),
    path = require('path'),
    express = require('express'),
    mongoose = require('mongoose'),
    fileUpload = require('express-fileupload'),
    router = express.Router()

const Post = require('./database/models/post'),
    User = require('./database/models/user')

//max-old-space-size=4096 fileneme.js

require('dotenv').config()

const blog = express()

console.clear()
console.log(''.padEnd(180, '#'))

mongoose
    .connect('mongodb://localhost:27017/blog')
    .then(d => {
        console.log(
            `Mongo DB started... \n${d.connections[0].name} DB connected...`
        )
    })
    .catch(e => {
        console.log(e, ' Mongo DB error')
    })

blog.engine('html', require('ejs').renderFile)
blog.set('view engine', 'html')
blog.set('views', path.join(__dirname, 'client/templates'))

// blog.set('view engine', 'ejs')

const midd = (req, res, next) => {
    console.log('Hello from Middleware')
    next()
}

blog.use(fileUpload())
blog.use('/cl', express.static(path.resolve(__dirname, 'client')))
blog.use([
    express.json(),
    express.urlencoded({
        extended: true
    })
])

// blog.use('/post/:id', function (req, res, next) {

// return path.join('.', 'post', req.params.file).apply(this, arguments);
// });

blog.get('/', (request, response) => {
    // response.sendFile(path.resolve(__dirname, 'demoHtml/index.html'))
    // response.send('888')
    // response.sendFile(path.resolve(__dirname, 'client/index.html'))
    response.render('index', {
        title: 'BlogR© Home Page'
    })
})

blog.get('/post/:id', async (request, response) => {
    const post = await Post.findById({
        _id: request.params.id
    })
    response.render('pages/post', {
        title: 'Single Post',
        post
    })
})

blog.get('/posts', async (request, response) => {
    // response.sendFile(path.resolve(__dirname, 'demoHtml/index.html'))
    // response.sendFile(path.resolve(__dirname, 'client/index.html'))
    const posts = await Post.find({}).sort({
        createdAt: -1
    })

    response.render('pages/posts', {
        title: 'Post',
        active: true,
        posts
    })
})
blog.get('/admin', (request, response) => {
    // response.sendFile(path.resolve(__dirname, 'demoHtml/index.html'))
    // response.send('888')
    // response.sendFile(path.resolve(__dirname, 'client/index.html'))
    response.render('pages/add_post', {
        title: 'Adding Post'
    })
})

blog.post('/post/add', (request, response) => {
    let data = request.body
    const {
        poster
    } = request.files
    data.image = poster.name

    Post.create(data)
        .then(d => {
            poster.mv(
                path.resolve(__dirname, `client/files/images/${d._id}_${data.image}`),
                error => {
                    if (error) {
                        console.log(error)
                    }
                    // update imagename
                    Post.findByIdAndUpdate({
                            _id: d._id
                        }, {
                            $set: {
                                image: `files/images/${d._id}_${data.image}`
                            }
                        })
                        .then(e => console.log('image succefully added ', e))
                        .catch(e => console.log(e))
                }
            )

            response.redirect('/posts')
        })
        .catch(e => {
            response.send(e.message)
            // response.end()
        })
    // console.log(data)
    response.end('data')
})

blog.get('/register', (request, response) => {
    response.render('pages/register', {
        title: 'User Registration'
    })
})

blog.post('/user/register', (request, response) => {
    console.log(Post)
    const body = request.body
    User.create(body)
        .then(d => {
            console.log(d)
            response.send(d)
        })
        .catch(e => {
            console.log(e)
            response.send(e)
        })
})

blog.listen(process.env.PORT || 3000, () => {
    console.log(
        `App is runing on the 'http(s)://${process.env.HOST}:${process.env.PORT}`
    )
})

process.on('SIGINT', () => {
    console.log('Bye'.padEnd(100, '.'))
    mongoose.disconnect()
    process.exit()
})
/*
const fileIndex = fs.readFileSync('./index.html'),
fileAbout = fs.readFileSync('./about.html', 'utf-8')
    
const server = http.createServer((req, res) => {
    // res.setHeader('Content-Type', 'text/plain')
    switch (req.url) {
        case '/favicon.ico':
        return
        break
        case '/':
        return res.end(fileIndex)
        break
        case '/about':
        res.write(fileAbout)
        return res.end()
        break
        case '/contact':
        return res.end('<h1>This is Contact page</h1>')
        default:
        res.writeHead(404)
        return res.end('No page found')
        break
    }
})
.listen(3000)
*/