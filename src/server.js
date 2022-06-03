require('dotenv').config();
const express = require('express');
const fs = require('fs');
const helmet = require('helmet');
const https = require('https');
const path = require('path');
const passport = require('passport');
const { Strategy } = require('passport-google-oauth20');

const config = {
	CLIENT_ID: process.env.CLIENT_ID,
	GOOGLE_OAUTH_CLIENT_SECRET: process.env.GOOGLE_OAUTH_CLIENT_SECRET,
};

const PORT = process.env.PORT;
const PASSPORT_OPTIONS = {
	callbackURL: '/auth/google/callback',
	clientID: config.CLIENT_ID,
	clientSecret: config.GOOGLE_OAUTH_CLIENT_SECRET,
};

passport.use(new Strategy(PASSPORT_OPTIONS, verifyCallback));

const app = express();
app.use(helmet());
app.use(passport.initialize());

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

app.get('/auth/google', passport.authenticate('google'), {
	scope: ['email'],
});

app.get(
	'/auth/google/callback',
	passport.authenticate('google'),
	{
		failureRedirect: '/failure',
		sucessRedirect: '/',
		session: false,
	},
	(req, res) => {
		console.log('Google called us back');
	}
);

app.get('/auth/logout', (req, res) => {});

app.get('/failuer', (_, res) => {
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

https
	.createServer(
		{
			key: fs.readFileSync('../key.pem'),
			cert: fs.readFileSync('../cert.pem'),
		},
		app
	)
	.listen(PORT, () => {
		console.log(`---- Listening to port ${PORT} ----`);
	});
