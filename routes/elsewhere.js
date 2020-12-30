const express = require('express');
const elseRouter = express.Router();
const Elsewhere = require('../models/elsewhere');

elseRouter.get('/new', (req, res) => {
	res.render('elsewhere/new');
});

elseRouter.post('/', async (req, res) => {
	const { elsewhere } = req.body;
	const newElsewhere = new Elsewhere(elsewhere);
	await newElsewhere.save();
	console.log(elsewhere);
	res.send('created!!!');
});

module.exports = elseRouter;
