const User = require('../models/user');
const Elsewhere = require('../models/elsewhere');
const ExpressError = require('./expressError');
const {
	userValidator,
	elseValidator,
	ratingValidator
} = require('../utils/validate-schema');

module.exports.validateUser = async (req, res, next) => {
	const { error } = userValidator.validate(req.body);
	const { username } = req.body.user;
	const existingUser = await User.findOne({ username });

	if (existingUser) {
		const errMsg = 'Username already exists';
		next(new ExpressError(400, errMsg));
	} else if (error) {
		const errMsg = error.details.map(err => err.message).join(',');
		next(new ExpressError(400, errMsg));
	} else {
		next();
	}
};

module.exports.validateElse = async (req, res, next) => {
	const { error } = elseValidator.validate(req.body);
	const { title } = req.body.elsewhere;
	const existingTitle = await Elsewhere.findOne({ title });

	if (existingTitle) {
		const errMsg = 'Title already exists';
		next(new ExpressError(400, errMsg));
	} else if (error) {
		const errMsg = error.details.map(err => err.message).join(',');
		next(new ExpressError(400, errMsg));
	} else {
		next();
	}
};

module.exports.validateRating = async (req, res, next) => {
	const { error } = ratingValidator.validate(req.body);
	// const { rating } = req.body.elsewhere;
	// const existingRating = await Elsewhere.findOne({ rating });

	// if (existingTitle) {
	// 	const errMsg = 'Title already exists';
	// 	next(new ExpressError(400, errMsg));
	// } else

	if (error) {
		const errMsg = error.details.map(err => err.message).join(',');
		next(new ExpressError(400, errMsg));
	} else {
		next();
	}
};
