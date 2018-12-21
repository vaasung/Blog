const http = require('http')

console.clear();


const server = http.createServer((req, res) => {
        if(req.url == '/favicon.ico'){
            return
        }

        // res.setHeader('Content-Type', 'plain/text')
        
console.log(res.get('Content-Type'));

        
        if(req.url === '/about'){
                res.end( '<h1>This is about page</h1>' )
        }
        
        res.end( '888' )

    })
    .listen(3000)