// JS File 3
const EventEmitter = require('events').EventEmitter

// print from file 2
let l = require('./link')
l.printLinkInfo()

let printCollectionInfo = function () {
    console.log("[data about the collection]")
}
// exports.printCollectionInfo = printCollectionInfo

// HW05 emitters
let emitter = new EventEmitter()
const w = require('./work')
w.addWork(emitter)
for (let i = 0; i < 10; i++) {
    // console.log("pre-emitter message")
    // emitter.emit("newWork", "event received: " + (i + 1))
    // console.log("post-emitter message")
}

// HW04 demo
let demo = require('./gql_demo')

module.exports = {
    createWork : demo.createWork,
    showWorks : demo.showWorks,
    showLinks : demo.showLinks,
    createLink : demo.createLink,
    linkUp : demo.linkUp,
    printCollectionInfo : printCollectionInfo
}