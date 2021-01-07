const mongoose = require('mongoose');
const { Schema } = mongoose;
const Rating = require('./rating');

const imageSchema = new Schema({
	url: String,
	filename: String
});

const virtualProp = { toJSON: { virtuals: true } };

const elsewhereSchema = new Schema(
	{
		title: { type: String },
		description: { type: String },
		quin: { type: Number },
		rating: [{ type: Schema.Types.ObjectId, ref: 'Rating' }],
		author: [{ type: Schema.Types.ObjectId, ref: 'User' }],
		location: { type: String },
		image: [imageSchema],
		geometry: {
			type: {
				type: String,
				enum: ['Point'],
				required: true
			},
			coordinates: {
				type: [Number],
				required: true
			}
		}
	},
	virtualProp
);

// Mongoose Virtual /////////////////////////////
elsewhereSchema.virtual('properties.popUpMarkup').get(function () {
	return `
	<strong><a href="/elsewhere/${this._id}">${this.title}</a><strong>
	<p>${this.description.substring(0, 40)}...</p>`;
});

// Pre/Post Hook Mongoose Middleware /////////////////////////////
elsewhereSchema.post('findOneAndDelete', async elsewhere => {
	if (elsewhere) {
		await Rating.deleteMany({
			_id: {
				$in: elsewhere.rating
			}
		});
	}
});

module.exports = mongoose.model('Elsewhere', elsewhereSchema);
