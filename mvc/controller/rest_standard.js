 /*******************
 REST STANDARD API
 *******************/

module.exports.controller = function(app) {

	var security = require('../model/security');

	// api login and logout controllers

	app.post('/api/login', 
		security.passport.authenticate('local'), 
		function(req, res){
 			return res.send(req.user);
		}
	);

	app.get('/api/logout', function(req, res){
		req.logout();
		return res.send('');
	});

}