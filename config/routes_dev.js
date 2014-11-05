module.exports = function(app, express, passport) {
	return require(__dirname + '/routes.js')(app, express);
	};
