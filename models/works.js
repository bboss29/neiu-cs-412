const mongoose = require('mongoose')
const WorkSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, 'Title is required'].length,
        minlength: [3, 'Minimum Title length is 3 characters']
    },
    body: {
        type: String,
        required: [true, 'Work body is required']
    },
    type: {
        type: String,
        required: [true, 'Work type is required']
    }
})

exports.Work = mongoose.model('works', WorkSchema)