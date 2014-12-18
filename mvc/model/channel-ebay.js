 /**********************
 eBay Channel Utilitiy
 **********************/

var ebay = module.exports;

var config = require('../../config')

ebay.devKey = config.ebay.devKey;
ebay.appKey = config.ebay.appKey;
ebay.certKey = config.ebay.certKey;

ebay.https = require('https');
ebay.xml2js = require('xml2js');



ebay.GetUser = function(accountToken, app, returnClient) {

	var renderObj = {
		$callName: 'GetUser',
		$accountToken: accountToken
	}

	var callBack = function(resObj){
		returnClient(null, resObj);
	}

	this.CallApi("eBayGetUser", renderObj, callBack, app);

}

ebay.GetItems = function(accountToken, app, returnClient) {

	var renderObj = {
		$callName: 'GetMyeBaySelling',
		$accountToken: accountToken,
		$pageNumber: 1,
		$entriesPerPage: 200
	}

	var returnObj = new Array();

	var callBack = function(resObj){

		var list = resObj.GetMyeBaySellingResponse.ActiveList.ItemArray.Item;
		var pageCount = resObj.GetMyeBaySellingResponse.ActiveList.PaginationResult.TotalNumberOfPages;

		if (list instanceof Array) {

			for (var i=0; i < list.length; i++){

				returnObj.push({
					id: list[i].ItemID,
					quantity: list[i].Quantity,
					title: list[i].Title,
					link: list[i].ListingDetails.ViewItemURL,
					start: new Date(list[i].ListingDetails.StartTime),
					thumbPic: list[i].PictureDetails.GalleryURL
				});

			}
		} else {
			returnObj.push({
				id: list.ItemID,
				quantity: list.Quantity,
				title: list.Title,
				link: list.ListingDetails.ViewItemURL,
				start: new Date(list.ListingDetails.StartTime),
				thumbPic: list.PictureDetails.GalleryURL
			});
		}

		if (renderObj.$pageNumber < pageCount){
			renderObj.$pageNumber += 1;
			ebay.CallApi("eBayGetMyItems", renderObj, callBack, app);
		} else {
			returnClient(null, returnObj);
		}
		

	}

	this.CallApi("eBayGetMyItems", renderObj, callBack, app);
}

ebay.DownloadSingleItem = function(accountToken, itemID, app, returnClient) {

	var renderObj = {
		$callName: 'GetItem',
		$accountToken: accountToken,
		$itemID: itemID
	}

	var callBack = function(resObj){

		var product = {
			itemId: resObj.GetItemResponse.Item.ItemID,
			title: resObj.GetItemResponse.Item.Title,
			quantity: Number(resObj.GetItemResponse.Item.Quantity),
			status: "auction",

			shortDescription: "",
			longDescription: resObj.GetItemResponse.Item.Description,

			channel: [{
				ChannelType: "ebay",
				ChannelId: "",
				ChannelData: JSON.stringify(resObj.GetItemResponse.Item)
			}],
			
			salePrice: Number(resObj.GetItemResponse.Item.BuyItNowPrice._),
			auctionPrice: Number(resObj.GetItemResponse.Item.SellingStatus.CurrentPrice._),

			priceHistory: [{
				desc: "Imported Price",
				sale: Number(resObj.GetItemResponse.Item.BuyItNowPrice._),
				auction: Number(resObj.GetItemResponse.Item.SellingStatus.CurrentPrice._),
				date: new Date()
			}]
		}

		returnClient(null, product);
	}

	this.CallApi("eBayGetItem", renderObj, callBack, app);

}


ebay.CallApi = function(renTemplate, renData, callBack, app) {

 	app.render(renTemplate, renData, function(err, xml){

 		console.log(xml);

 		var options = {
			hostname: 'api.ebay.com',
			port: 443,
			path: '/ws/api.dll',
			method: 'POST',
			headers: {
				'Cookie': "cookie",
				'Content-Type' : 'text/xml',
				'Content-Length': Buffer.byteLength(String(xml)),
				'X-EBAY-API-COMPATIBILITY-LEVEL' : '859',
				'X-EBAY-API-DEV-NAME' : this.devKey,
				'X-EBAY-API-APP-NAME' : this.appKey,
				'X-EBAY-API-CERT-NAME' : this.certKey,
				'X-EBAY-API-SITEID' : '0',
				'X-EBAY-API-CALL-NAME' : renData.$callName
			}
		};

		
		var req = ebay.https.request(options, function(res) {

			var resXML = "";

			res.on('data', function(chunk) {
				resXML += chunk;
			});

			res.on('end', function() {
				var parseString = ebay.xml2js.parseString;
				parseString(resXML.toString('utf8'), {trim: true, explicitArray: false}, function (err, result) {
					callBack(result);
				});
			});
			
		});

		req.write(xml);

		req.on('error', function(e) {
			console.error(e);
		});
 		
	});

}


