let User = require('../models/users').User
const {body, validationResult} = require('express-validator')
const passport = require('passport')
const { workController } = require('../controllers/work-controller')

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
                res.redirect('/')
            } catch (error) {
                req.flash(`error`, `Failed to create user`)
                res.redirect('/users/register')
            }
        }
    },

    authenticate: async (req, res, next) => {
        await passport.authenticate('local', function(err, user, info) {
            if (err) return next(err)
            if (!user) {
                req.flash('error', 'Failed to login')
                return res.redirect('back')
            }
            req.logIn(user, function (err) {
                if (err) return next(err)
                req.flash('success', `${user.username} logged in!`)
                return res.redirect('/')
            })
        })(req, res, next);
    },

    logOut: async (req, res, next) => {
        req.logOut();
        req.flash('success', `You have been logged out!`)
        res.redirect('/')
    },

    showProfile: async (req, res, next, options) => {
        res.render('users/profile', Object.assign(options,{
            title: 'Profile',
            navAdd: false,
            navView: false,
            navLogin: false,
            navRegister: false,
            navProfile: true,
            workList: await workController.listMine(req,res,next)
        }))
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