 /*******************
 REST PRODUCT API
 *******************/

module.exports.controller = function(app) {

	var security = require('../model/security');
	var data = require('../model/data');
	var ebay = require('../model/channel-ebay');
	var async = require("async");


	/****** security method for this api ******/
	// can be customized for specific security requirements

	var isAuthenticated = function (req, res, next) {
		if (req.isAuthenticated()) { 
			return next(); 
		}
		return res.send(401);
	}


	//*******************
	// CHANNEL
	//*******************


	/****** lookup list of channels ******/
 	
	app.get('/api/channels', isAuthenticated, function(req, res) {

		data.obj.Channel.find({}, 'title status channelType channelId channelData', function(err,channelList){
			if(!err){
				return res.send(channelList);
			} else {
				return console.log(err);
			}
		});

	});


	/****** get single channel ******/

	app.get('/api/channels/:id', isAuthenticated, function (req, res){

		data.obj.Channel.findById(req.params.id, 'title status channelType channelId channelKey channelData', function(err,channelFound){
			if(!err){
				return res.send(channelFound);
			} else {
				return console.log(err);
			}

		});

	});
 
 	/****** hard delete channel ******/

	app.delete('/api/channels/:id', isAuthenticated, function (req, res){

		data.obj.Channel.findById(req.params.id, function(err,channelDel){

			if(!err){
				channelDel.remove();
				return res.send('');
			} else {
				return console.log(err);
			}

		});

	});

	/****** insert channel ******/

	app.post('/api/channels', isAuthenticated, function (req, res){

		var NewChannel = new data.obj.Channel();
		NewChannel.Populate(req.body);

		NewChannel.save(function (err){
			if (!err) {
				return res.send(NewChannel);
			} else {
				return console.log(err);
			}
		});


	});

	/****** update channel ******/

	app.post('/api/channels/:id', isAuthenticated, function (req, res){

		console.log("called update");

		data.obj.Channel.findById(req.params.id, function(err,channelEdit){

			if(!err){
				
				channelEdit.Populate(req.body);

				channelEdit.save(function (err){
					if (!err) {
						return res.send(channelEdit);
					} else {
						return console.log(err);
					}
				});
			} else {
				return console.log(err);
			}

		});

	});	





	//*******************
	// Products in CHANNEL
	//*******************

 	/****** return list of products in channel connection ******/

 	app.get('/api/channels/:id/list', isAuthenticated, function(req, res) {

 		async.waterfall([

 			//download channel
 			function(callback) {
 				data.obj.Channel.findById(req.params.id, function(err,channel){
 					if (channel == null) return res.send(404);
 					else callback(err,channel);
 				});
 			},

 			//download more info on channel
 			function(channel, callback) {
				if(channel.channelType == "ebay") {
					ebay.GetItems(channel.channelKey, app, function(err,productList){
						res.send(productList);
					});
				} 
				else {
					return res.send(501);
				}
 			}

		]);

	});

 	/****** return channel connection details ******/

 	app.get('/api/channels/:id/info', isAuthenticated, function(req, res) {

 		async.waterfall([

 			//download channel
 			function(callback) {
 				data.obj.Channel.findById(req.params.id, function(err,channel){
 					if (channel == null) return res.send(404);
 					else callback(err,channel);
 				});
 			},

 			//download more info on channel
 			function(channel, callback) {
				if(channel.channelType == "ebay") {
					ebay.GetUser(channel.channelKey, app, function(err,channelInfo){
						res.send(channelInfo);
					});
				} 
				else {
					return res.send(501);
				}
 			}

		]);

	});

 	/****** import product from channel ******/

 	app.get('/api/channels/:id/import/:pid', isAuthenticated, function(req, res) {

 		async.waterfall([

 			//download channel
 			function(callback) {
 				data.obj.Channel.findById(req.params.id, function(err,channel){
 					if (channel == null) return res.send(404);
 					else callback(err,channel);
 				});
 			},

 			//download more info on channel
 			function(channel, callback) {
				if(channel.channelType == "ebay") {
					ebay.DownloadSingleItem(channel.channelKey, req.params.pid, app, function(err,productRawData){
						if (productRawData == null) return res.send(501);
 						else callback(err,productRawData);
					});
				} 
				else {
					return res.send(501);
				}
 			},

 			function(productRawData, callback) {
 				var NewProduct = new data.obj.Product();
				NewProduct.Populate(productRawData);

				NewProduct.save(function (err){
					if (!err) {
						return res.send(NewProduct);
					} else {
						return console.log(err);
					}
				});
 			}
 			
		]);

	});
}