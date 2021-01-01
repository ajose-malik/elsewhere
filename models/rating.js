const mongoose = require('mongoose');
const { Schema } = mongoose;

const ratingSchema = new Schema({
	star: Number
});

module.exports = mongoose.model('Rating', ratingSchema);
