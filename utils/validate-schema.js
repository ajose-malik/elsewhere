const Joi = require('joi');

module.exports.elseValidator = Joi.object({
	elsewhere: Joi.object({
		title: Joi.string().required(),
		description: Joi.string().required(),
		quin: Joi.number().required().min(0),
		location: Joi.string().required()
	}).required()
});

module.exports.editElseValidator = Joi.object({
	elsewhere: Joi.object({
		description: Joi.string().required(),
		quin: Joi.number().required().min(0)
	}).required()
});

module.exports.userValidator = Joi.object({
	user: Joi.object({
		username: Joi.string().required().min(4),
		password: Joi.string().required().min(6),
		about: Joi.string().required()
	}).required()
});

module.exports.ratingValidator = Joi.object({
	rating: Joi.object({
		star: Joi.number().required().min(1).max(5),
		comment: Joi.string().required()
	}).required()
});
