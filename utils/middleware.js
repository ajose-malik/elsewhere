const User = require('../models/user');
const Elsewhere = require('../models/elsewhere');
const ExpressError = require('./expressError');
const {
	userValidator,
	elseValidator,
	editElseValidator,
	ratingValidator
} = require('../utils/validate-schema');

module.exports.validateUser = async (req, res, next) => {
	const { error } = userValidator.validate(req.body);
	const { username } = req.body.user;
	const existingUser = await User.findOne({ username });

	if (existingUser) {
		req.flash('error', 'Username already exists');
		res.redirect('sign-up');
	} else if (error) {
		const message = error.details.map(err => err.message).join(',');
		req.flash('error', message);
		res.redirect('sign-up');
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

module.exports.validateEditElse = async (req, res, next) => {
	const { id } = req.params;
	const { error } = editElseValidator.validate(req.body);

	if (error) {
		const message = error.details.map(err => err.message).join(',');
		req.flash('error', message);
		return res.redirect(`/elsewhere/${id}/edit`);
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

module.exports.isAuth = (req, res, next) => {
	if (!req.session.currentUser) {
		req.flash('error', 'Please sign-in');
		res.redirect('/user/sign-in');
	} else {
		next();
	}
};

module.exports.isAuthor = async (req, res, next) => {
	const { id } = req.params;
	const elsewhere = await Elsewhere.findById(id);
	if (elsewhere.author != req.session.currentUser) {
		req.flash('error', `You don't have permission`);
		return res.redirect(`/elsewhere/${id}`);
	} else {
		next();
	}
};
