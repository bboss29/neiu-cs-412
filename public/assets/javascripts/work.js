// JS File 1
const EventEmitter = require('events').EventEmitter
let emitter = new EventEmitter()

emitter.emit('newWork', "test")

function printWorkInfo() {
    console.log("[data about the work]")
}
exports.printWorkInfo = printWorkInfo

function addWork(e) {
    e.on("newWork", function (i) { console.log(i) })
}
exports.addWork = addWork