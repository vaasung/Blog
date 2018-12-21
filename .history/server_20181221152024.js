const http = require('http')

console.clear();


const server = http.createServer((req, res) => {
        res.end('Helloo World ' + 888)

        if(req.url == '/favicon.ico'){
            return
        }
        res.statusCode = 404
        console.log(req.url);
        

    })
    .listen(3000)