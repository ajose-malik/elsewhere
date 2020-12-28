const express = require('express');
const methodOverride = require('method-override');
const ejsMate = require('ejs-mate');
const mongoose = require('mongoose');
const session = require('express-session');
const flash = require('connect-flash');

const app = express();

require('dotenv').config();
const { PORT } = process.env || 3003;
const { MONGODB_URI } = process.env;

mongoose
	.connect(MONGODB_URI, {
		useNewUrlParser: true,
		useCreateIndex: true,
		useUnifiedTopology: true,
		useFindAndModify: false
	})
	.then(() => console.log('STARTED MONGODB'))
	.catch(e => console.log('DISASTER\n', e));

// const elsewhereRoute = require('./routes/elsewhere');
// const userRoute = require('./routes/user');
const seederRoute = require('./routes/seeder');

app.engine('ejs', ejsMate);
app.set('view engine', 'ejs');

// app.use('/elsewhere', elsewhereRoute);
// app.use('/user', userRoute);
app.use('/seeder', seederRoute);
app.use(express.static('public'));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(methodOverride('_method'));

app.use(
	session({
		secret: process.env.SECRET,
		resave: false,
		saveUninitialized: false,
		cookie: {
			name: 'harlequin shrimp',
			// secure: true,
			httpOnly: true,
			expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
			maxAge: 1000 * 60 * 60 * 24 * 7
		}
	})
);

app.get('/', (req, res) => {
	res.render('home');
});

app.listen(PORT, () => console.log('STARTED PORT:', PORT));
