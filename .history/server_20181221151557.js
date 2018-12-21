const http = require('http')

console.clear();


const server = http.createServer((req, res) => {
    res.end('Helloo World '+ 888)
    })
    .listen(3000)