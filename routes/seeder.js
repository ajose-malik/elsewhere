const express = require('express');
const seedRouter = express.Router();
const faker = require('faker/locale/en_US');
const User = require('../models/user');
const Image = require('../models/image');
const Rating = require('../models/rating');
const Elsewhere = require('../models/elsewhere');
const cities = require('../seeds/cities');

require('dotenv').config();
const { SEEDER } = process.env;

seedRouter.get(`/${SEEDER}`, async (req, res) => {
	for (let i = 0; i < 5; i++) {
		const randGen = Math.floor(Math.random() * cities.length);

		const image = new Image({
			url: faker.image.image(),
			filename: faker.lorem.word()
		});
		await image.save();

		const elsewhere = new Elsewhere({
			author: '5ff248f4ae987b1e1e956678',
			location: `${cities[randGen].city}, ${cities[randGen].state}`,
			title: faker.lorem.word(),
			description: faker.lorem.paragraph(),
			quin: Math.floor(Math.random() * 10) + 1,
			image: [image]
		});

		await elsewhere.save();
	}
	res.send('seeded!!!');
});

module.exports = seedRouter;
