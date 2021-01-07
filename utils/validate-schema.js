const Joi = require('joi');

module.exports.elseValidator = Joi.object({
	elsewhere: Joi.object({
		title: Joi.string().required(),
		description: Joi.string().required(),
		location: Joi.string().required(),
		geometry: Joi.object({
			type: Joi.required(),
			coodinates: Joi.required()
		}).required()
	}).required()
});

module.exports.editElseValidator = Joi.object({
	elsewhere: Joi.object({
		description: Joi.string().required()
	}).required()
});

module.exports.userValidator = Joi.object({
	user: Joi.object({
		username: Joi.string().required().min(4),
		password: Joi.string().required().min(6)
	}).required()
});

module.exports.ratingValidator = Joi.object({
	rating: Joi.object({
		star: Joi.number().required().min(1).max(5),
		comment: Joi.string().required()
	}).required()
});
