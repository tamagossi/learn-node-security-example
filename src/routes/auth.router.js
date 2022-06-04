const express = require('express');
const passport = require('passport/lib');

const authRouter = express.Router();

authRouter.get(
	'/google',
	passport.authenticate('google', {
		scope: ['email'],
	})
);

authRouter.get(
	'/google/callback',
	passport.authenticate('google', {
		failureRedirect: '/failure',
		sucessRedirect: '/',
	}),
	() => {
		console.log('Google called us back');
	}
);

authRouter.get('/auth/logout', () => {});

module.exports = authRouter;
