const express = require('express');
const seedRouter = express.Router();
const faker = require('faker/locale/en_US');
const Elsewhere = require('../models/elsewhere');
const cities = require('../seeds/cities');

const { SEEDER } = process.env;

seedRouter.get(`/${SEEDER}`, async (req, res) => {
	const imageUrl = [
		'https://images.unsplash.com/photo-1554210543-9cb0b8dd6b4c?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=1050&q=80',
		'https://images.unsplash.com/photo-1444492417251-9c84a5fa18e0?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=675&q=80',
		'https://images.unsplash.com/photo-1445108771252-d1cc31a02a3c?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=633&q=80',
		'https://images.unsplash.com/photo-1443397646383-16272048780e?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=967&q=80',
		'https://images.unsplash.com/photo-1420582282039-a6d11404cb66?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=1050&q=80',
		'https://images.unsplash.com/photo-1501601962015-7f11b4445c43?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=1051&q=80',
		'https://images.unsplash.com/photo-1543039625-14cbd3802e7d?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=1053&q=80',
		'https://images.unsplash.com/photo-1542176281-363d7e8c1c04?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=1050&q=80',
		'https://images.unsplash.com/photo-1502394202744-021cfbb17454?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=1178&q=80',
		'https://images.unsplash.com/photo-1536257104079-aa99c6460a5a?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=1050&q=80',
		'https://images.unsplash.com/photo-1474770447574-779d47496484?ixid=MXwxMjA3fDB8MHxzZWFyY2h8MjJ8fG91dGRvb3J8ZW58MHx8MHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60',
		'https://images.unsplash.com/photo-1447752875215-b2761acb3c5d?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=1050&q=80',
		'https://images.unsplash.com/photo-1500785685164-2ed63ba5d58d?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=1050&q=80',
		'https://images.unsplash.com/photo-1528364226066-ec76a960030b?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=1020&q=80',
		'https://images.unsplash.com/photo-1418848332263-19d727490583?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=1050&q=80',
		'https://images.unsplash.com/photo-1533627617206-0d71da554e5a?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=1050&q=80',
		'https://images.unsplash.com/photo-1536258426657-fabb174a2bbf?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=1189&q=80',
		'https://images.unsplash.com/photo-1507120624096-2a019a71c96b?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=1051&q=80',
		'https://images.unsplash.com/photo-1473912869254-939dd24ddb2f?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=970&q=80',
		'https://images.unsplash.com/photo-1464867037750-e4ebec103b42?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=1050&q=80',
		'https://images.unsplash.com/photo-1542746938-29a167e3d23e?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=967&q=80',
		'https://images.unsplash.com/photo-1543164444-fb99c60ca57f?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=1050&q=80',
		'https://images.unsplash.com/photo-1541296604437-8cb5efd2da96?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=1091&q=80',
		'https://images.unsplash.com/photo-1509003326543-a88201f32ea4?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=1050&q=80',
		'https://images.unsplash.com/photo-1542458794-f1b1407afaf3?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=1034&q=80',
		'https://images.unsplash.com/photo-1520065523881-5f47d91a9353?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=1050&q=80',
		'https://images.unsplash.com/photo-1543318557-a11bce6e033a?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=1055&q=80',
		'https://images.unsplash.com/photo-1517526713610-db75938f6986?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=1050&q=80',
		'https://images.unsplash.com/photo-1542292539874-a0f37e418b47?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=1050&q=80',
		'https://images.unsplash.com/photo-1520220543854-138736ffc914?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=1052&q=80',
		'https://images.unsplash.com/photo-1520897181648-5819978c62ba?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=1050&q=80',
		'https://images.unsplash.com/photo-1529288799438-25806759b34e?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=1050&q=80',
		'https://images.unsplash.com/photo-1531214273921-f62327a9a822?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=1049&q=80',
		'https://images.unsplash.com/photo-1447715285989-eab551e62674?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=1052&q=80',
		'https://images.unsplash.com/photo-1517751243320-0cc45ec82da7?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=1050&q=80',
		'https://images.unsplash.com/photo-1524780236126-c6858d4a8cf2?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=1050&q=80',
		'https://images.unsplash.com/photo-1529942229782-93e1f46bf18b?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=1050&q=80',
		'https://images.unsplash.com/photo-1502147704994-6bfb9b28d71d?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=1050&q=80',
		'https://images.unsplash.com/photo-1541420937988-702d78cb9fa1?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=1050&q=80',
		'https://images.unsplash.com/photo-1542339037-68f3d1818001?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=1050&q=80',
		'https://images.unsplash.com/photo-1530922138286-ec42589e579a?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=989&q=80',
		'https://images.unsplash.com/photo-1520878475816-3e161ac64c3e?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=1050&q=80',
		'https://images.unsplash.com/photo-1519284053930-16dfacdc7c98?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=1050&q=80',
		'https://images.unsplash.com/photo-1519276514856-c798c96f9154?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=1050&q=80',
		'https://images.unsplash.com/photo-1534477466026-28c182f0157f?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=1029&q=80',
		'https://images.unsplash.com/photo-1525863267585-0fab58062fa0?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=1074&q=80',
		'https://images.unsplash.com/photo-1508794092848-50ecd51b8948?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=1050&q=80',
		'https://images.unsplash.com/photo-1536610912992-d8332299f3ac?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=1050&q=80',
		'https://images.unsplash.com/photo-1536006234772-8b530b179f5a?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=1050&q=80',
		'https://images.unsplash.com/photo-1520596880803-6ea0113a42d1?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=1050&q=80',
		'https://images.unsplash.com/photo-1534099635511-8bb701f5f602?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=1051&q=80',
		'https://images.unsplash.com/photo-1521054685235-66f191ba3ab1?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=1050&q=80'
	];

	for (let i = 0; i < 100; i++) {
		const randGen = Math.floor(Math.random() * cities.length);
		const randUrl = Math.floor(Math.random() * imageUrl.length);
		const randUrl1 = Math.floor(Math.random() * imageUrl.length);
		const randUrl2 = Math.floor(Math.random() * imageUrl.length);
		const randUrl3 = Math.floor(Math.random() * imageUrl.length);
		const randUrl4 = Math.floor(Math.random() * imageUrl.length);
		const randUrl5 = Math.floor(Math.random() * imageUrl.length);

		const url = imageUrl[randUrl];
		const url1 = imageUrl[randUrl1];
		const url2 = imageUrl[randUrl2];
		const url3 = imageUrl[randUrl3];
		const url4 = imageUrl[randUrl4];
		const url5 = imageUrl[randUrl5];

		const elsewhere = new Elsewhere({
			author: '6006500ce43fb13bcf4310ce',
			location: `${cities[randGen].city}`,
			title: faker.lorem.word(),
			description: faker.lorem.paragraph(),
			image: [
				{
					url,
					filename: `Elsewhere/${faker.lorem.word()}`
				},
				{
					url: url1,
					filename: `Elsewhere/${faker.lorem.word()}`
				},
				{
					url: url2,
					filename: `Elsewhere/${faker.lorem.word()}`
				},
				{
					url: url3,
					filename: `Elsewhere/${faker.lorem.word()}`
				},
				{
					url: url4,
					filename: `Elsewhere/${faker.lorem.word()}`
				},
				{
					url: url5,
					filename: `Elsewhere/${faker.lorem.word()}`
				}
			],
			geometry: {
				type: 'Point',
				coordinates: [cities[randGen].longitude, cities[randGen].latitude]
			}
		});

		await elsewhere.save();
	}
	res.send('seeded!!!');
});

module.exports = seedRouter;
