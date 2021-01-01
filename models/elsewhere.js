const mongoose = require('mongoose');
const { Schema } = mongoose;
const Rating = require('./rating');

const elsewhereSchema = new Schema({
	title: { type: String },
	description: { type: String },
	quin: { type: Number },
	rating: [{ type: Schema.Types.ObjectId, ref: 'Rating' }],
	author: [{ type: Schema.Types.ObjectId, ref: 'User' }],
	location: { type: String },
	image: []
});

// Pre/Post Hook Mongoose Middleware /////////////////////////////

elsewhereSchema.post('findOneAndDelete', async function (elsewhere) {
	if (elsewhere) {
		await Rating.deleteMany({
			_id: {
				$in: elsewhere.rating
			}
		});
	}
});

module.exports = mongoose.model('Elsewhere', elsewhereSchema);
