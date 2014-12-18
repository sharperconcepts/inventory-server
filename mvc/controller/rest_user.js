 /*******************
 REST USER API
 *******************/

module.exports.controller = function(app) {

	var security = require('../model/security');
	var data = require('../model/data');

	/****** security method for this api ******/
	// can be customized for specific security requirements

	var isAuthenticated = function (req, res, next) {
		if (req.isAuthenticated()) { 
			return next(); 
		}
		return res.status(401).send('Not Authenticated');
	}


	//*******************
	// USERS
	//*******************

 	/****** lookup list of users ******/
 	
	app.get('/api/users', isAuthenticated, function(req, res) {

		data.obj.User.find({}, 'firstName lastName email', function(err,userList){
			if(!err){
				return res.send(userList);
			} else {
				return console.log(err);
			}
		});

	});


	/****** get single user ******/

	app.get('/api/users/:id', isAuthenticated, function (req, res){

		data.obj.User.findById(req.params.id, '-password -passHash -passSalt', function(err,userFound){
			if(!err){
				return res.send(userFound);
			} else {
				return console.log(err);
			}

		});

	});
 
 	/****** hard delete user ******/

	app.delete('/api/users/:id', isAuthenticated, function (req, res){

		data.obj.User.findById(req.params.id, function(err,userDel){

			if(!err){
				userDel.remove();
				return res.send('');
			} else {
				return console.log(err);
			}

		});

	});

	/****** insert user ******/

	app.post('/api/users', isAuthenticated, function (req, res){

		var NewUser = new data.obj.User();

		NewUser.Populate(req.body);

		NewUser.save(function (err){
			if (!err) {
				return res.send(NewUser);
			} else {
				return console.log(err);
			}
		});


	});

	/****** update user ******/

	app.post('/api/users/:id', isAuthenticated, function (req, res){

		console.log("called update");

		data.obj.User.findById(req.params.id, function(err,userEdit){

			if(!err){

				userEdit.Populate(req.body);

				userEdit.save(function (err){
					if (!err) {
						return res.send(userEdit);
					} else {
						return console.log(err);
					}
				});
			} else {
				return console.log(err);
			}

		});

	});	




}