const express = require('express');
const Model = require('../models/model.js');
const catchAsync = require('./utilities/catchAsync');
const validate = require('../utilities/validate');
const model = express.Router();

// {mergeParams: true}??? for express.Router???

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

app.get(
	'/campgrounds',
	validate,
	catchAsync(async (req, res, next) => {
		const campgrounds = await Campground.find({});
		res.render('campgrounds/index', { campgrounds });
	})
);

// NEW
model.get('/new', (req, res) => {
	res.render('model/new.ejs', { currentUser: req.session.currentUser });
});

// CREATE
model.post('/', (req, res) => {
	Model.create(req.body, (err, createdModel) => {
		res.redirect('/model');
	});
});

// app.post('/campgrounds', async (req, res, next) => {
// 	try {
// const campground = new Campground(req.body.campground);
// 		await campground.save();
// 		res.redirect(`/campgrounds/${campground._id}`);
// 	} catch (err) {
// 		next(err);
// 	}
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

// app.get('/campgrounds/:id', async (req, res, next) => {
// 	try {
// 		const { id } = req.params;
// 		const campground = await Campground.findById(id);
// 		res.render('campgrounds/show', { campground });
// 	} catch (err) {
// 		next(err);
// 	}
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

// app.get('/campgrounds/:id/edit', async (req, res, next) => {
// 	try {
// 		const { id } = req.params;
// 		const campground = await Campground.findById(id);
// 		res.render('campgrounds/edit', { campground });
// 	} catch (err) {
// 		next(err);
// 	}
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

// app.put('/campgrounds/:id', async (req, res, next) => {
// 	try {
// 		const { id } = req.params;
// 		const campground = await Campground.findByIdAndUpdate(id, {
// 			...req.body.campground
// 		});
// 		res.redirect(`/campgrounds/${campground._id}`);
// 	} catch (err) {
// 		next(err);
// 	}
// });

// DELETE
model.delete('/:id', (req, res) => {
	Model.findByIdAndRemove(req.params.id, (err, deletedModel) => {
		res.redirect('/model');
	});
});

app.delete('/campgrounds/:id', async (req, res, next) => {
	try {
		const { id } = req.params;
		await Campground.findByIdAndDelete(id);
		res.redirect('/campgrounds');
	} catch (err) {
		next(err);
	}
});

module.exports = model;
