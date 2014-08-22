
module.exports.Schema = function (mongoose){


	//***** Data Model *******
	var fullSchema = mongoose.Schema({

		title: String,
		status: String,
		channelType: {type: String, enum: ['ebay', 'opencart']},
		channelId: String,
		channelKey: String,
		channelData: mongoose.Schema.Types.Mixed
		
	});

	//***** Function Populate and Validate Dirty Data *******
	fullSchema.methods.Populate = function (dirtyData){
		
		
		if (dirtyData.title)
			this.title = dirtyData.title;

		if (dirtyData.status)
			this.status = dirtyData.status;

		if (dirtyData.channelType)
			this.channelType = dirtyData.channelType;
		
		if (dirtyData.channelId)
			this.channelId = dirtyData.channelId;

		if (dirtyData.channelKey)
			this.channelKey = dirtyData.channelKey;

		if (dirtyData.channelData)
			this.channelData = dirtyData.channelData;
		
	}

	return fullSchema;

}

