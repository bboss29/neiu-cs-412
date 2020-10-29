const express = require('express');
const router = express.Router();

const options = {
  title: 'Reffer',
  layout: 'default',
  styles: [
      'stylesheets/style.css',
      'stylesheets/style-2.css'
  ]
}

router.get('/', async function(req, res, next) {
  res.render('index', options);
});

module.exports = router;
