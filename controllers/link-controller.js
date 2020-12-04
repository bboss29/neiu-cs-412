let { Link } = require('../models/links')
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

    add: async (req, res, next) => {
        if (req.isAuthenticated()) {
            try {
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

    view: async (req, res, next) => {
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
            let workIds = []
            let src = []
            let tar = []
            let self = []
            let workId = req.query.workKey
            for (let l = 0; l < allLinks.length; l++) {
                if (allLinks[l].source.equals(allLinks[l].target))
                    self.push(allLinks[l])
                else if (allLinks[l].source.equals(workId))
                    src.push(allLinks[l])
                else if (allLinks[l].target.equals(workId))
                    tar.push(allLinks[l])

                if (workIds.indexOf(allLinks[l].source) === -1)
                    workIds.push(allLinks[l].source)
                if (workIds.indexOf(allLinks[l].target) === -1)
                    workIds.push(allLinks[l].target)
            }

            if (src.length + tar.length + self.length === 0) {
                req.flash('error', 'There are no links for this work!')
                res.redirect('back')
            } else {
                let work = await Work.findOne({_id : workId})

                // // TODO
                // // create list of all works
                // let workPromises = workIds.map(id => Work.findOne({ _id: id }))
                // let works = await Promise.all(workPromises)
                // let allWorks = works.map(work => {
                //     return {
                //         workKey: work.id,
                //         workTitle: work.title,
                //         workType: work.type,
                //         isMine: true
                //     }
                // })
                // // access allWorks and map to the links
                // src = src.map(link => {
                //     let s = link.source
                //     let t = link.target
                //     return {
                //         id: link.id,
                //         source: link.source,
                //         target: link.target,
                //         body: link.body,
                //         isMine: link.isMine,
                //         sourceTitle: link.source.title,
                //         targetTitle: link.target.title,
                //     }
                // })

                res.render('links/list_links', Object.assign(options,{
                    title: "Link Details for " + work.title,
                    navAdd: false,
                    navView: false,
                    graph: false,
                    src: src,
                    tar: tar,
                    self: self,
                    workTitle: work.title,
                    workKey: work.id,
                    workBody: work.body,
                    workType: work.type,
                    test: "Test"
                }))
            }
        } catch (err) {
            console.log(err)
            next(err)
        }
    },

    delete: async (req, res, next) => {
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
        body: body.body,
        source: body.source,
        target: body.target,
    }
}

