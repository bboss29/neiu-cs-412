const http = require('http')
const fs = require('fs')
const path = require('path')
const httpCodes = require('http-status-codes')
const mime = require('mime-types')

let requestCount = 0;

let app = http.createServer((request, response ) => {
    let now = new Date()
    let ts = now.getHours() + ':' + now.getMinutes() + ':' + now.getSeconds().toPrecision(2);
    requestCount++;
    console.log(`[${ts}] [${requestCount}] Request starting...`, request.url)

    let filePath = '.' + request.url
    if (filePath === './')
        filePath = './public/views/index.html'

    fs.readFile(filePath, function (error, content) {
        if (error) {
            if (!fs.existsSync(filePath)) { // if file not found in path
                response.writeHead(httpCodes.NOT_FOUND)
                response.end()
            } else {
                response.writeHead(500)
                response.end()
            }
        } else {
            let filetype = filePath.split('.').pop()
            switch (filetype) {
                case "js":
                    response.setHeader('Content-Type', 'text/javascript')
                    response.writeHead(200)
                    response.end(content, 'utf-8')
                    break;
                case "html":
                case "css":
                    response.setHeader('Content-Type', `text/${filetype}`)
                    response.writeHead(200)
                    response.end(content, 'utf-8')
                    break;
                case "png":
                    response.setHeader('Content-Type', 'png')
                    response.writeHead(200)
                    response.end(content, 'utf-8')
                    break;
                default:
                    response.writeHead(500)
                    response.end()
                    break;
            }


        }
    })
})

app.listen(3000) // listen function calls back the createServer function
console.log('Server is running at 127.0.0.1:3000 or http://localhost:3000')