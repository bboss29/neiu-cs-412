const express = require('express');
const router = express.Router();
const { linkController } = require('../controllers/link-controller')

// route for creating a new item
router.get('/add', async (req, res, next) => {
    await linkController.add(req, res, next)
})
router.post('/add', async (req, res, next) => {
    await linkController.create(req, res, next)
})

// A route for viewing one specific item.
router.get('/view', async (req, res, next) => {
    await linkController.view(req, res, next)
})

// A route for deleting a specific item
router.get('/delete', async (req, res, next) => {
    await linkController.delete(req, res, next)
})
router.post('/delete', async (req, res, next) => {
    await linkController.destroy(req, res, next)
})

module.exports = router