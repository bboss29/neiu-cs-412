const http = require('http')
const fs = require('fs')
const path = require('path')
const httpCodes = require('http-status-codes')
const mime = require('mime-types')

const routes = {
    '/': './public/views/index.html',
    '/about': './public/views/about.html'
}

let requestCount = 0

let app = http.createServer((request, response ) => {
    let now = new Date()
    let ts = now.getHours().toPrecision(2) + ':'
        + now.getMinutes().toPrecision(2) + ':'
        + now.getSeconds().toPrecision(2)
    requestCount++;
    console.log(`[${ts}] [${requestCount}] Request starting...`, request.url)

    let route = routes[request.url] ? routes[request.url] : '.' + request.url

    if (fs.existsSync(route)) {
        fs.readFile(route, function (error, content) {
            if (error) {
                response.writeHead(httpCodes.INTERNAL_SERVER_ERROR)
                response.end()
            } else {
                let filetype = mime.lookup(route)
                response.setHeader('Content-Type', filetype)
                response.writeHead(httpCodes.ACCEPTED)
                response.end(content, mime.charset(filetype))
            }
        })
    } else {
        response.writeHead(httpCodes.NOT_FOUND)
        response.end()
    }
})

app.listen(3000) // listen function calls back the createServer function
console.log('Server is running at 127.0.0.1:3000 or http://localhost:3000')