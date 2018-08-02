var nodemailer = require('nodemailer');
var tableify = require('tableify');


module.exports = {

	sendTravelCopy: function(reqObj, callback) {
		var transporter = nodemailer.createTransport({
			service: 'gmail',
			auth: {
				user: process.env.GMAIL_EMAIL,
				pass: process.env.GMAIL_PSWD
			}
		});

		var mailOptions = {
			from: 'no-reply@machineintelligence.cc',
			to: reqObj.email_address,
			subject: 'Your Travel Form Copy - Machine Intelligence Conference',
			html: formHtml(reqObj)
		};

		transporter.sendMail(mailOptions, function(err, info){
			process.nextTick(function() {
				callback(err, info);
			});
		});
	},
}

function formHtml(reqObj) {
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