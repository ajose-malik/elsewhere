const bcrypt = require('bcrypt');
const express = require('express');
const { validateUser } = require('../utils/middleware');
const catchAsync = require('../utils/catchAsync');
const userRouter = express.Router();
const User = require('../models/user');

userRouter.get('/sign-up', (req, res) => {
	res.render('user/sign-up');
});

userRouter.post(
	'/sign-up',
	validateUser,
	catchAsync(async (req, res) => {
		const { user } = req.body;
		user.password = bcrypt.hashSync(user.password, bcrypt.genSaltSync(10));

		const newUser = new User(user);
		await newUser.save();

		req.session.currentUser = newUser.id;
		console.log(req.session);
		req.flash('message', `Hi ${user.username}`);
		res.redirect('/');
	})
);

userRouter.get('/sign-in', (req, res) => {
	res.render('user/sign-in');
});

userRouter.post('/sign-in', async (req, res) => {
	const { username, password } = req.body.user;
	const user = await User.findOne({ username });

	if (!user) {
		req.flash('error', 'Incorrect username or password');
		return res.redirect('sign-in');
	} else {
		if (bcrypt.compareSync(password, user.password)) {
			req.session.currentUser = user.id;
			req.flash('message', `Welcome back ${user.username}`);
			return res.redirect('/elsewhere');
		} else {
			req.flash('error', 'Incorrect username or password');
			return res.redirect('sign-in');
		}
	}
});

userRouter.delete('/sign-out', (req, res) => {
	req.session.destroy();
	res.redirect('/');
});

module.exports = userRouter;
