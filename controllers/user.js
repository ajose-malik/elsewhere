const bcrypt = require('bcrypt');
const express = require('express');
const user = express.Router();
const User = require('../models/user-mod.js');

user.get('/new', (req, res) => {
	res.render('user/new.ejs', { currentUser: req.session.currentUser });
});

user.post('/', (req, res) => {
	req.body.password = bcrypt.hashSync(
		req.body.password,
		bcrypt.genSaltSync(10)
	);
	User.create(req.body, (err, createdUser) => {
		res.redirect('/');
	});
});

module.exports = user;
