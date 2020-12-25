const { modelSchema } = require('./validateSchema');
const ServerError = require('ServerError');

module.exports = (req, res, next) => {
	const { error } = modelSchema.validate(req.body);
	if (error) {
		const message = error.details.map(element => element.message).join(',');
		throw new ServerError(400, message);
	}
};
