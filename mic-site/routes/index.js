var express = require('express');
var router = express.Router();

var GoogleSpreadsheet = require('google-spreadsheet');
var async = require('async');
var emailUtil = require('../utils/email.js');

router.get('/', function(req, res, next) {
	res.render('index');
});

router.get('/call-for-submissions', function(req, res, next) {
	res.render('call-for-submissions');
});

router.get('/call-for-submissions.html', function(req, res, next) {
	res.redirect('/call-for-submissions');
});

router.get('/sponsor-form', function(req, res, next) {
	res.render('sponsor-form/sponsor-form');
});

// TODO: don't repeat this
router.post('/sponsor-form', function(req, res, next) {
	// RECORD INFO
	// spreadsheet key is from the URL
	var doc = new GoogleSpreadsheet(process.env.SPONSOR_FORM_SPREADSHEET_ID);
	var sheet;

	async.series([
		function setAuth(step) {
			var creds = require('../credentials/drive-credentials.json');
			doc.useServiceAccountAuth(creds, step);
		},

		function getSheet(step) {
			doc.getInfo(function(err, info) {
				if (err) {step(err)}
				sheet = info.worksheets[0];
				step();
			});
		},

		function addRowData(step) {
			sheet.addRow(req.body, function(err, rows){
				if (err) {step(err)}
				step();
			});
		}, 

		function sendCopy(step) {
			if (req.body.wants_email == 'true' && req.body.email_address != '') {
				emailUtil.sendSponsorCopy(req.body, function(err, info) {
					if (err) {step(err)}
				});
			}
			step();
		},

	], function(err){
			if (err) {
				res.send('<strong>Something went wrong. Please try filling out the form again. If the error persists please send an email to ddehueck@bu.edu with the following error information:</strong></br></br>' + err);
			} else {
				res.render('sponsor-form/completed');
			}
	});
});

router.get('/travel-form', function(req, res, next) {
	res.render('travel-form/travel-form');
});

router.post('/travel-form', function(req, res, next) {
	// RECORD INFO
	// spreadsheet key is from the URL
	var doc = new GoogleSpreadsheet(process.env.SPREADSHEET_ID);
	var sheet;

	async.series([
		function setAuth(step) {
			var creds = require('../credentials/drive-credentials.json');
			doc.useServiceAccountAuth(creds, step);
		},

		function getSheet(step) {
			doc.getInfo(function(err, info) {
				if (err) {step(err)}
				sheet = info.worksheets[0];
				step();
			});
		},

		function addRowData(step) {
			sheet.addRow(req.body, function(err, rows){
				if (err) {step(err)}
				step();
			});
		}, 

		function sendCopy(step) {
			if (req.body.wants_email == 'true' && req.body.email_address != '') {
				emailUtil.sendTravelCopy(req.body, function(err, info) {
					if (err) {step(err)}
				});
			}
			step();
		},

	], function(err){
			if (err) {
				res.send('<strong>Something went wrong. Please try filling out the form again. If the error persists please send an email to ddehueck@bu.edu with the following error information:</strong></br></br>' + err);
			} else {
				res.render('travel-form/completed');
			}
	});
});


module.exports = router;
