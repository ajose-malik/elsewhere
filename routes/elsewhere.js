const express = require('express');
const elsewhere = express.Router();
const Elsewhere = require('../models/elsewhere');

elsewhere.get('/', (req, res) => {
	res.render();
});
