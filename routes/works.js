const express = require('express');
const router = express.Router();
const { workController } = require('../controllers/work-controller')

let options = {
    projectName: 'REFFER',
    layout: 'default',
    styles: [
        '../stylesheets/style.css',
        '../stylesheets/style-2.css'
    ]
}

// route for creating a new item
router.get('/add', async (req, res, next) => {
    try {
        res.render('works/add_work', Object.assign(options, {
            action: "add",
            title: 'Add a Work',
            navAdd: true,
            navView: false,
            workKey: await workController.count() // worksStore.count()
        }))
    } catch (err) {
        next(err)
    }
})
router.post('/add', async (req, res, next) => {
    await workController.create(req, res, next)
})

// A route for viewing one specific item.
router.get('/view', async (req, res, next) => {
    try {
        let work = await workController.read(req.query.workKey)
        res.render('works/view_work', Object.assign(options,{
            title: "Work Details",
            workTitle: work.title,
            workKey: work.key,
            workBody: work.body,
            workType: work.type,
            navAdd: false,
            navView: false,
        }))
    } catch (err) {
        next(err)
    }
})

// A route for editing a specific item.
router.get('/edit', async (req, res, next) => {
    try {
        let work = await workController.read(req.query.workKey)
        res.render('works/edit_work', Object.assign(options, {
            action: "edit",
            title: "Update",
            workTitle: work.title,
            workKey: work.key,
            workBody: work.body,
            workType: work.type,
            isBook: work.type === "Book",
            isMovie: work.type === "Movie",
            isTVShow: work.type === "TV Show"
        }))
    } catch (err) {
        next(err)
    }
})
router.post('/edit', async (req, res, next) => {
    await workController.update(req, res, next)
})

// A route for viewing all saved items
router.get('/list', async function(req, res, next) {
    try {
        let allWorks = await workController.findAllWorks()
        res.render('works/list_works', Object.assign(options,{
            title: "List of Works",
            navView: true,
            navAdd: false,
            workList: extractWorksToLiteral(allWorks)
        }))
    } catch (err) {
        next(err)
    }
})

// A route for deleting a specific item
router.get('/delete', async (req, res, next) => {
    try {
        let work = await workController.read(req.query.workKey)
        res.render('works/delete_work', Object.assign(options,{
            action: "delete",
            title: "Delete this Work?",
            workTitle: work.title,
            workKey: work.key,
            workBody: work.body,
            workType: work.type
        }))
    } catch (err) {
        next(err)
    }
})
router.post('/delete', async (req, res, next) => {
    await workController.destroy(req, res, next)
})

function extractWorksToLiteral(allWorks) {
    return allWorks.map(work => {
        return {
            workKey : work.key,
            workTitle: work.title,
            workType: work.type
        }
    })
}

module.exports = router