const express = require('express');
const elseRouter = express.Router();
const Elsewhere = require('../models/elsewhere');
const { validateElse } = require('../utils/middleware');

elseRouter.get('/', async (req, res) => {
	const elsewheres = await Elsewhere.find({});
	res.render('elsewhere/index', { elsewheres });
});

elseRouter.get('/new', (req, res) => {
	res.render('elsewhere/new');
});

elseRouter.post('/', validateElse, async (req, res) => {
	const { elsewhere } = req.body;
	const newElsewhere = new Elsewhere(elsewhere);
	await newElsewhere.save();
	res.redirect(`/elsewhere/${newElsewhere.id}`);
});

elseRouter.get('/:id', async (req, res) => {
	const { id } = req.params;
	const elsewhere = await Elsewhere.findById(id);
	res.render('elsewhere/show', { elsewhere });
});

elseRouter.get('/:id/edit', async (req, res) => {
	const { id } = req.params;
	const elsewhere = await Elsewhere.findById(id);
	res.render('elsewhere/edit', { elsewhere });
});

elseRouter.put('/:id', async (req, res) => {
	const { id } = req.params;
	const elsewhere = await Elsewhere.findByIdAndUpdate(id, {
		...req.body.elsewhere
	});
	res.redirect(`/elsewhere/${elsewhere.id}`);
});

elseRouter.delete('/:id', async (req, res) => {
	const { id } = req.params;
	await Elsewhere.findByIdAndDelete(id);
	res.redirect('/elsewhere');
});

module.exports = elseRouter;
