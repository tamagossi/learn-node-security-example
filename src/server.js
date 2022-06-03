require('dotenv').config();
const express = require('express');
const fs = require('fs');
const helmet = require('helmet');
const https = require('https');
const path = require('path');

const PORT = process.env.PORT;
const app = express();

app.use(helmet());

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

app.get('/auth/google', (req, res) => {});

app.get('/auth/google/callback', (req, res) => {});

app.get('/auth/logout', (req, res) => {});

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
