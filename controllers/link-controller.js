let Link = require('../models/links').Link
let { User } = require('../models/users')
let { Work } = require('../models/works')
let { workController } = require('../controllers/work-controller')

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

const allLinks = async (req, res, next) => {
    const links = await Link.find({})
    return links.map(link => {
        let isMine = false
        if (req.isAuthenticated()) isMine = req.user.links.includes(link.id)
        return {
            // id: link.id,
            source: link.source,
            target: link.target,
            isMine: true
        }
    })
}

exports.linkController = {
    update: async (req, res, next) => { //TODO
        let link = await Link.findOneAndUpdate({_id: req.body.linkKey.trim()}, {
            body: req.body.linkBody,
        })
        req.flash('success', `${link.body} updated successfully`)
        res.redirect('/links/view?linkKey=' + link.id)
    },

    create: async (req, res, next) => {
        let linkParams = getLinkParams(req.body)
        let link = await Link.create(linkParams)
        req.user.links.push(link.id.trim())
        req.user = await User.findByIdAndUpdate({ _id: req.user.id.trim() }, { links: req.user.links }, { new:true })
        req.flash('success', `Link created successfully`)
        res.redirect('/works/list')
    },

    destroy: async (req, res, next) => {
        await Link.findOneAndDelete({_id: req.body.linkKey.trim()})
        req.flash('success', `Link deleted successfully`)
        res.redirect('/works/list')
    },

    add: async (req, res, next) => { // TODO
        if (req.isAuthenticated()) { // req.isAuthenticated()
            try {
                // let aw = await workController.allWorks(req, res, next) // TODO unhandled promise
                const works = await Work.find({})
                let allWorks = works.map(work => {
                    let isMine = false
                    if (req.isAuthenticated()) isMine = req.user.works.includes(work.id)
                    return {
                        workKey: work.id,
                        workTitle: work.title,
                        workType: work.type,
                        isMine: isMine
                    }
                })
                let work = await Work.findOne({_id: req.query.workKey.trim()})
                res.render('links/add_link', Object.assign(options, {
                    action: "add",
                    title: 'Add a Link',
                    navAdd: true,
                    navView: false,
                    linkKey: await Link.countDocuments({}),
                    graph: false,
                    allWorks: allWorks,
                    srcWorkTitle: work.title,
                    srcWorkId: work.id
                }))
            } catch (err) {
                next(err)
            }
        } else {
            req.flash('error', 'Please log in to access this page')
            res.redirect('../users/login')
        }
    },

    view: async (req, res, next) => { // TODO
        try {
            const links = await Link.find({})
            let allLinks = links.map(link => {
                return {
                    id: link.id,
                    source: link.source,
                    target: link.target,
                    body: link.body,
                    isMine: (req.isAuthenticated() && req.user.links.includes(link.id))
                }
            })

            let src = []
            let tar = []
            let self = []
            // let workIds = []
            let workId = req.query.workKey
            for (let l = 0; l < allLinks.length; l++) {
                if (allLinks[l].source.equals(allLinks[l].target)) // skip self-references
                    self.push(allLinks[l])
                else if (allLinks[l].source.equals(workId))
                    src.push(allLinks[l])
                else if (allLinks[l].target.equals(workId))
                    tar.push(allLinks[l])

                // if (workIds.indexOf(allLinks[l].source) === -1)
                //     workIds.push(allLinks[l].source)
                // if (workIds.indexOf(allLinks[l].target) === -1)
                //     workIds.push(allLinks[l].target)
            }
            if (src.length + tar.length + self.length === 0) {
                req.flash('error', 'There are no links for this work!')
                res.redirect('back')
            } else {
                let work = await Work.findOne({_id : workId})

                res.render('links/view_link', Object.assign(options,{
                    title: "Link Details",
                    navAdd: false,
                    navView: false,
                    graph: false,
                    src: src,
                    tar: tar,
                    self: self,
                    workTitle: work.title,
                    workKey: work.id,
                    workBody: work.body,
                    workType: work.type
                }))
            }


        } catch (err) {
            console.log(err)
            next(err)
        }
    },

    edit: async (req, res, next) => { // TODO
        if (req.isAuthenticated()) {
            try {
                let link = await Link.findOne({_id: req.query.linkKey.trim()})
                res.render('links/edit_link', Object.assign(options, {
                    action: "edit",
                    title: "Update",
                    linkTitle: link.title,
                    linkKey: link.id,
                    linkBody: link.body,
                    linkType: link.type,
                    isBook: link.type === "Book",
                    isMovie: link.type === "Movie",
                    isTVShow: link.type === "TV Show",
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

    listAll: async (req, res, next) => { // TODO
        try {
            res.render('links/list_links', Object.assign(options,{
                title: "List of Links",
                navView: true,
                navAdd: false,
                linkList: await allLinks(req, res, next),
                graph: true,
            }))
        } catch (err) {
            next(err)
        }
    },

    listMine: async (req, res, next) => { // TODO
        if (req.isAuthenticated()) {
            try {
                let linkIds = req.user.links
                let linkPromises = linkIds.map(id => Link.findOne({ _id: id }))
                let links = await Promise.all(linkPromises)
                return links.map(link => {
                    return {
                        source: link.source,
                        target: link.target,
                        linkTitle: link.title,
                        linkBody: link.body
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

    delete: async (req, res, next) => { // TODO
        if (req.isAuthenticated()) {
            try {
                let link = await Link.findOne({_id: req.query.workKey})
                res.render('links/delete_link', Object.assign(options, {
                    action: "delete",
                    title: "Delete this Link?",
                    linkTitle: link.title,
                    linkKey: link.id,
                    linkBody: link.body,
                    linkType: link.type
                }))

            } catch (err) {
                next(err)
            }
        } else {
            req.flash('error', 'Please log in to access this page')
            res.redirect('../users/login')
        }
    },

    allLinks: allLinks
}

const getLinkParams = body => {
    return {
        title: body.title,
        body: body.body,
        source: body.source,
        sourceTitle: body.sourceTitle,
        target: body.target,
        targetTitle: body.target
    }
}

