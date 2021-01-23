const User = require('../models/user');
const Elsewhere = require('../models/elsewhere');
const ExpressError = require('./express-error');
const {
	userValidator,
	elseValidator,
	editElseValidator
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

module.exports.renderHome = async (req, res) => {
	let currentUser = req.session.currentUser;

	const elsewheres = await Elsewhere.find({})
		.populate('rating')
		.populate('author');

	const elsewhereAtIdxZero = [];
	for (let elsewhere of elsewheres) {
		const image = elsewhere.image.map(el => el);
		elsewhereAtIdxZero.push({ image: image[0].url, elsewhere });
	}

	const rand = value => {
		return value[Math.floor(Math.random() * elsewheres.length)];
	};

	const rand1Ratings = [];
	const rand2Ratings = [];
	const rand3Ratings = [];
	const rand4Ratings = [];
	const rand5Ratings = [];
	const rand6Ratings = [];
	const randElsewhere1 = rand(elsewheres);
	const randElsewhere2 = rand(elsewheres);
	const randElsewhere3 = rand(elsewheres);
	const randElsewhere4 = rand(elsewheres);
	const randElsewhere5 = rand(elsewheres);
	const randElsewhere6 = rand(elsewheres);

	const randElsewhereRatings = (elseObject, ratingsArray) => {
		let ratingsTotal = 0;
		let numRatings = 0;
		elseObject.rating.forEach(rating => {
			ratingsTotal += rating.star;
			numRatings += 1;
		});
		ratingsArray.push({ ratingsTotal, numRatings });
	};

	randElsewhereRatings(randElsewhere1, rand1Ratings);
	randElsewhereRatings(randElsewhere2, rand2Ratings);
	randElsewhereRatings(randElsewhere3, rand3Ratings);
	randElsewhereRatings(randElsewhere4, rand4Ratings);
	randElsewhereRatings(randElsewhere5, rand5Ratings);
	randElsewhereRatings(randElsewhere6, rand6Ratings);

	res.render('elsewhere/index', {
		currentUser,
		elsewhereAtIdxZero,
		randElsewhere1,
		randElsewhere2,
		randElsewhere3,
		randElsewhere4,
		randElsewhere5,
		randElsewhere6,
		rand1Ratings,
		rand2Ratings,
		rand3Ratings,
		rand4Ratings,
		rand5Ratings,
		rand6Ratings
	});
};
