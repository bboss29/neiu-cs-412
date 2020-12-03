const mongoose = require('mongoose')
const SchemaTypes = mongoose.SchemaTypes

const LinkSchema = new mongoose.Schema({
    title: {
        type: String,
    },
    body: {
        type: String,
        required: [true, 'Link body is required']
    },
    source: {
        type: SchemaTypes.ObjectID,
        ref: 'Work'
    },
    target: {
        type: SchemaTypes.ObjectID,
        ref: 'Work'
    },
    sourceTitle: {
        type: String
    },
    targetTitle: {
        type: String
    }

})

exports.Link = mongoose.model('links', LinkSchema)