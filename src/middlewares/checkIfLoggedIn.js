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

module.exports = checkIfUserLoggedIn;
