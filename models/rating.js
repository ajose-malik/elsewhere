const mongoose = require('mongoose');
const { Schema } = mongoose;

const ratingSchema = new Schema({
	star: Number,
	patron: Schema.Types.ObjectId
});

module.exports = mongoose.model('Rating', ratingSchema);
