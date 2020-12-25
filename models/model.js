const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const modelSchema = Schema({
	name: { type: String, required: true },
	color: { type: String, required: true },
	readyToEat: Boolean
});

const Model = mongoose.model('Model', modelSchema);

module.exports = Model;
