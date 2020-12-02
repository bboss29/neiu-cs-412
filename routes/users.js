const express = require('express')
const router = express.Router()
const { registerValidations, userController } = require('../controllers/user-controller')

const options = {
    projectName: 'REFFER',
    layout: 'default',
    styles: [
        '../stylesheets/style.css',
        '../stylesheets/style-2.css'
    ],
    navAdd: false,
    navView: false,
    navLogin: false,
    navRegister: false,
    navProfile: false
}

router.get('/register', async (req, res, next) => {
    res.render('users/register', Object.assign(options,{
        title: 'Register',
        navAdd: false,
        navView: false,
        navLogin: false,
        navRegister: true,
        navProfile: false
    }))
})
router.post('/register', registerValidations, async (req, res, next) => {
    await userController.create(req, res, next)
})

router.get('/login', async (req, res, next) => {
    res.render('users/login', Object.assign(options,{
        title: "Login",
        navAdd: false,
        navView: false,
        navLogin: true,
        navRegister: false,
        navProfile: false
    }))
})
router.post('/login', async (req, res, next) =>{
    await userController.authenticate(req, res, next)
})

router.get('/logout', async (req, res, next) => {
    await userController.logOut(req, res, next)
})

router.get('/profile', async (req, res, next) => {
    await userController.showProfile(req, res, next, options)
})

module.exports = router