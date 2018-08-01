var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
	res.render('index');
});

router.get('/call-for-submissions', function(req, res, next) {
	res.render('call-for-submissions');
});

router.get('/travel-form', function(req, res, next) {
	res.render('travel-form');
});


module.exports = router;
