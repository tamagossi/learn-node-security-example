const CONFIG = {
	CLIENT_ID: process.env.CLIENT_ID,
	GOOGLE_OAUTH_CLIENT_SECRET: process.env.GOOGLE_OAUTH_CLIENT_SECRET,
	COOKIE_KEY_1: process.env.COOKIE_KEY_1,
	COOKIE_KEY_2: process.env.COOKIE_KEY_2,
};

const PASSPORT_OPTIONS = {
	callbackURL: '/auth/google/callback',
	clientID: CONFIG.CLIENT_ID,
	clientSecret: CONFIG.GOOGLE_OAUTH_CLIENT_SECRET,
};

const PORT = process.env.PORT;

module.exports = {
	PASSPORT_OPTIONS,
	CONFIG,
	PORT,
};
