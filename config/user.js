module.exports = function(app, express) {
	app.set('port', process.env.PORT || 80);
	var users = [
	{ id: 1, username: 'chris', password: 'chris72', email: 'chris@example.com', ingroups: [ 'admin','guest' ] },
	{ id: 2, username: 'nana', password: 'nana72', email: 'nana@example.com', ingroups: [ 'guest' ] }
	];

	var groups = [
	{ name: 'admin', routes: [ '/Videos/*' ] },
	{ name: 'guest', routes: [ '/Videos/perso' ] }
	];

	app.set('users', users);
	app.set('groups', groups);
};
