
module.exports.Schema = function (mongoose){

	var crypto = require('crypto');

	//***** Data Model *******
	var fullSchema = mongoose.Schema({
		firstName: String,
		lastName: String,
		email: String,
		passVer: {
			type: Number, 
			default: 0
		},
		password: String,
		passSalt: String,
		passHash: String
	});

	//***** Hash Password *******
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

	//***** Function Populate and Validate Dirty Data *******
	fullSchema.methods.Populate = function (dirtyData){
		
		if (dirtyData.firstName)
			this.firstName = dirtyData.firstName;

		if (dirtyData.lastName)
			this.lastName = dirtyData.lastName;

		if (dirtyData.email)
			this.email = dirtyData.email;

		if (dirtyData.password) {
			this.setPassword = dirtyData.password;
		}

	}

	//***** Function Validates Submitted Password *******
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

	//***** Generate Salt *******
	fullSchema.methods.MakeSalt = function () {
    	return Math.round((new Date().valueOf() * Math.random())) + '';
  	}

  	//***** Hash Password *******
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

	return fullSchema;

}

