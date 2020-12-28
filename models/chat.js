const mongoose = require('mongoose');
const { Schema } = mongoose;

const chatSchema = Schema({
	description: String,
	author: [{ type: Schema.Types.ObjectId, ref: 'User' }]
});

module.exports = mongoose.model('Chat', chatSchema);
