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

exports.workController = {
    findAllWorks: async () => {
        const works = await Work.find({})
        return works.map(work => {
            return {
                key: work.key,
                title: work.title,
                type: work.type
            }
        })
    },

    update: async (req, res, next) => {
        let work = await Work.findOneAndUpdate({key: req.body.workKey}, {
            title: req.body.workTitle,
            body: req.body.workBody,
            type: req.body.workType
        })
        req.flash('success', `${work.title} updated successfully`)
        res.redirect('/works/view?workKey=' + work.key)
    },

    create: async (req, res, next) => {
        let workParams = getWorkParams(req.body)
        let work = await Work.create(workParams)
        req.flash('success', `${work.title} created successfully`)
        res.redirect('/works/view?workKey=' + work.key)
    },

    read: async (key) => {
        return Work.findOne({key: key})
    },

    count: async () => {
        return await Work.countDocuments({})
    },

     destroy: async (req, res, next) => {
        await Work.findOneAndDelete({key: req.body.workKey})
        req.flash('success', `Work deleted successfully`)
        res.redirect('/works/list')
    }
}

const getWorkParams = body => {
    return {
        title: body.workTitle,
        body: body.workBody,
        type: body.workType
    }
}