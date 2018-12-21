const http = require('http')

console.clear();


const server = http.createServer((req, res) => {
        if(req.url == '/favicon.ico'){
            return
        }

        res.setHeader('ContentType', 'plain/html')
        
        
        if(req.url === '/about'){
                res.end( 'This is about page' )
        }
        
        res.end( '888' )

    })
    .listen(3000)