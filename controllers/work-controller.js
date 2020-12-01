let Work = require('../models/works').Work
const {body, validationResult} = require('express-validator')

let options = {
    projectName: 'REFFER',
    layout: 'default',
    styles: [
        '../stylesheets/style.css',
        '../stylesheets/style-2.css'
    ]
}

const mongoose = require('mongoose')
const connectDB = async () => {
    try {
        await mongoose.connect(process.env.DB_URL, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            useFindAndModify: false
        })
    } catch (err) { console.log(err) }
}

exports.workController = {
    findAllWorks: async () => {
        await connectDB()
        const works = await Work.find({})
        await mongoose.disconnect()
        return works.map(work => {
            return {
                key: work.key,
                title: work.title,
                type: work.type
            }
        })
    },

    update: async (req, res, next) => {
        await connectDB()
        let work = await Work.findOneAndUpdate({key: req.body.workKey}, {
            title: req.body.workTitle,
            body: req.body.workBody,
            type: req.body.workType
        })
        await mongoose.disconnect()
        req.flash('success', `${work.title} updated successfully`)
        res.redirect('/works/view?workKey=' + work.key)
    },

    create: async (req, res, next) => {
        await connectDB()
        let workParams = getWorkParams(req.body)
        let work = await Work.create(workParams)
        await mongoose.disconnect()
        req.flash('success', `${work.title} created successfully`)
        res.redirect('/works/view?workKey=' + work.key)
    },

    read: async (key) => {
        await connectDB()
        const work = await Work.findOne({key: key})
        await mongoose.disconnect()
        return work
    },

    count: async () => {
        await connectDB()
        const count = await Work.countDocuments({})
        await mongoose.disconnect()
        return count
    },

     destroy: async (req, res, next) => {
        await connectDB()
        let workParams = getWorkParams(req.body)
        await Work.findOneAndDelete({key: req.body.workKey})
        await mongoose.disconnect()
        req.flash('success', `Work deleted successfully`)
        res.redirect('/works/list')
    }
}

const getWorkParams = body => {
    return {
        key: body.workKey,
        title: body.workTitle,
        body: body.workBody,
        type: body.workType
    }
}