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
	catchAsync(async (req, res) => {
		const elsewheres = await Elsewhere.find({});
		let { currentUser } = req.session;
		res.render('home', { elsewheres, currentUser });
	})
);

// New route
elseRouter.get(
	'/new',
	// isAuth,
	(req, res) => {
		let currentUser = req.session.currentUser;
		res.render('elsewhere/new', { currentUser });
	}
);

elseRouter.post(
	'/',
	upload.array('image'),
	// isAuth,
	catchAsync(async (req, res) => {
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
		} else if (req.files.length > 5) {
			req.flash('error', 'Number of files must not exceed 5');
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
	})
);

// Collection route
elseRouter.get(
	'/collection',
	// isAuth,
	catchAsync(async (req, res) => {
		let { currentUser } = req.session;
		const elsewheres = await Elsewhere.find({}).populate('rating');

		const userElsewheres = [];
		elsewheres.map(elsewhere => {
			if (elsewhere.author.includes(currentUser)) {
				userElsewheres.push(elsewhere);
			}
		});

		if (currentUser) {
			return res.render('elsewhere/collection', {
				userElsewheres,
				currentUser
			});
		} else {
			return res.redirect('/user/sign-in');
		}
	})
);

// Inspiration route
elseRouter.get(
	'/inspiration',
	// isAuth,
	catchAsync(async (req, res) => {
		let { currentUser } = req.session;
		const user = await User.findById(currentUser);

		if (currentUser) {
			if (user.inspiration.length) {
				const inspiration = user.inspiration.map(inspired => inspired);

				return res.render('elsewhere/inspiration', {
					inspiration,
					currentUser
				});
			} else {
				return res.redirect('/elsewhere/inspiration');
			}
		} else {
			return res.redirect('/user/sign-in');
		}
	})
);

// Inspiration route
elseRouter.post(
	'/:id/inspiration',
	catchAsync(async (req, res) => {
		const { id } = req.params;
		const elsewhere = await Elsewhere.findById(id).populate('rating');
		const { currentUser } = req.session;
		const user = await User.findById(currentUser);
		user.inspiration.push(elsewhere);
		await user.save();
		const { inspiration } = user;
		res.render('elsewhere/inspiration', { inspiration, currentUser });
	})
);

// Show route
elseRouter.get(
	'/:id',
	// isAuth,
	catchAsync(async (req, res) => {
		const { id } = req.params;
		const elsewhere = await Elsewhere.findById(id)
			.populate('rating')
			.populate('author');

		const authorId = elsewhere.author[0]._id;
		const author = await User.findById(authorId);

		let { currentUser } = req.session;
		const currentUserInfo = await User.findById(currentUser);

		if (currentUserInfo) {
			const { username } = currentUserInfo;
			return res.render('elsewhere/show', {
				elsewhere,
				currentUser,
				username,
				author,
				authorId
			});
		} else {
			return res.redirect('/user/sign-in');
		}
	})
);

// Edit route
elseRouter.get(
	'/:id/edit',
	// isAuth,
	// isAuthor,
	catchAsync(async (req, res) => {
		let currentUser = req.session.currentUser;
		const { id } = req.params;
		const elsewhere = await Elsewhere.findById(id);
		res.render('elsewhere/edit', { elsewhere, currentUser });
	})
);

elseRouter.put(
	'/:id',
	upload.array('image'),
	// isAuth,
	// isAuthor,
	catchAsync(async (req, res) => {
		const { id } = req.params;
		const elsewhere = await Elsewhere.findByIdAndUpdate(id, {
			...req.body.elsewhere
		});

		if (req.files.length > 5) {
			req.flash('error', 'Number of files must not exceed 5');
			return res.redirect('/elsewhere/new');
		} else {
			const image = req.files.map(image => ({
				url: image.path,
				filename: image.filename
			}));
			elsewhere.image.push(...image);
		}

		await elsewhere.save();

		req.flash('message', 'Updated adventure');
		res.redirect(`/elsewhere/${elsewhere.id}`);
	})
);

// Destroy route - Collection
elseRouter.delete(
	'/:id',
	// isAuth,
	// isAuthor,
	catchAsync(async (req, res) => {
		const { id } = req.params;
		await Elsewhere.findByIdAndDelete(id);
		res.redirect('/elsewhere/collection');
	})
);

// Rating route
elseRouter.post(
	'/:id/rating',
	catchAsync(async (req, res) => {
		const { id } = req.params;
		const { rating } = req.body;
		const elsewhere = await Elsewhere.findById(id);
		const rated = new Rating(rating);

		let currentUser = await User.findById(req.session.currentUser);
		rated.patron = currentUser.username;
		await rated.save();

		if (rated.patron) elsewhere.rating.push(rated);
		await elsewhere.save();

		res.redirect(`/elsewhere/${elsewhere.id}`);
	})
);

module.exports = elseRouter;
