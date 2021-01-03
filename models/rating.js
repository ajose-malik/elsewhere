const mongoose = require('mongoose');
const { Schema } = mongoose;

const ratingSchema = new Schema({
	star: Number,
	patron: String
});

module.exports = mongoose.model('Rating', ratingSchema);
