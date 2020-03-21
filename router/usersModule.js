const bcrypt = require('bcryptjs');
const db = require('../data/knexConfig');

function find() {
	return db('users').select('*');
}

function findBy(filter) {
	return db('users').select('id', 'username', 'password', 'departments').where(filter);
}

function findName(username) {
	return db('users').select('*');
}

async function insert(user) {
	user.password = await bcrypt.hash(user.password, 14);
	return db('users').insert(user).where('departments', 'B');
}

module.exports = {
    find,
    findBy,
	findName,
	insert
};
