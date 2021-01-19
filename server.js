// Required ///////////////////////////////////////////////////////////////////////
require('dotenv').config();
const express = require('express');
const methodOverride = require('method-override');
const ejsMate = require('ejs-mate');
const mongoose = require('mongoose');
const session = require('express-session');
const flash = require('connect-flash');
const elseRouter = require('./controllers/elsewhere');
const seedRouter = require('./controllers/seeder');
const userRouter = require('./controllers/user');
const catchAsync = require('./utils/catch-async');
const { renderHome } = require('./utils/middleware');

// Config /////////////////////////////////////////////////////////////////////////
const app = express();
const { PORT } = process.env || 3003;
const { MONGODB_URI } = process.env;
const secret = process.env.SECRET;

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

// Middleware + Engine /////////////////////////////////////////////////////////////
app.engine('ejs', ejsMate);
app.set('view engine', 'ejs');
app.use(express.static('public'));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(methodOverride('_method'));
app.use(
	session({
		name: 'Mandarin duck',
		secret,
		resave: false,
		saveUninitialized: false,
		cookie: {
			httpOnly: true,
			// secure: true,
			expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
			maxAge: 1000 * 60 * 60 * 24 * 7
		}
	})
);
app.use(flash());
app.use((req, res, next) => {
	res.locals.message = req.flash('message');
	res.locals.error = req.flash('error');
	next();
});

// Routers ///////////////////////////////////////////////////////////////////////////////
app.use('/elsewhere', elseRouter);
app.use('/seeder', seedRouter);
app.use('/user', userRouter);

// Home route ////////////////////////////////////////////////////////////////////////
app.get('/', catchAsync(renderHome));

// Catch Async Error ////////////////////////////////////////////////////////
app.use((err, req, res, next) => {
	if (err.message.includes('elsewheres is not defined')) {
		res.redirect('/');
	} else {
		const { statusCode = 500, message = 'Something went wrong!' } = err;
		req.flash('error', message);
		res.status(statusCode).redirect('/');
	}
});
