const http = require('http')

console.clear();


const server = http.createServer((req, res) => {
        

        if(req.url == '/favicon.ico'){
            return
        }
        
        
        
        res.end( '888' )

    })
    .listen(3000)