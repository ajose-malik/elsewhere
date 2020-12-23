const express = require('express');
const Model = require('../models/model-mod.js');
const model = express.Router();

// MIDDLEWARE
const isAuthenticated = (req, res, next) => {
	if (req.session.currentUser) {
		return next();
	} else {
		res.redirect('/session/new');
	}
};

// HOME
model.get('/', (req, res) => {
	res.render('home');
});

// INDEX
model.get('/', (req, res) => {
	Model.find({}, (err, allModels) => {
		res.render('model/index.ejs', {
			variableName: allModels,
			currentUser: req.session.currentUser
		});
	});
});

// app.get('/campgrounds', async (req, res) => {
// 	const campgrounds = await Campground.find({});
// 	res.render('campgrounds/index', { campgrounds });
// });

// NEW
model.get('/new', (req, res) => {
	res.render('model/new.ejs', { currentUser: req.session.currentUser });
});

// app.get('/campgrounds/new', (req, res) => {
// 	res.render('campgrounds/new');
// });

// CREATE
model.post('/', (req, res) => {
	Model.create(req.body, (err, createdModel) => {
		res.redirect('/model');
	});
});

// app.post('/campgrounds', async (req, res) => {
// 	const campground = new Campground(req.body.campground);
// 	await campground.save();
// 	res.redirect(`/campgrounds/${campground._id}`);
// });

// SHOW
model.get('/:id', (req, res) => {
	Model.findById(req.params.id, (err, foundModel) => {
		res.render('model/show.ejs', {
			variableName: foundModel,
			currentUser: req.session.currentUser
		});
	});
});

// app.get('/campgrounds/:id', async (req, res) => {
// 	const { id } = req.params;
// 	const campground = await Campground.findById(id);
// 	res.render('campgrounds/show', { campground });
// });

// EDIT
model.get('/:id/edit', isAuthenticated, (req, res) => {
	Model.findById(req.params.id, (err, foundModel) => {
		res.render('model/edit.ejs', {
			variableName: foundModel,
			currentUser: req.session.currentUser
		});
	});
});

// app.get('/campgrounds/:id/edit', async (req, res) => {
// 	const { id } = req.params;
// 	const campground = await Campground.findById(id);
// 	res.render('campgrounds/edit', { campground });
// });

// UPDATE
model.put('/:id', (req, res) => {
	Model.findByIdAndUpdate(
		req.params.id,
		req.body,
		{ new: true },
		(err, updatedModel) => {
			res.redirect('/model');
		}
	);
});

// app.put('/campgrounds/:id', async (req, res) => {
// 	const { id } = req.params;
// 	const campground = await Campground.findByIdAndUpdate(id, {
// 		...req.body.campground
// 	});
// 	res.redirect(`/campgrounds/${campground._id}`);
// });

// DELETE
model.delete('/:id', (req, res) => {
	Model.findByIdAndRemove(req.params.id, (err, deletedModel) => {
		res.redirect('/model');
	});
});

// app.delete('/campgrounds/:id', async (req, res) => {
// 	const { id } = req.params;
// 	await Campground.findByIdAndDelete(id);
// 	res.redirect('/campgrounds');
// });

module.exports = model;
