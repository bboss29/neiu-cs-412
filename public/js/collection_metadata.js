// JS File 3
let l = require('./link_metadata')
let w = require('./work_metadata')
exports.printCollectionInfo = function() {
    console.log("[data about the collection]")
}

exports.printLinkInfo = l.printLinkInfo
exports.printWorkInfo = w.printWorkInfo