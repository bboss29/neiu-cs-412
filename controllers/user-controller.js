let User = require('../models/users').User
const {body, validationResult} = require('express-validator')
const passport = require('passport')
const { workController } = require('../controllers/work-controller')

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
    navProfile: false,
    graph: false
}

const authenticate = async (req, res, next) => {
    await passport.authenticate('local', function(err, user, info) {
        if (err) return next(err)
        if (!user) {
            req.flash('error', 'Failed to login')
            return res.redirect('/users/login')
        }
        req.logIn(user, function (err) {
            if (err) return next(err)
            req.flash('success', `${user.username} logged in!`)
            return res.redirect('/')
        })
    })(req, res, next);
}

exports.userController = {
    create : async (req, res, next) => {
        const errors = validationResult(req)
        if (!errors.isEmpty()) {
            req.flash('error', errors.array().map(e => e.msg + '</br>').join(''))
            res.redirect('/users/register')
        } else {
            try {
                let userParams = getUserParams(req.body)
                let newUser = new User(userParams)
                let user = await User.register(newUser, req.body.password)
                req.flash('success', `${user.username}'s account created successfully`)
                res.redirect('/users/login')
            } catch (error) {
                req.flash(`error`, `Failed to create user`)
                res.redirect('/users/register')
            }
        }
    },

    authenticate: authenticate,

    logOut: async (req, res, next) => {
        req.logOut();
        req.flash('success', `You have been logged out!`)
        res.redirect('/')
    },

    showProfile: async (req, res, next) => {
        if (req.isAuthenticated()) {
            res.render('users/profile', Object.assign(options, {
                title: req.user.username + "\'s Profile",
                navAdd: false,
                navView: false,
                navLogin: false,
                navRegister: false,
                navProfile: true,
                workList: await workController.listMine(req, res, next),
                graph: false
            }))
        } else {
            req.flash('error', 'Please log in to access this page')
            res.redirect('../users/login')
        }
    },

    updateUsername: async (req, res, next) => {
        const errors = validationResult(req)
        if (!errors.isEmpty()) {
            req.flash('error', errors.array().map(e => e.msg + '</br>').join(''))
            res.redirect('back')
        } else {
            try {
                let user = await User.findByIdAndUpdate({_id: req.user.id.trim()}, {username: req.body.username})
                // req.body.username = user.username
                // req.body.password = user.password
                // await authenticate(req, res, next)
                req.flash('success', `${user.username} is now ${req.body.username} <br> Please log in with new credentials`)
                res.redirect('../users/login')
            } catch (err) {
                req.flash('error', `Failed to change username. Please try another`)
                res.redirect('../users/profile') //../users/profile
            }
        }
    },
    getRegister: async (req, res, next) => {
        if (!req.isAuthenticated()) {
            res.render('users/register', Object.assign(options, {
                title: 'Register',
                navAdd: false,
                navView: false,
                navLogin: false,
                navRegister: true,
                navProfile: false,
                graph: false
            }))
        } else {
            res.redirect('/')
        }
    },
    getLogin: async (req, res, next) => {
        if (!req.isAuthenticated()) {
            res.render('users/login', Object.assign(options, {
                title: "Login",
                navAdd: false,
                navView: false,
                navLogin: true,
                navRegister: false,
                navProfile: false,
                graph: false
            }))
        } else {
            res.redirect('/')
        }
    }

}

const getUserParams = body => {
    return {
        username: body.username,
        password: body.password,
        isAdmin: body.isAdmin
    }
}

exports.registerValidations = [
    body('username')
        .notEmpty().withMessage('Username is required')
        .isLength( {min: 2}).withMessage('Username must be at least two characters'),
    body('password')
        .notEmpty().withMessage('Password is required')
        .isLength( {min: 8}).withMessage('Password name must be at least eight characters'),
]