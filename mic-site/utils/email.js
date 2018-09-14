var nodemailer = require('nodemailer');
var sgTransport = require('nodemailer-sendgrid-transport');
var tableify = require('tableify');


module.exports = {

	sendTravelCopy: function(reqObj, callback) {
		var options = {
			auth: {
				api_user: process.env.SENDGRID_USRNAME,
				api_key: process.env.SENDGRID_PSWD
			}
		}

		var client = nodemailer.createTransport(sgTransport(options));

		var email = {
			from: 'no-reply@machineintelligence.cc',
			to: reqObj.email_address,
			subject: 'Your Travel Form Copy - Machine Intelligence Conference',
			html: travelFormHtml(reqObj)
		};

		client.sendMail(email, function(err, info){
			
		});
	},

	sendSponsorCopy: function(reqObj, callback) {
		var options = {
			auth: {
				api_user: process.env.SENDGRID_USRNAME,
				api_key: process.env.SENDGRID_PSWD
			}
		}

		var client = nodemailer.createTransport(sgTransport(options));

		var email = {
			from: 'no-reply@machineintelligence.cc',
			to: reqObj.email_address,
			subject: 'Your Sponsor Form Copy - Machine Intelligence Conference',
			html: sponsorFormHtml(reqObj)
		};

		client.sendMail(email, function(err, info){
			
		});
	},
}

function travelFormHtml(reqObj) {
	var cleanedObj = {}
	var removeKeys = ['assistance', 'email_address', 'wants_email']
	var replace = {
		name: 'Full Name: ',
		institution: 'Institution: ',
		event_title: 'Talk/Workshop Title: ',
		traveler_address: 'Traveler Home Address: ',
		traveler_phone: 'Traveler Phone Number: ',
		traveler_dob: 'Traveler Date of Birth: ',
		check_in: 'Check in Date: ',
		check_out: 'Check out Date: ',
		depart_code: 'Departing Airport Code: ',
		depart_time_pref: 'Departure Time Preference: ',
		return_time_pref: 'Return Time Preference: ',
		seat_pref: 'Seat Preference: ',
		ktn: 'Known Traveler Number: '
	}

	for (var key in reqObj) {
		if (reqObj[key] == '' || removeKeys.includes(key)) {
				delete reqObj[key];
		} else {
			var newKey = replace[key];
			cleanedObj[newKey] = reqObj[key];
		}
	}

	var ret = '<p>Here is your copy of the submitted travel form for the Machine Intelligence Conference:</p>';
	ret += tableify(cleanedObj);
	ret += '<p>Please contact <a href="mailto:conference@machineintelligence.cc">conference@machineintelligence.cc</a> if something needs to be updated or if you have any questions.</p>'

	return ret;
}

function sponsorFormHtml(reqObj) {
	var cleanedObj = {}
	var removeKeys = ['email_address', 'wants_email']
	var replace = {
		company_name: 'Company Name: ',
		best_contact_name: 'Best Contact Name: ',
		best_contact_email: 'Best Contact Email: ',
		phone_day_of: 'Phone Number for Day-Of Coordination: ',
		speaker_name: 'Speaker Name: ',
		industry_panel_response: 'Industry Panel Response: ',
		talk_or_ws_one_title: 'Talk/Workshop One Title: ',
		talk_or_ws_one_description: 'Talk/Workshop One Description: ',
		is_talk_or_ws_one: 'Is Talk or Workshop One: ',
		talk_or_ws_two_title: 'Talk/Workshop Two Title: ',
		talk_or_ws_two_description: 'Talk/Workshop Two Description: ',
		is_talk_or_ws_two: 'Is Talk or Workshop Two: ',
	}

	for (var key in reqObj) {
		if (reqObj[key] == '' || removeKeys.includes(key)) {
				delete reqObj[key];
		} else {
			var newKey = replace[key];
			cleanedObj[newKey] = reqObj[key];
		}
	}

	var ret = '<p>Here is your copy of the sponsor travel form for the Machine Intelligence Conference:</p>';
	ret += tableify(cleanedObj);
	ret += '<p>Please contact <a href="mailto:conference@machineintelligence.cc">conference@machineintelligence.cc</a> if something needs to be updated or if you have any questions.</p>'

	return ret;
}