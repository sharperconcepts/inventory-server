 /**********************
Controls Passport Setup
 **********************/

var security = module.exports;
security.passport = require('passport');




security.start = function(app) {

	LocalStrategy = require('passport-local').Strategy;

	this.passport.use(new LocalStrategy(
		function(username, password, done) {

			var data = require('./data');
			
			data.obj.User.findOne({ email: username }, function (err, user) {
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
		done(null, user._id);
	});

	this.passport.deserializeUser(function(id, done) {
		
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


