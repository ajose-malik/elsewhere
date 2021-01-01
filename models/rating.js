const mongoose = require('mongoose');
const { Schema } = mongoose;

const ratingSchema = new Schema({
	rating: Number
});

module.exports = mongoose.model('Rating', ratingSchema);
