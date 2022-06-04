require('dotenv').config();

const cookieSession = require('cookie-session');
const express = require('express');
const helmet = require('helmet');
const passport = require('passport');
const path = require('path');
const { Strategy } = require('passport-google-oauth20');

const router = require('./routes');
const { PASSPORT_OPTIONS, CONFIG, PORT } = require('./configs');

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
		keys: [CONFIG.COOKIE_KEY_1, CONFIG.COOKIE_KEY_2],
	})
);
app.use(passport.initialize());
app.use(passport.session());
app.use(router);

function verifyCallback(accessToken, refreshToken, profile, done) {
	console.log('Google profile', profile);
	done(null, profile);
}

app.listen(PORT, () => {
	console.log(`---- Listening to port ${PORT} ----`);
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
