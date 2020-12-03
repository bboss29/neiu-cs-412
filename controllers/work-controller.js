let { Work } = require('../models/works')
let { User } = require('../models/users')
let { Link } = require('../models/links')
let { linkController } = require('../controllers/link-controller')

const options = {
    projectName: 'REFFER',
    layout: 'default',
    styles: [
        '../stylesheets/style.css',
        '../stylesheets/style-2.css'
    ],
    scripts: [],
    graph: false
}

const allWorks = async (req, res, next) => {
    try {
        const works = await Work.find({})
        return works.map(work => {
            return {
                workKey: work.id,
                workTitle: work.title,
                workType: work.type,
                isMine: (req.isAuthenticated() && req.user.works.includes(work.id))
            }
        })
    } catch (error) { console.log(error) }
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
        req.user.works.push(work.id.trim())
        req.user = await User.findByIdAndUpdate({ _id: req.user.id.trim() }, { works: req.user.works }, { new:true })
        req.flash('success', `${work.title} created successfully`)
        res.redirect('/works/view?workKey=' + work.id)
    },

    destroy: async (req, res, next) => {
        req.user.works.splice(req.user.works.indexOf(req.body.workKey.trim()), 1)
        await Work.findOneAndDelete({_id: req.body.workKey.trim()})
        await User.findByIdAndUpdate({ _id: req.user.id.trim() }, { works: req.user.works })
        req.flash('success', `Work deleted successfully`)
        res.redirect('/works/list')
    },

    add: async (req, res, next) => {
        if (req.isAuthenticated()) {
            try {
                res.render('works/add_work', Object.assign(options, {
                    action: "add",
                    title: 'Add a Work',
                    navAdd: true,
                    navView: false,
                    workKey: await Work.countDocuments({}),
                    graph: false
                }))
            } catch (err) {
                next(err)
            }
        } else {
            req.flash('error', 'Please log in to access this page')
            res.redirect('../users/login')
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
                isMine: (req.isAuthenticated() && req.user.works.includes(work.id)),
                navAdd: false,
                navView: false,
                graph: false
            }))
        } catch (err) {
            console.log(err)
            next(err)
        }
    },

    edit: async (req, res, next) => {
        if (req.isAuthenticated()) {
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
                    isTVShow: work.type === "TV Show",
                    graph: false
                }))
            } catch (err) {
                next(err)
            }
        } else {
            req.flash('error', 'Please log in to access this page')
            res.redirect('../users/login')
        }
    },

    listAll: async (req, res, next) => {
        try {
            res.render('works/list_works', Object.assign(options,{
                title: "List of Works",
                navView: true,
                navAdd: false,
                workList: await allWorks(req, res, next),
                linkList: await linkController.allLinks(req, res, next),
                graph: true,
            }))
        } catch (err) {
            next(err)
        }
    },

    listMine: async (req, res, next) => {
        if (req.isAuthenticated()) {
            try {
                let workIds = req.user.works
                let workPromises = workIds.map(id => Work.findOne({ _id: id }))
                let works = await Promise.all(workPromises)
                return works.map(work => {
                    return {
                        workKey: work.id,
                        workTitle: work.title,
                        workType: work.type
                    }
                })
            } catch (err) {
                next(err)
            }
        } else {
            req.flash('error', 'Please log in to access this page')
            res.redirect('../users/login')
        }
    },

    delete: async (req, res, next) => {
        if (req.isAuthenticated()) {
            try {
                const links = await Link.find({})
                let allLinks = links.map(link => {
                    return {
                        id: link.id,
                        source: link.source,
                        target: link.target,
                        body: link.body
                    }
                })
                let src = []
                let tar = []
                let self = []
                let workId = req.query.workKey
                for (let l = 0; l < allLinks.length; l++) {
                    if (allLinks[l].source.equals(allLinks[l].target)) // skip self-references
                        self.push(allLinks[l])
                    else if (allLinks[l].source.equals(workId))
                        src.push(allLinks[l])
                    else if (allLinks[l].target.equals(workId))
                        tar.push(allLinks[l])
                }
                if (src.length + tar.length + self.length === 0) {
                    let work = await Work.findOne({_id: req.query.workKey.trim()})
                    res.render('works/delete_work', Object.assign(options,{
                        action: "delete",
                        title: "Delete this Work?",
                        workTitle: work.title,
                        workKey: work.id,
                        workBody: work.body,
                        workType: work.type
                    }))
                } else {
                    req.flash('error', 'Cannot delete linked work. Delete links first')
                    res.redirect('back')
                }
            } catch (err) {
                next(err)
            }
        } else {
            req.flash('error', 'Please log in to access this page')
            res.redirect('../users/login')
        }
    },
    allWorks : allWorks
}

const getWorkParams = body => {
    return {
        title: body.workTitle,
        body: body.workBody,
        type: body.workType
    }
}

