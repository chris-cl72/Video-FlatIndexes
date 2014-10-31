module.exports = function(app, express) {
	app.set('port', process.env.PORT || 80);
	var users = [
	{ id: 2, username: 'test', password: 'test', email: 'test@example.com', inroles: [ 'ROLE_GUEST','ROLE_ADMIN' ], config: { mode: 'clear' } }
	];

	var roles = [
	{ name: 'ROLE_ADMIN', routes: [ '/Videos/*' ] },
	{ name: 'ROLE_GUEST', routes: [ '/Videos/perso' ] }
	];

	app.set('users', users);
	app.set('roles', roles);
};
