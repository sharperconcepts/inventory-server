 /*******************
 Home, Login, Register
 *******************/

module.exports.controller = function(app) {

	/****** home ******/

	app.get('/', function(req, res) {

	var obj = {
		var1: "apple",
		var2: "pear"
	}

	res.render('home', obj)

	//res.send('Home Controller');

	});
 

	/***** login ******/

	app.get('/login', function(req, res) {
	// any logic goes here
	//res.render('users/login')

	var obj = {
		var1: "hello",
		var2: req.flash('error')
	}

	res.render('home', obj)

	});


}