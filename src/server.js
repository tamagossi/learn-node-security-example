require('dotenv').config();

const express = require('express');
const helmet = require('helmet');
const passport = require('passport');
const session = require('express-session');
const { Strategy } = require('passport-google-oauth20');

const routes = require('./routes');
const { PASSPORT_OPTIONS, CONFIG, PORT } = require('./configs');

const app = express();

passport.use(new Strategy(PASSPORT_OPTIONS, verifyCallback));
passport.serializeUser((user, done) => {
	done(null, user.id);
});
passport.deserializeUser((id, done) => {
	done(null, id);
});

app.use(helmet());
app.use(
	session({
		cookie: { secure: true },
		resave: true,
		saveUninitialized: true,
		secret: [CONFIG.COOKIE_KEY_1, CONFIG.COOKIE_KEY_2],
	})
);
app.use(passport.initialize());
app.use(passport.session());
app.use(routes);

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
