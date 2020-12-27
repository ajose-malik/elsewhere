const bcrypt = require('bcrypt');
const express = require('express');
const session = express.Router();
const User = require('../models/user-mod.js');

session.get('/new', (req, res) => {
	res.render('session/new.ejs', { currentUser: req.session.currentUser });
});

session.post('/', (req, res) => {
	User.findOne({ username: req.body.username }, (err, foundUser) => {
		if (err) {
			console.log(err);
			res.send('oops the db had a problem');
		} else if (!foundUser) {
			res.send('<a  href="/">Sorry, no user found </a>');
		} else {
			if (bcrypt.compareSync(req.body.password, foundUser.password)) {
				req.session.currentUser = foundUser;
				res.redirect('/');
			} else {
				res.send('<a href="/"> password does not match </a>');
			}
		}
	});
});

session.delete('/', (req, res) => {
	req.session.destroy(() => {
		res.redirect('/');
	});
});

module.exports = session;
