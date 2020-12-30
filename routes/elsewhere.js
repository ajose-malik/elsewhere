const express = require('express');
const elseRouter = express.Router();
const Elsewhere = require('../models/elsewhere');

elseRouter.get('/new', (req, res) => {
	res.render('elsewhere/new');
});

elseRouter.post('/', async (req, res) => {
	const elsewhere = new Elsewhere(req.body.elsewhere);
	await elsewhere.save();
	console.log(req.body.elsewhere);
	res.send('created!!!');
});

module.exports = elseRouter;
