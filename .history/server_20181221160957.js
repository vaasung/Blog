const http = require('http')

console.clear();


const server = http.createServer((req, res) => {
        // if (req.url == '') {
        //     return
        // }

    
        res.setHeader('Content-Type', 'text/plain')


        switch (req.url) {
            case '/favicon.ico':
                return
                break;
            case '/about':
                res.write('THis is about us page')
                return res.end()
                break;
            case '/contact':
                return res.end('<h1>This is Contact page</h1>')

            default:
                res.end('888')
                break;
        }

    })
    .listen(3000)