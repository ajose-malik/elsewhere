const mongoose = require('mongoose');
const { Schema } = mongoose;
const Review = require('./review');

const elsewhereSchema = Schema({
	location: String,
	title: String,
	description: String,
	cost: Number,
	author: [{ type: Schema.Types.ObjectId, ref: 'User' }],
	reviews: [{ type: Schema.Types.ObjectId, ref: 'Review' }]
});

module.exports = mongoose.model('Elsewhere', elsewhereSchema);
