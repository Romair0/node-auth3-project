exports.seed =async function(knex) {
	// Deletes ALL existing entries
	await knex('users').del().then(function() {
		// Inserts seed entries
		return knex('users').insert([
			{ id: 1, username: 'Ramy',password:"Ramy123", departments:"A"},
			{ id: 2, username: 'Samer',password:"Samer123", departments:"B" },
			{ id: 3, username: 'Mark',password:"Mark123", departments:"B" }
		]);
	});
};
