const mongoose = require('mongoose');
const { Schema } = mongoose;

const imageSchema = Schema({
	url: String,
	filename: String
});

module.exports = mongoose.model('Image', imageSchema);
