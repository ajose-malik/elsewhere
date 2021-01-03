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
	// await User.deleteMany({});
	// await Elsewhere.deleteMany({});
	// await Rating.deleteMany({});
	// await Image.deleteMany({});

	for (let i = 0; i < 5; i++) {
		// const randNum = Math.floor(Math.random() * (6, 10) + 6);
		const randGen = Math.floor(Math.random() * cities.length);
		// const username = faker.name
		// 	.findName()
		// 	.substring(0, randNum)
		// 	.split(' ')
		// 	.join('_');
		// const password = faker.internet.password();

		// const user = new User({
		// 	username: 'popo',
		// 	password: 'popopo',
		// 	quin: 10
		// });
		// await user.save();

		// const rating = new Rating({
		// 	star: Math.floor(Math.random() * 5) + 1,
		// 	patron: user
		// });
		// await rating.save();

		const image = new Image({
			url: faker.image.image(),
			filename: faker.lorem.word()
		});
		await image.save();

		const elsewhere = new Elsewhere({
			author: '5ff152a30a8b135208e0cec1',
			location: `${cities[randGen].city}, ${cities[randGen].state}`,
			title: faker.lorem.word(),
			description: faker.lorem.paragraph(),
			quin: Math.floor(Math.random() * 10) + 1,
			// rating,
			image: [image]
		});

		await elsewhere.save();
	}
	res.send('seeded!!!');
});

module.exports = seedRouter;
