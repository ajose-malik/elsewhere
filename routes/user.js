const bcrypt = require('bcrypt');
const express = require('express');
const multer = require('multer');
const { storage } = require('../utils/cloud-storage');
const upload = multer({ storage });
const { validateUser } = require('../utils/middleware');
const catchAsync = require('../utils/catch-async');
const userRouter = express.Router();
const User = require('../models/user');

userRouter.get('/sign-up', (req, res) => {
	res.render('user/sign-up');
});

userRouter.post(
	'/sign-up',
	upload.array('photo'),
	validateUser,
	catchAsync(async (req, res) => {
		const { user } = req.body;
		user.password = bcrypt.hashSync(user.password, bcrypt.genSaltSync(10));

		const newUser = new User({ ...user, quin: 10 });
		await newUser.save();
		console.log(user);
		req.session.currentUser = newUser._id;
		newUser.photo = req.files.map(photo => ({
			url: photo.path,
			filename: photo.filename
		}));
		console.log(newUser);
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
			req.session.currentUser = user._id;
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
