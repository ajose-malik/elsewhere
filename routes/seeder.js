const express = require('express');
const seeder = express.Router();
const faker = require('faker/locale/en_US');
const User = require('../models/user');
const cities = require('../seeds/cities');

require('dotenv').config();
const { SEEDER } = process.env;

seeder.get(`/${SEEDER}`, async (req, res) => {
	await User.deleteMany({});
	for (let i = 0; i < 5; i++) {
		const name = faker.name.findName();
		const randNum = Math.floor(Math.random() * (name.length - 3) + 3);
		const username = name.substring(0, randNum).split(' ').join('_');
		const password = faker.internet.password();

		const user = new User({
			name,
			username,
			password
		});
		await user.save();
	}
	res.send('seeded Many');
});

module.exports = seeder;
