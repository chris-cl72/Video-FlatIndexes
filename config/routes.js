var path = require('path');
//var http = require('follow-redirects').http;
//var modRewrite = require('connect-modrewrite');

module.exports = function(app, express, passport) {
    var path =__dirname + '/../app/controllers';

    app.get('/Videos', function(req, res) {
        callController('Videos.js')(app, req, res);
	log(app, req, res);
    });

    app.get('/Videos/logout', function(req, res) {
	callController('userauth.js').logout(app, req, res);
	log(app, req, res);
    });

    app.post('/Videos/search', function(req, res) {
        callController('Videos.js')(app, req, res);
	log(app, req, res);
    });

    app.post('/Videos/login', function (req, res){
	callController('userauth.js').login(app, req, res);
	log(app, req, res);
    });

    app.use(function(req, res, next) {
	if( req.path === '/Videos/perso' ) {
		if( callController('userauth.js').is_granted(app, req, res) )
			callController('Videos.perso.js')(app, req, res);
		else
			res.redirect('/Videos');
        	log(app, req, res);
	}
	else
		next();
    });

    app.use(function (req, res, next){ res.statusCode = 404; log(app, req, res)});
};

function callController(name) {
        var path =__dirname + '/../app/controllers';
        return require(path + '/' + name); //(app, req, res);
};

function log(app, req, res )
{
        console.log("%s %s %s %s",req.method,req.url,res.statusCode,req.ip );
};

