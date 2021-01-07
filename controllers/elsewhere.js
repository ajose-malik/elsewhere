const express = require('express');
const elseRouter = express.Router();
const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding');
const mbxToken = process.env.MAPBOX_TOKEN;
const mapper = mbxGeocoding({ accessToken: mbxToken });
const multer = require('multer');
const { storage } = require('../utils/cloud-storage');
const upload = multer({ storage });
const Elsewhere = require('../models/elsewhere');
const Rating = require('../models/rating');
const User = require('../models/user');
const { isAuth, isAuthor } = require('../utils/middleware');
const catchAsync = require('../utils/catch-async');

// Index route
elseRouter.get(
	'/',
	// isAuth,
	async (req, res) => {
		const elsewheres = await Elsewhere.find({});
		const { currentUser } = req.body;
		res.render('home', { elsewheres, currentUser });
	}
);

// New route
elseRouter.get(
	'/new',
	// isAuth,
	(req, res) => {
		const { currentUser } = req.body;

		res.render('elsewhere/new', { currentUser });
	}
);

elseRouter.post(
	'/',
	// isAuth,
	upload.array('image'),
	// validateElse,
	async (req, res) => {
		const { elsewhere } = req.body;
		const mapData = await mapper
			.forwardGeocode({
				query: elsewhere.location,
				limit: 1
			})
			.send();

		if (mapData.body.features[0] === undefined) {
			req.flash('error', 'Location does not exist');
			return res.redirect('/elsewhere/new');
		} else {
			const newElsewhere = new Elsewhere(elsewhere);
			newElsewhere.geometry = mapData.body.features[0].geometry;

			newElsewhere.author = req.session.currentUser;
			newElsewhere.image = req.files.map(image => ({
				url: image.path,
				filename: image.filename
			}));

			await newElsewhere.save();

			res.redirect(`/elsewhere/${newElsewhere.id}`);
		}
	}
);

// Show route
elseRouter.get('/:id', isAuth, async (req, res) => {
	const { id } = req.params;
	const elsewhere = await Elsewhere.findById(id)
		.populate('rating')
		.populate('author');
	const { currentUser } = req.session;
	const currentUserInfo = await User.findById(currentUser);
	if (currentUserInfo) {
		const { username } = currentUserInfo;
		return res.render('elsewhere/show', { elsewhere, currentUser, username });
	} else {
		return res.redirect('/user/sign-in');
	}
});

elseRouter.get('/:id/edit', async (req, res) => {
	const { id } = req.params;
	const elsewhere = await Elsewhere.findById(id);
	res.render('elsewhere/edit', { elsewhere });
});

// Edit route
elseRouter.put(
	'/:id',
	isAuth,
	isAuthor,
	upload.array('image'),
	async (req, res) => {
		const { id } = req.params;
		const elsewhere = await Elsewhere.findByIdAndUpdate(id, {
			...req.body.elsewhere
		});

		const image = req.files.map(image => ({
			url: image.path,
			filename: image.filename
		}));
		elsewhere.image.push(...image);
		await elsewhere.save();

		req.flash('message', 'Updated adventure');
		res.redirect(`/elsewhere/${elsewhere.id}`);
	}
);

// Destroy route
elseRouter.delete('/:id', async (req, res) => {
	const { id } = req.params;
	await Elsewhere.findByIdAndDelete(id);
	res.redirect('/elsewhere');
});

// Rating route
elseRouter.post(
	'/:id/rating',
	isAuth,
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

		res.redirect(`/elsewhere/${elsewhere.id}`);
	})
);

module.exports = elseRouter;