// JS File 3
const EventEmitter = require('events').EventEmitter

// print from file 2
let l = require('./link')
l.printLinkInfo()

let printCollectionInfo = function () {
    console.log("[data about the collection]")
}
exports.printCollectionInfo = printCollectionInfo

// emitters
let emitter = new EventEmitter()
const w = require('./work')
w.addWork(emitter)
for (let i = 0; i < 10; i++) {
    console.log("pre-emitter message")
    emitter.emit("newWork", "event received: " + (i + 1))
    console.log("post-emitter message")
}