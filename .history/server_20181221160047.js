const http = require('http')

console.clear();


const server = http.createServer((req, res) => {
        if (req.url == '/favicon.ico') {
            return
        }

        res.setHeader('Content-Type', 'application/json')
        // res.setHeader('Content-Type', 'text/plain')

        var o = {
            name: 'vas'
        }

        if (req.url === '/about') {
            return res.end(o.toString())
        }else if(req.url === '/contact'){
            return res.end('<h1>This is Contact page</h1>')

        }

        res.end('888')

    })
    .listen(3000)