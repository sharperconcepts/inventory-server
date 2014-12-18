 /*******************
 REST PRODUCT API
 *******************/

module.exports.controller = function(app) {

	var security = require('../model/security');
	var data = require('../model/data');
	var multer  = require('multer');
	var fs = require('fs-extra');

	/****** security method for this api ******/
	// can be customized for specific security requirements

	var isAuthenticated = function (req, res, next) {
		if (req.isAuthenticated()) { 
			return next(); 
		}
		return res.status(401).end();
	}


	//*******************
	// PRODUCTS
	//*******************

 	/****** lookup list of products ******/
 	
	app.get('/api/products', isAuthenticated, function(req, res) {

		data.obj.Product.find({}, 'itemId title quantity status shortDescription entryDate lastUpdate', function(err,productList){
			if(!err){
				return res.send(productList);
			} else {
				return console.log(err);
			}
		});

	});


	/****** get single product ******/

	app.get('/api/products/:id', isAuthenticated, function (req, res){

		data.obj.Product.findById(req.params.id, function(err,productFound){
			if(!err){
				return res.send(productFound);
			} else {
				return console.log(err);
			}

		});

	});
 
 	/****** hard delete product ******/

	app.delete('/api/products/:id', isAuthenticated, function (req, res){

		data.obj.Product.findById(req.params.id, function(err,productDel){

			if(!err){
				productDel.remove();
				return res.send('');
			} else {
				return console.log(err);
			}

		});

	});

	/****** insert product ******/

	app.post('/api/products', isAuthenticated, function (req, res){

		var NewProduct = new data.obj.Product();
		NewProduct.Populate(req.body);

		NewProduct.save(function (err){
			if (!err) {
				return res.send(NewProduct);
			} else {
				return console.log(err);
			}
		});


	});

	/****** upload image to product ******/
	
	app.post('/api/products/photo', isAuthenticated, 
		
	multer({ 
		dest: './resources/products',
		limits: {
			fileSize: '2000',
		},
		rename: function(fieldname, filename) {
			return fieldname + filename + Date.now();
		},
		onFileUploadStart: function(file) {
			var exts = ['png','jpg','jpeg'];
			
		}
	}),
	
	function (req, res){
		if (req.files) { 
			console.log(req.files);
			if (req.files.Test.size === 0) {
			    return res.status(500).end();
			}
			fs.exists(req.files.Test.path, function(exists) { 
				if(exists) { 
					return res.end('');
				} else { 
					return res.status(500).end();
				} 
			}); 
		} 

	});

	/****** update product ******/

	app.post('/api/products/:id', isAuthenticated, function (req, res){

		console.log("called update");

		data.obj.Product.findById(req.params.id, function(err,productEdit){

			if(!err){
				
				productEdit.Populate(req.body);

				productEdit.save(function (err){
					if (!err) {
						return res.send(productEdit);
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