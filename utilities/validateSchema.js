const joi = require('joi');

module.exports.modelSchema = joi.object({
	model: joi
		.object({
			name: joi.string().required(),
			cowry: joi.number().required().min(0)
		})
		.required()
});
