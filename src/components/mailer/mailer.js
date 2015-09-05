var config = require('../../config/environment');
var nodemailer = require('nodemailer');
var ses = require('nodemailer-ses-transport');
var handlebars = require('express-handlebars');
var templatesDir = config.root+'/src/components/mailer/templates';
var hbs = require('nodemailer-express-handlebars');

var transporter = nodemailer.createTransport(ses({
    accessKeyId: config.aws.ses.accessKeyId,
    secretAccessKey: config.aws.ses.secretAccessKey,
    region: config.aws.ses.region
}));

var options = hbs({
	viewEngine: handlebars.create({}),
    viewPath: templatesDir
});

transporter.use('compile', options);


exports.invite = function(user){

	var mail = {
	from: 'AbacashAdmin <Abacash@Abakus.no>',
	to: user.email,
	subject: 'Invitasjon til AbacashAdmin',
	template: 'invite',
	context: {
		inviteLink: config.domain+'/invite/'+user.meta.redeem
		}
	}

	transporter.sendMail(mail, function(err, responseStatus) {
		if (err) {
			console.log(err);
		} else {
			console.log(responseStatus.message);
		}
	});

}

exports.reset = function(user){

	var mail = {
	from: 'AbacashAdmin <Abacash@Abakus.no>',
	to: user.email,
	subject: 'Reset passord for AbacashAdmin',
	template: 'reset',
	context: {
		resetLink: config.domain+'/reset/'+user.meta.restore
		}
	}
	transporter.sendMail(mail, function(err, responseStatus) {
		if (err) {
			console.log(err);
		} else {
			console.log(responseStatus.message);
		}
	});

}


 



 
