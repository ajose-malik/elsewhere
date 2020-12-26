const express = require('express');
const methodOverride = require('method-override');
const ejsMate = require('ejs-mate');
const mongoose = require('mongoose');
const session = require('express-session');
const flash = require('connect-flash');

const app = express();

require('dotenv').config();
const PORT = process.env.PORT || 3003;
const MONGODB_URI = process.env.MONGODB_URI;

const modelController = require('./controllers/model');
const userController = require('./controllers/user');
const sessionController = require('./controllers/session');

app.engine('ejs', ejsMate);
app.set('view engine', 'ejs');

app.use('/model', modelController);
app.use('/user', userController);
app.use('/session', sessionController);
app.use(express.static('public'));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(methodOverride('_method'));
app.use((req, res, next) => {
	res.locals.messages = req.flash(message);
	next();
});
app.use((err, req, res, next) => {
	const { status = 500, message = 'Something went wrong' } = err;
	res.status(status).render('error', { err });
});
app.use(
	session({
		secret: process.env.SECRET,
		resave: false,
		saveUninitialized: false,
		cookie: {
			httpOnly: true,
			expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
			maxAge: 1000 * 60 * 60 * 24 * 7
		}
	})
);

mongoose
	.connect(MONGODB_URI, {
		useNewUrlParser: true,
		useCreateIndex: true,
		useUnifiedTopology: true,
		useFindAndModify: false
	})
	.then(() => console.log('STARTED MONGODB'))
	.catch(e => console.log('DISASTER\n', e));

app.listen(PORT, () => console.log('STARTED PORT:', PORT));
