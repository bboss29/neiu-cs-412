const express = require('express');
const router = express.Router();
const { workController } = require('../controllers/work-controller')

// route for creating a new item
router.get('/add', async (req, res, next) => {
    await workController.add(req, res, next)
})
router.post('/add', async (req, res, next) => {
    await workController.create(req, res, next)
})

// A route for viewing one specific item.
router.get('/view', async (req, res, next) => {
    await workController.view(req, res, next)
})

// A route for editing a specific item.
router.get('/edit', async (req, res, next) => {
    await workController.edit(req, res, next)
})
router.post('/edit', async (req, res, next) => {
    await workController.update(req, res, next)
})

// A route for viewing all saved items
router.get('/list', async function(req, res, next) {
    await workController.list(req, res, next)
})

// A route for deleting a specific item
router.get('/delete', async (req, res, next) => {
    await workController.delete(req, res, next)
})
router.post('/delete', async (req, res, next) => {
    await workController.destroy(req, res, next)
})

module.exports = router