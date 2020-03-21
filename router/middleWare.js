const db = require('./usersModule');
const jwt = require('jsonwebtoken');

async function validateUserName(req, res, next) {
	const database = await db.findName();
	const names = database.map((name) => {
		return name.username;
	});
	if (names.includes(req.body.username)) {
		res.status(409).json({ message: 'Sorry, this username is already taken.' });
	}
	else {
		next();
	}
}

function validateUserData(req, res, next) {
	const { username, password } = req.body;
	if (!username || !password) {
		res.status(400).json({ message: 'please provide username and password.' });
	}
	next();
}

function restrict() {
	const authError = {
		message: 'Invalid credentials'
	};
	return async (req, res, next) => {
		try {
			const token = req.cookies.token;

			if (!token) {
				return res.status(401).json(authError);
			}

			jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
				if (err) {
					return res.status(401).json(authError);
				}
				req.token = decoded;

				next();
			});
		} catch (err) {
			next(err);
		}
	};
}

function restrictAccess(department) {
	return (req, res, next) => {
		if (req.token && req.token.department === department) {
			next();
		}
		else {
			res.status(403).json({ message: 'You are not allowed here.' });
		}
	};
}

module.exports = {
	validateUserData,
	validateUserName,
	restrict,
	restrictAccess
};
