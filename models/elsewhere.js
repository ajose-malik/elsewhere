const mongoose = require('mongoose');
const { Schema } = mongoose;
// const Rating = require('./rating');

const elsewhereSchema = new Schema({
	title: { type: String, required: true },
	description: { type: String, required: true },
	cost: { type: Number, required: true },
	rating: [{ type: Schema.Types.ObjectId, ref: 'Rating' }],
	author: [{ type: Schema.Types.ObjectId, ref: 'User' }],
	location: { type: String, required: true },
	image: []
});

module.exports = mongoose.model('Elsewhere', elsewhereSchema);
