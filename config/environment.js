var errorhandler = require('errorhandler');

module.exports = function(app, express) {
    switch(process.env.NODE_ENV){
        case 'development':
		//express.errorHandler({ dumpExceptions: true, showStack: true });
		app.use(errorhandler({ dumpExceptions: true, showStack: true }));
		require('./routes_dev.js')(app, express);
        case 'production':
		require('./routes.js')(app, express);
        default:
    		require('./routes.js')(app, express);
	}
};
