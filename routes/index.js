const express = require('express');
const router = express.Router();

let options = {
    projectName: 'Reffer',
    layout: 'default',
    styles: [
      '../stylesheets/style.css',
      '../stylesheets/style-2.css'
    ],
    title: "Welcome to Reffer"
}

router.get('/', async function(req, res, next) {
    try {
        res.render('index', options);
    } catch (err) {
        next(err)
    }
})

module.exports = router;
