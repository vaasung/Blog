const http = require('http')

console.clear();


const server = http.createServer((req, res) => {
        

        if(req.url == '/favicon.ico'){
            return
        }
        
        // console.log(req);
        res.end( req.url )

    })
    .listen(3000)