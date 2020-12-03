exports.normalizePort = function (val) {
    const port = parseInt(val, 10);
    if (isNaN(port))
        return val
    if (port >= 0)
        return port
    return false
}

exports.handle404 = function (req, res, next) {
    res.status(404).send('<h2> Sorry, Page Not Found </h2>')
}

exports.basicErrorHandler = function(err, req, res, next) {
    // defer to built in error handler
    if (res.headersSent)
        return next(err)

    // set locals, only providing error in development
    res.locals.message = err.message
    res.locals.error = req.app.get('env') === 'development' ? err : {}

    // render the error page
    res.status(err.status || 500)
    res.render('error')
}

exports.onError = function (error) {
    let port = require('/app').port
    if (error.syscall !== 'listen') {
        throw error;
    }

    let bind = typeof port === 'string'
        ? 'Pipe ' + port
        : 'Port ' + port;

    // handle specific listen errors with friendly messages
    switch (error.code) {
        case 'EACCES':
            console.error(bind + ' requires elevated privileges');
            process.exit(1);
            break;
        case 'EADDRINUSE':
            console.error(bind + ' is already in use');
            process.exit(1);
            break;
        default:
            throw error;
    }
}

exports.onListening = function () {
    let server = require('./app').server
    let addr = server.address();
    let bind = typeof addr === 'string'
        ? 'pipe ' + addr
        : 'port ' + addr.port;

    let now = new Date()
    let ts = now.getHours().toPrecision(2) % 12 + ':'
        + now.getMinutes().toPrecision(2) + ':'
        + now.getSeconds().toPrecision(2)
    console.log(`[${ts}] Listening on ${bind} http://localhost:3000/`);
}