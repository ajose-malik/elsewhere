const mongoose = require('mongoose');
const { Schema } = mongoose;

const photoSchema = new Schema({
	url: String,
	filename: String
});

const userSchema = new Schema({
	username: {
		type: String,
		required: true
	},
	password: {
		type: String,
		required: true
	},
	photo: [photoSchema],
	about: String,
	quin: Number
});

module.exports = mongoose.model('User', userSchema);
