const http = require('http'),
    fs = require('fs'),
    path = require('path'),
    express = require('express')

require('dotenv').config()
const blog = express()

console.clear()
console.log(''.padEnd(180, '#'))


blog.engine('html', require('ejs').renderFile)
blog.set('view engine', 'html')
blog.set('views', path.join(__dirname, 'client/templates'))

// blog.set('view engine', 'ejs')

blog.use('/cl', express.static(path.resolve(__dirname, 'client')))

blog.get('/', (request, response) => {
    // response.sendFile(path.resolve(__dirname, 'demoHtml/index.html'))
    // response.send('888')
    // response.sendFile(path.resolve(__dirname, 'client/index.html'))
    response.render('index', {
        title: 'Wow first ejs file'
    })
})

blog.listen(process.env.PORT, () => {
    console.log(
        `App is runing on the 'http(s)://${process.env.HOST}:${process.env.PORT}'`
    )
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