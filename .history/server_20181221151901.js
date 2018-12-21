const http = require('http')

console.clear();


const server = http.createServer((req, res) => {
        res.end('Helloo World ' + 888)

        console.log(req.url == '/favicon.ico');

    })
    .listen(3000)