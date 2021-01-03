const express = require('express');
const elseRouter = express.Router();
const Elsewhere = require('../models/elsewhere');
const Rating = require('../models/rating');
const { validateElse, validateRating, isAuth } = require('../utils/middleware');
const catchAsync = require('../utils/catchAsync');
const user = require('../models/user');

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
	const elsewhere = await Elsewhere.findById(id);
	const { currentUser } = req.session;
	console.log(req.session);
	console.log(elsewhere);
	// .populate('rating')
	// .populate('author');
	res.render('elsewhere/show', { elsewhere, currentUser });
});

elseRouter.get('/:id/edit', isAuth, async (req, res) => {
	const { id } = req.params;
	const elsewhere = await Elsewhere.findById(id);
	res.render('elsewhere/edit', { elsewhere });
});

elseRouter.put('/:id', isAuth, async (req, res) => {
	const { id } = req.params;
	const elsewhere = await Elsewhere.findByIdAndUpdate(id, {
		...req.body.elsewhere
	});
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
		rated.patron = req.session.currentUser;
		await rated.save();

		if (rated.patron) elsewhere.rating.push(rated.patron);
		await elsewhere.save();
		const author = await user.findById(elsewhere.author);
		if (!author.quin) {
			author.quin = Number(rating.star / 5);
		} else {
			author.quin += Number(rating.star / 5);
		}
		await author.save();
		// req.session.quin = author.quin;
		console.log(elsewhere);
		console.log(author);
		console.log(req.session);
		res.redirect(`/elsewhere/${elsewhere.id}`);
	})
);

module.exports = elseRouter;
