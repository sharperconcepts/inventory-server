 /**********************
Controls Passport Setup
 **********************/

var security = module.exports;
security.passport = require('passport');
var config = require('../../config');

var SUuser;

security.start = function(app) {

	LocalStrategy = require('passport-local').Strategy;

	this.passport.use(new LocalStrategy(
		function(username, password, done) {

			var data = require('./data');

			//console.log(username + " : " + password);

			//check for super user in config
			if ((username == config.superAdmin.email) && (password == config.superAdmin.password)){

				console.log('ADMIN LOGIN');

				SUuser = new data.obj.User();
				SUuser.firstName = config.superAdmin.first;
				SUuser.lastName = config.superAdmin.last;
				SUuser.email = config.superAdmin.email;
				return done(null, SUuser);
			} else {
				SUuser = new data.obj.User();
			}
			
			//check for user in database
			data.obj.User.findOne({ email: username }, function (err, user) {
				console.log('USER LOGIN');

				if (err) { return done(err); }
				if (!user) {
					return done(null, false, { message: 'Incorrect email.' });
				}
				if (!user.ValidPassword(password)) {
					return done(null, false, { message: 'Incorrect password.' });
				}

				user.passVer = undefined;
				user.password = undefined;
				user.passSalt = undefined;
				user.passHash = undefined;

				return done(null, user);
			});
			
		}
	));

	this.passport.serializeUser(function(user, done) {
		done(null, user.id);
	});

	this.passport.deserializeUser(function(id, done) {

		if (id == SUuser.id) {
			return done(null, SUuser);
		}
		
		var data = require('./data');

		data.obj.User.findById(id, 'firstName lastName email', function(err,userFound){
			if(!err){
				return done(null, userFound);
			} else {
				return console.log(err);
			}

		});

	});
	
}


