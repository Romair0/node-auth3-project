const express = require('express');
const router = express();
const jwt = require('jsonwebtoken');
const db = require('./usersModule');
const dba = require('../data/knexConfig');
const bcrypt = require('bcryptjs');
const { validateUserData, validateUserName,restrict,restrictAccess } = require('./middleWare');

router.post('/register/admin', validateUserData, validateUserName, async (req, res, next) => {
	try {
		const data = {
			username: req.body.username,
			password: req.body.password,
			departments: 'A'
		};
		await db.insert(data);
		res.json({ message: `Congrats ,you have been registered ${data.username}!` });
	} catch (err) {
		next(err);
	}
});

router.post('/register/user', validateUserData, validateUserName, async (req, res, next) => {
	try {
		const data = {
			username: req.body.username,
			password: req.body.password,
			departments: 'B'
		};
		await db.insert(data);
		res.json({ message: `Congrats ,you are registered ${data.username}!` });
	} catch (err) {
		next(err);
	}
});

router.post('/login', async (req, res, next) => {
	const credentials = req.body;
	try {
		const user = await dba('users').select('*').where('users.username', credentials.username).first();

		if (!user || !bcrypt.compareSync(credentials.password, user.password)) {
			return res.status(401).json({ message: 'Invalid Credentials' });
		}

		const payload = {
			userId: user.id,
			department: user.departments
		};

		const token = jwt.sign(payload, process.env.JWT_SECRET);
		res.cookie("token",token)
		res.json({
			message: `Welcome ${user.username}`
		});
	} catch (err) {
		console.log(err);
		next();
	}
});

router.get('/users',restrict(),restrictAccess("A"), async (req, res, next) => {
	try {
		const users = await db.find();
		res.json(users);
	} catch (err) {
		next(err);
	}
});

module.exports = router;
