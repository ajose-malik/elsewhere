const bcrypt = require('bcrypt');
const express = require('express');
const userRouter = express.Router();
const User = require('../models/user');

userRouter.get('/sign-up', (req, res) => {
	res.render('user/sign-up');
});

userRouter.post('/', async (req, res) => {
	const { user } = req.body;
	user.password = bcrypt.hashSync(user.password, bcrypt.genSaltSync(10));

	const newUser = new User(user);
	await newUser.save();
	console.log(user);
	res.send('signed-up!!!');
});

module.exports = userRouter;
