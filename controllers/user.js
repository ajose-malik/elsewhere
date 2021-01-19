const bcrypt = require('bcrypt');
const express = require('express');
const { validateUser } = require('../utils/middleware');
const catchAsync = require('../utils/catch-async');
const userRouter = express.Router();
const User = require('../models/user');

// Sign-up
userRouter.get('/sign-up', (req, res) => {
	const { currentUser } = req.body;
	res.render('user/sign-up', { currentUser });
});

userRouter.post(
	'/sign-up',
	validateUser,
	catchAsync(async (req, res) => {
		const { user } = req.body;

		user.password = bcrypt.hashSync(user.password, bcrypt.genSaltSync(10));

		const newUser = new User({ ...user });
		await newUser.save();
		let currentUser = req.session.currentUser;
		req.session.currentUser = newUser._id;
		req.flash('message', `Hi ${user.username}!`);
		res.render('home', { currentUser });
	})
);

// Sign-in
userRouter.get('/sign-in', (req, res) => {
	let currentUser = req.session.currentUser;
	res.render('user/sign-in', { currentUser });
});

userRouter.post(
	'/sign-in',
	catchAsync(async (req, res) => {
		const { username, password } = req.body.user;
		let currentUser = req.session.currentUser;

		const user = await User.findOne({ username });

		if (!user) {
			req.flash('error', 'Incorrect username or password');
			res.render('user/sign-in', { currentUser });
		} else {
			if (bcrypt.compareSync(password, user.password)) {
				req.session.currentUser = user._id;
				req.flash('message', `Welcome back ${user.username}!`);
				res.render('home', { currentUser });
			} else {
				req.flash('error', 'Incorrect username or password');
				res.render('user/sign-in', { currentUser });
			}
		}
	})
);

userRouter.delete('/sign-out', (req, res) => {
	req.session.destroy();
	res.redirect('/');
});

module.exports = userRouter;
