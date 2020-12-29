const mongoose = require('mongoose');
const { Schema } = mongoose;

const ratingSchema = new Schema({
	rating: Number,
	author: {
		type: Schema.Types.ObjectId,
		ref: 'User'
	}
});

module.exports = mongoose.model('Rating', ratingSchema);
