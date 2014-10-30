module.exports = function(app, express) {
	app.set('port', process.env.PORT || 80);
	var users = [
	{ id: 2, username: 'test', password: 'test', email: 'test@example.com', ingroups: [ 'guest','admin' ], config: { mode: 'clear' } }
	];

	var groups = [
	{ name: 'admin', routes: [ '/Videos/*' ] },
	{ name: 'guest', routes: [ '/Videos/perso' ] }
	];

	app.set('users', users);
	app.set('groups', groups);
};
