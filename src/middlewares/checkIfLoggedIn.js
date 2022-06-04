function checkIfUserLoggedIn(req, res, next) {
	const isLoggedIn = req.isAuthenticated() && req.user;

	if (!isLoggedIn) {
		return res.status(401).json({
			error: 'You must log in!',
		});
	}
	next();
}

module.exports = checkIfUserLoggedIn;
