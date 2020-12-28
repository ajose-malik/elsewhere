const mongoose = require('mongoose');
const { Schema } = mongoose;

const pixelSchema = Schema({
	title: String,
	// images: [imageSchema],
	description: String
});

module.exports = mongoose.model('Pixel', pixelSchema);
