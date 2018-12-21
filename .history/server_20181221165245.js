const http = require('http'),
    fs = require('fs')




console.clear()
console.log(''.padEnd(180, '-'))


const fileIndex = fs.readFileSync('./index.html'),
    fileAbout = fs.readFileSync('./about.html')
    

    console.log(fileAbout, 'utf-8')

const server = http.createServer((req, res) => {

        // res.setHeader('Content-Type', 'text/plain')


        switch (req.url) {
            case '/favicon.ico':
                return
                break
            case '/':
                return res.end('888')
                break
            case '/about':
                res.write('THis is about us page')
                return res.end()
                break
            case '/contact':
                return res.end('<h1>This is Contact page</h1>')
            default:
                res.writeHead(404)
                return res.end('No page found')
                break
        }
    })
    .listen(3000)