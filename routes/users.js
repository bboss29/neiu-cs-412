const express = require('express')
const router = express.Router()
const { registerValidations, userController } = require('../controllers/user-controller')

router.get('/register', async (req, res, next) => {
    await userController.getRegister(req,res, next)
})
router.post('/register', registerValidations, async (req, res, next) => {
    await userController.create(req, res, next)
})

router.get('/login', async (req, res, next) => {
    await userController.getLogin(req, res, next)
})
router.post('/login', async (req, res, next) =>{
    await userController.authenticate(req, res, next)
})

router.get('/logout', async (req, res, next) => {
    await userController.logOut(req, res, next)
})

router.get('/profile', async (req, res, next) => {
    await userController.showProfile(req, res, next)
})

router.post('/updateUsername', async (req, res, next) => {
    await userController.updateUsername(req, res, next)
})

module.exports = router