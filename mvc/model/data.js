 /**********************
Controls Persistent Data
 **********************/


var model = module.exports;

model.obj = function() {
	var User;
	var userSchema;
	var Product;
	var productSchema;
	var Channel;
	var channelSchema;
	var db;
}

model.start = function(app) {

	//*******************
	// Connection Setup
	//*******************

	var mongoose = require('mongoose');
	mongoose.connect('mongodb://localhost/express-test');

	this.obj.db = mongoose.connection;
	this.obj.db.on('error', console.error.bind(console, 'connection error:'));
	this.obj.db.once('open', function callback () {
		console.log('Database connection opened');
	});


	//*******************
	// Load Models
	//*******************

	
	this.obj.userSchema = require('./obj/user');
	this.obj.User = mongoose.model('User', this.obj.userSchema.Schema(mongoose));

	this.obj.productSchema = require('./obj/product');
	this.obj.Product = mongoose.model('Product', this.obj.productSchema.Schema(mongoose));

	this.obj.channelSchema = require('./obj/channel');
	this.obj.Channel = mongoose.model('Channel', this.obj.channelSchema.Schema(mongoose));


	/*
	var Ted = new this.obj.User({
		firstName: "Ted 6",
		lastName: "Smith",
		email: "ted.smith6@email.com"
	});

	Ted.Talk();


	this.obj.User.find(function (err, User) {
	  if (err) {
	  	console.log(err);
	  }
	  console.log(User)
	})
	
	*/
}

model.status = function() {
	var mongoose = require('mongoose');
	return mongoose.connection.readyState;
}

model.end = function(app) {
	this.obj.db.connection.close()
	//this.obj.dbStatus = false;
	console.log('Database connection closed');
}
