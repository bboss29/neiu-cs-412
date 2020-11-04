const express = require('express');
const router = express.Router();
let worksStore = require('../app').worksStore

let options = {
    projectName: 'Reffer',
    layout: 'default',
    styles: [
        '../stylesheets/style.css',
        '../stylesheets/style-2.css'
    ]
}

// route for creating a new item
router.get('/add', async (req, res, next) => {
    try {
        res.render('add_work', Object.assign(options, {
            action: "add",
            title: 'Add a Work',
            workKey: await worksStore.count()
        }))
    } catch (err) {
        next(err)
    }
})

router.post('/save', async (req, res, next) => {
    try {
        switch (req.body.action) {
            case "add":
                await worksStore.create(
                    req.body.workKey,
                    req.body.workTitle,
                    req.body.workBody,
                    req.body.workType
                )
                res.redirect('/works/view?workKey=' + req.body.workKey)
                break;
            case "edit":
                await worksStore.update(
                    req.body.workKey,
                    req.body.workTitle,
                    req.body.workBody,
                    req.body.workType
                )
                res.redirect('/works/view?workKey=' + req.body.workKey)
                break;
            case "delete":
                await worksStore.update(
                    req.body.workKey,
                    req.body.workTitle,
                    req.body.workBody,
                    req.body.workType
                )
                res.redirect('/works/list')
                break;
        }
    } catch (err) {
        next(err)
    }
})

// A route for viewing one specific item.
router.get('/view', async (req, res, next) => {
    try {
        let work = await worksStore.read(req.query.workKey)
        res.render('view_work', Object.assign(options,{
            title: "View Work",
            workTitle: work.title,
            workKey: work.key,
            workBody: work.body,
            workType: work.type
        }))
    } catch (err) {
        next(err)
    }
})

// A route for editing a specific item.
router.get('/edit', async (req, res, next) => {
    try {
        let work = await worksStore.read(req.query.workKey)
        res.render('edit_work', Object.assign(options, {
            action: "edit",
            title: "Edit a Work",
            workTitle: work.title,
            workKey: work.key,
            workBody: work.body,
            workType: work.type
        }))
    } catch (err) {
        next(err)
    }
})

// A route for viewing all saved items
router.get('/list', async function(req, res, next) {
    try {
        let keyList = await worksStore.keyList()
        let keyPromises = keyList.map(key => {
            return worksStore.read(key)
        })
        let allWorks = await Promise.all(keyPromises)
        res.render('list_works', Object.assign(options,{
            title: "List of Works",
            workList: extractWorksToLiteral(allWorks)
        }))
    } catch (err) {
        next(err)
    }
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

// A route for deleting a specific item
router.get('/delete', async (req, res, next) => {
    try {
        let work = await worksStore.read(req.query.workKey)
        res.render('delete_work', Object.assign(options,{
            action: "delete",
            title: "Delete a Work",
            workTitle: work.title,
            workKey: work.key,
            workBody: work.body,
            workType: work.type
        }))
    } catch (err) {
        next(err)
    }
})

module.exports = router