const express = require('express');

const authRouter = require('./auth.router');
const { checkIfUserLoggedIn } = require('../middlewares');

const router = express.Router();

router.use('/auth', authRouter);

router.get('/failure', (_, res) => {
	return res.send('Fail to login');
});

router.get('/secret', checkIfUserLoggedIn, (_, res) => {
	return res.send('Your personal secret value is 42');
});

router.get('/', (_, res) => {
	res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

module.exports = router;
