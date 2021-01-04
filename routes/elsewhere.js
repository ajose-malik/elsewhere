const express = require('express');
const elseRouter = express.Router();
const Elsewhere = require('../models/elsewhere');
const Rating = require('../models/rating');
const User = require('../models/user');
const {
	validateElse,
	validateEditElse,
	validateRating,
	isAuth,
	isAuthor
} = require('../utils/middleware');
const catchAsync = require('../utils/catchAsync');

elseRouter.get('/', isAuth, async (req, res) => {
	const elsewheres = await Elsewhere.find({});
	res.render('elsewhere/index', { elsewheres });
});

elseRouter.get('/new', isAuth, (req, res) => {
	res.render('elsewhere/new');
});

elseRouter.post('/', isAuth, validateElse, async (req, res) => {
	const { elsewhere } = req.body;
	const newElsewhere = new Elsewhere(elsewhere);
	newElsewhere.author = req.session.currentUser;
	await newElsewhere.save();
	res.redirect(`/elsewhere/${newElsewhere.id}`);
});

elseRouter.get('/:id', isAuth, async (req, res) => {
	const { id } = req.params;
	const elsewhere = await Elsewhere.findById(id)
		.populate('rating')
		.populate('author');
	console.log(elsewhere);
	const { currentUser } = req.session;
	const currentUserInfo = await User.findById(currentUser);
	const { username } = currentUserInfo;
	console.log(username);
	res.render('elsewhere/show', { elsewhere, currentUser, username });
});

elseRouter.get('/:id/edit', isAuth, async (req, res) => {
	const { id } = req.params;
	const elsewhere = await Elsewhere.findById(id);
	res.render('elsewhere/edit', { elsewhere });
});

elseRouter.put('/:id', isAuth, isAuthor, validateEditElse, async (req, res) => {
	const { id } = req.params;
	const elsewhere = await Elsewhere.findByIdAndUpdate(id, {
		...req.body.elsewhere
	});
	req.flash('message', 'Updated adventure');
	res.redirect(`/elsewhere/${elsewhere.id}`);
});

elseRouter.delete('/:id', async (req, res) => {
	const { id } = req.params;
	await Elsewhere.findByIdAndDelete(id);
	res.redirect('/elsewhere');
});

elseRouter.post(
	'/:id/rating',
	isAuth,
	validateRating,
	catchAsync(async (req, res) => {
		const { id } = req.params;
		const { rating } = req.body;
		const elsewhere = await Elsewhere.findById(id);
		const rated = new Rating(rating);

		const currentUser = await User.findById(req.session.currentUser);
		rated.patron = currentUser.username;
		await rated.save();

		if (rated.patron) elsewhere.rating.push(rated);
		await elsewhere.save();

		const author = await User.findById(elsewhere.author);
		author.quin += rating.star / 5;
		await author.save();

		res.redirect(`/elsewhere/${elsewhere.id}`);
	})
);

module.exports = elseRouter;
