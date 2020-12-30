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
	await User.deleteMany({});
	await Elsewhere.deleteMany({});
	await Rating.deleteMany({});
	await Image.deleteMany({});
	// for (let i = 0; i < 5; i++) {
	const name = faker.name.findName();
	const randNum = Math.floor(Math.random() * (name.length - 3) + 3);
	const randGen = Math.floor(Math.random() * cities.length);
	const username = name.substring(0, randNum).split(' ').join('_');
	const password = faker.internet.password();

	const user = new User({
		name,
		username,
		password
	});
	await user.save();

	const rating = new Rating({
		rating: Math.floor(Math.random() * 5) + 1,
		author: user
	});
	await rating.save();

	const image = new Image({
		url: faker.image.image(),
		filename: faker.lorem.word()
	});
	await image.save();

	const elsewhere = new Elsewhere({
		author: user,
		location: `${cities[randGen].city}, ${cities[randGen].state}`,
		title: faker.lorem.word(),
		description: faker.lorem.paragraph(),
		cost: Math.floor(Math.random() * 10) + 1,
		rating,
		image: [image]
	});

	await elsewhere.save();
	// }
	res.send('seeded!!!');
});

module.exports = seedRouter;
