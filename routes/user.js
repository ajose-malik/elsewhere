const bcrypt = require('bcrypt');
const express = require('express');
const userRouter = express.Router();
const User = require('../models/user');

userRouter.get('/sign-up', (req, res) => {
	res.render('user/sign-up');
});

userRouter.post('/sign-up', async (req, res) => {
	const { user } = req.body;
	user.password = bcrypt.hashSync(user.password, bcrypt.genSaltSync(10));

	const newUser = new User(user);
	await newUser.save();
	console.log(user);
	res.send('signed-up!!!');
});

userRouter.get('/sign-in', (req, res) => {
	res.render('user/sign-in');
});

userRouter.post('/sign-in', async (req, res) => {
	const { username, password } = req.body.user;
	const user = await User.findOne({ username });

	if (!user) {
		res.send('no user found');
	} else {
		if (bcrypt.compareSync(password, user.password)) {
			req.session.currentUser = user;
			console.log(req.session);
			res.redirect('/');
		} else {
			res.send('password does not match');
		}
	}
});

userRouter.delete('/', (req, res) => {
	req.session.destroy(() => {
		res.redirect('/');
	});
});

module.exports = userRouter;
