var data = require('../mvc/model/data');


var TestProduct;
var TestProductData = {
	itemId: "Unit Test itemID",
	title: "Unit Test title",
	status: "Unit Test status"
};


describe("Product Storage", function() {

	it("Open Connection", function(){

		runs(function() {
			data.start();
		});

		waitsFor( function() { 
			console.log('wait start: ' + data.status());
			return data.status() == 1; 
		}, "Connection timed out.", 5000);
	});
	
	/*
	it("Create Product", function(){

		runs(function() {
			TestProduct = new data.obj.Product();
			TestProduct.Populate(TestProductData);
		});

		waitsFor( function() { 
			console.log('wait start: ' + data.status());
			return data.status() == 1; 
		}, "Connection timed out.", 5000);



		TestProduct.save(function (err){
			expect(err).toEqual(null);
		});
	});
	
	it("Retreive Product", function(){

		data.obj.Product.findById(TestProduct.id, '*', function(err,ProductFound){
			
			//expect(err).toEqual(null);
			expect(ProductFound.title).toEqual(TestProduct.title + "- X");

			console.log('Product' + ProductFound.title);

			if(!err){
				expect(ProductFound.id).toEqual(TestProduct.id);
				expect(ProductFound.itemId).toEqual(TestProduct.itemId);
				expect(ProductFound.title).toEqual(TestProduct.title + "- X");
				expect(ProductFound.status).toEqual(TestProduct.status);
			}

		});
	});
	*/
});