 /*******************
 REST PRODUCT API
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
		return res.send(401);
	}


	//*******************
	// PRODUCTS
	//*******************

 	/****** lookup list of products ******/
 	
	app.get('/api/products', isAuthenticated, function(req, res) {

		data.obj.Product.find({}, 'itemId title status', function(err,productList){
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