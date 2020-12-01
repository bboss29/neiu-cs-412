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
    update: async (req, res, next) => {
        let work = await Work.findOneAndUpdate({_id: req.body.workKey.trim()}, {
            title: req.body.workTitle,
            body: req.body.workBody,
            type: req.body.workType
        })
        req.flash('success', `${work.title} updated successfully`)
        res.redirect('/works/view?workKey=' + work.id)
    },

    create: async (req, res, next) => {
        let workParams = getWorkParams(req.body)
        let work = await Work.create(workParams)
        req.flash('success', `${work.title} created successfully`)
        res.redirect('/works/view?workKey=' + work.id)
    },

    destroy: async (req, res, next) => {
        await Work.findOneAndDelete({_id: req.body.workKey.trim()})
        req.flash('success', `Work deleted successfully`)
        res.redirect('/works/list')
    },

    add: async (req, res, next) => {
        try {
            res.render('works/add_work', Object.assign(options, {
                action: "add",
                title: 'Add a Work',
                navAdd: true,
                navView: false,
                workKey: await Work.countDocuments({})
            }))
        } catch (err) {
            next(err)
        }
    },

    view: async (req, res, next) => {
        try {
            let work = await Work.findOne({_id: req.query.workKey.trim()})
            res.render('works/view_work', Object.assign(options,{
                title: "Work Details",
                workTitle: work.title,
                workKey: work.id,
                workBody: work.body,
                workType: work.type,
                navAdd: false,
                navView: false,
            }))
        } catch (err) {
            console.log(err)
            next(err)
        }
    },

    edit: async (req, res, next) => {
        try {
            let work = await Work.findOne({_id: req.query.workKey.trim()})
            res.render('works/edit_work', Object.assign(options, {
                action: "edit",
                title: "Update",
                workTitle: work.title,
                workKey: work.id,
                workBody: work.body,
                workType: work.type,
                isBook: work.type === "Book",
                isMovie: work.type === "Movie",
                isTVShow: work.type === "TV Show"
            }))
        } catch (err) {
            next(err)
        }
    },

    list: async (req, res, next) => {
        try {
            const works = await Work.find({})
            let allWorks = works.map(work => {
                return {
                    workKey: work.id,
                    workTitle: work.title,
                    workType: work.type
                }
            })
            res.render('works/list_works', Object.assign(options,{
                title: "List of Works",
                navView: true,
                navAdd: false,
                workList: allWorks
            }))
        } catch (err) {
            next(err)
        }
    },

    delete: async (req, res, next) => {
        try {
            let work = await Work.findOne({_id: req.query.workKey.trim()})
            res.render('works/delete_work', Object.assign(options,{
                action: "delete",
                title: "Delete this Work?",
                workTitle: work.title,
                workKey: work.id,
                workBody: work.body,
                workType: work.type
            }))
        } catch (err) {
            next(err)
        }
    }
}

const getWorkParams = body => {
    return {
        title: body.workTitle,
        body: body.workBody,
        type: body.workType
    }
}