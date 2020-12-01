let User = require('../models/users').User
const {body, validationResult} = require('express-validator')

const mongoose = require('mongoose')

exports.userController = {
    create : async (req, res, next) => {
        const errors = validationResult(req)
        if (!errors.isEmpty()) {
            req.flash('error', errors.array().map(e => e.msg + '</br>').join(''))
            res.redirect('/users/register')
        } else {
            try {
                let userParams = getUserParams(req.body)
                let user = await User.create(userParams)
                req.flash('success', `${user.username}'s account created successfully`)
                res.redirect('/')
            } catch (error) {
                // console.log(`Error saving user: ${error.message}`)
                // req.flash(`error`, `Failed to create user account because ${error.message}`)
                req.flash(`error`, `Username already taken, please try a different one`)
                res.redirect('/users/register')
            }
        }
    },
    authenticate: async (req, res, next) => {
        try {
            let user = await User.findOne({username: req.body.username})
            if (user && await user.passwordComparison(req.body.password)) {
                req.flash('success', `${user.username} has logged in successfully`)
                res.redirect('/')
            } else {
                req.flash('error', 'Your email or password is incorrect.')
                res.redirect('/users/login')
            }
        } catch (error) {
            req.flash('error', 'Your email or password is incorrect.')
            res.redirect('/users/login')
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