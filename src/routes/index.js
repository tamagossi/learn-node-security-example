const express = require('express');
const path = require('path');

const authRouter = require('./auth.router');
const { checkIfUserLoggedIn } = require('../middlewares');

const routes = express.Router();

routes.use('/auth', authRouter);

routes.get('/failure', (_, res) => {
	return res.send('Fail to login');
});

routes.get('/secret', checkIfUserLoggedIn, (_, res) => {
	return res.send('Your personal secret value is 42');
});

routes.get('/', (_, res) => {
	res.sendFile(path.join(__dirname, '../public', 'index.html'));
});

module.exports = routes;
