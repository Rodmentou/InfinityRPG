var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var bcrypt = require('bcrypt-nodejs');

var UserSchema = new Schema ( {
	name: String,
	username: { type: String, required: true, index: { unique: true}},
	password: { type: String, required: true, select: false },
	maxHp: Number,
	hp: Number,
	exp: Number,
	def: Number,
	atk: Number,
	elem: Number,
	lastAttacked: Date
});

UserSchema.pre('save', function (next) {
	var user = this;

	if (!user.isModified('password')) return next();

	bcrypt.hash(user.password, null, null, function (err, hash) {
		if (err) return next(err);

		user.password = hash;
		next();
	});
});

UserSchema.pre('update', function (next) {
	var user = this;
	console.log(this.hp);


	if (user.hp > user.maxHp) {
		console.log(user.hp);
		user.hp = maxHp;
	}

	next();
});

UserSchema.methods.comparePassword = function (password) {
	var user = this;

	return bcrypt.compareSync(password, user.password);
};

module.exports = mongoose.model('User', UserSchema);