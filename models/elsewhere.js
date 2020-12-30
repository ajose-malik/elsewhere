const mongoose = require('mongoose');
const { Schema } = mongoose;
// const Rating = require('./rating');

const elsewhereSchema = new Schema({
	title: { type: String },
	description: { type: String },
	quin: { type: Number },
	rating: [{ type: Schema.Types.ObjectId, ref: 'Rating' }],
	author: [{ type: Schema.Types.ObjectId, ref: 'User' }],
	location: { type: String },
	image: []
});

module.exports = mongoose.model('Elsewhere', elsewhereSchema);
