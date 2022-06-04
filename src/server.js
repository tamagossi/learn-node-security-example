require('dotenv').config();

const cookieSession = require('cookie-session');
const express = require('express');
const helmet = require('helmet');
const passport = require('passport');
const path = require('path');

const { Strategy } = require('passport-google-oauth20');

const config = {
	CLIENT_ID: process.env.CLIENT_ID,
	GOOGLE_OAUTH_CLIENT_SECRET: process.env.GOOGLE_OAUTH_CLIENT_SECRET,
	COOKIE_KEY_1: process.env.COOKIE_KEY_1,
	COOKIE_KEY_2: process.env.COOKIE_KEY_2,
};

const PORT = process.env.PORT;
const PASSPORT_OPTIONS = {
	callbackURL: '/auth/google/callback',
	clientID: config.CLIENT_ID,
	clientSecret: config.GOOGLE_OAUTH_CLIENT_SECRET,
};

passport.use(new Strategy(PASSPORT_OPTIONS, verifyCallback));
passport.serializeUser((user, done) => {
	done(null, user.id);
});
passport.deserializeUser((id, done) => {
	done(null, id);
});

const app = express();
app.use(helmet());

app.use(
	cookieSession({
		name: 'session',
		maxAge: 1000 * 60 * 60 * 24,
		keys: [config.COOKIE_KEY_1, config.COOKIE_KEY_2],
	})
);
app.use(passport.initialize());
app.use(passport.session());

function checkIfUserLoggedIn(_, res, next) {
	// TODO
	const isLoggedIn = true;

	if (!isLoggedIn) {
		return res.status(401).json({
			error: 'You must log in!',
		});
	}

	next();
}

function verifyCallback(accessToken, refreshToken, profile, done) {
	console.log('Google profile', profile);
	done(null, profile);
}

app.get(
	'/auth/google',
	passport.authenticate('google', {
		scope: ['email'],
	})
);

app.get(
	'/auth/google/callback',
	passport.authenticate('google', {
		failureRedirect: '/failure',
		sucessRedirect: '/',
	}),
	() => {
		console.log('Google called us back');
	}
);

app.get('/auth/logout', () => {});

app.get('/failure', (_, res) => {
	return res.send('Fail to login');
});

app.get('/secret', checkIfUserLoggedIn, (_, res) => {
	return res.send('Your personal secret value is 42');
});

app.get('/', (_, res) => {
	res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// script to generate new ssl
// openssl req -x509 -newkey rsa:4096 -nodes -keyout key.pem -out cert.pem -days 365

// https
// .createServer(
// 	{
// 		key: fs.readFileSync('../key.pem'),
// 		cert: fs.readFileSync('../cert.pem'),
// 	},
// 	app
// )
// .listen(PORT, () => {
// 	console.log(`---- Listening to port ${PORT} ----`);
// });

app.listen(PORT, () => {
	console.log(`---- Listening to port ${PORT} ----`);
});
