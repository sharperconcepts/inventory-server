
module.exports.Schema = function (mongoose){


	//***** Data Model *******
	var fullSchema = mongoose.Schema({
		itemId: String,
		title: String,
		quantity: Number,
		status: String,

		shortDescription: String,
		longDescription: String,

		entryDate: { type: Date, default: Date.now },
		lastUpdate: { type: Date, default: Date.now },

		channelActiveId: String,

		channel: [{
			ChannelType: String,
			ChannelId: String,
			ChannelData: String
		}],

		productDetails: [{
			desc: String,
			val: String
		}],
		
		salePrice: Number,
		auctionPrice: Number,

		priceHistory: [{
			desc: String,
			sale: Number,
			auction: Number,
			date: { type: Date, default: Date.now }
		}]
	});

	//***** Function Populate and Validate Dirty Data *******
	fullSchema.methods.Populate = function (dirtyData){
		
		if (dirtyData.itemId)
			this.itemId = dirtyData.itemId;

		if (dirtyData.title)
			this.title = dirtyData.title;

		if (dirtyData.quantity)
			this.quantity = dirtyData.quantity;

		if (dirtyData.status)
			this.status = dirtyData.status;

		if (dirtyData.shortDescription)
			this.shortDescription = dirtyData.shortDescription;

		if (dirtyData.longDescription)
			this.longDescription = dirtyData.longDescription;

		this.lastUpdate = Date.now();

	}


	/*
	fullSchema.virtual('setPassword')
	.set(function (password) {
		this.passVer = 1;
		this.passSalt = this.MakeSalt();
		this.passHash = this.HashPassword(password);
		this.password = undefined;
	})
	.get(function () {
		return this.passHash;
	});

	//***** Function Talk *******
	fullSchema.methods.Talk = function (){
		console.log("EMAIL:" + this.email);
	}

	fullSchema.methods.ValidPassword = function (pass){

		if (this.passVer == 1){
			if (this.HashPassword(pass) == this.passHash) {
				console.log("Hash Verified");
				return true;
			} else {
				return false;
			}
		}


		else if (pass == this.password){
			return true;
		}


		else {
			return false;
		}
			
	}

	fullSchema.methods.MakeSalt = function () {
    	return Math.round((new Date().valueOf() * Math.random())) + '';
  	}

	fullSchema.methods.HashPassword = function (pass){
		if (!pass) return '';
		var hash;
		try {
			hash = crypto.createHmac('sha256', this.passSalt).update(pass).digest('hex');
			return hash;
		} catch (err) {
			return '';
		}
	}
	*/
	return fullSchema;

}

