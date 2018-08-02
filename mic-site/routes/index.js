var express = require('express');
var router = express.Router();

var GoogleSpreadsheet = require('google-spreadsheet');
var async = require('async');

router.get('/', function(req, res, next) {
	res.render('index');
});

router.get('/call-for-submissions', function(req, res, next) {
	res.render('call-for-submissions');
});

router.get('/travel-form', function(req, res, next) {
	res.render('travel-form');
});

router.post('/travel-form', function(req, res, next) {
	console.log(req.body);

	// spreadsheet key is from the URL
	var doc = new GoogleSpreadsheet('1R5POrmPtfcydSeqwP_ut1B_xnEDAGylV-R_FPkbij2U');
	var sheet;

	async.series([
		function setAuth(step) {
			// see notes below for authentication instructions!
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
			sheet.addRow(req.body, function( err, rows ){
				if (err) {step(err)}
				step();
			});
		}

	], function(err){
			if (err) {
				res.send('Something went wrong. <strong>Please send an email to ddehueck@bu.edu with the following error information:</strong></br></br>' + err);
			} else {
				res.send('Your information has been recorded. Thank you for your time.');
			}
	});
});


module.exports = router;
