module.exports = function(app, express) {
	app.set('port', process.env.PORT || 80);
	var users = [
	{ id: 1, username: 'chris', password: '853686c9ec7291cc36d548028a23dc1f24e9802c', email: 'chris@example.com', ingroups: [ 'admin','guest' ], config: { mode: 'crypt' } },
	{ id: 2, username: 'nana', password: 'nana72', email: 'nana@example.com', ingroups: [ 'guest' ], config: { mode: 'clear' } }
	];

	var groups = [
	{ name: 'admin', routes: [ '/Videos/*' ] },
	{ name: 'guest', routes: [ '/Videos/perso' ] }
	];

	app.set('users', users);
	app.set('groups', groups);
};
