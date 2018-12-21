const http = require('http')

console.clear();


const server = http.createServer((req, res) => {
        if (req.url == '/favicon.ico') {
            return
        }

        // res.setHeader('Content-Type', 'text/plain')

        if (req.url === '/about') {
            return res.end('<h1>This is about page</h1>')
        }else if()

        res.end('888')

    })
    .listen(3000)