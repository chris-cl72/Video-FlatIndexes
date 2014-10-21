var path = require('path');
//var http = require('follow-redirects').http;
//var modRewrite = require('connect-modrewrite');

module.exports = function(app, express, passport) {
    var path =__dirname + '/../app/controllers';
    //var users = app.get('users');
    //var groups = app.get('groups');
    //var http = require('follow-redirects').http;
    //var startTime = new Date().getTime();

   // var modRewrite = require('connect-modrewrite');

    //app.use(modRewrite([ '^/$ /Videos', '^$ /Videos [L]']));


    /*app.get('/favicon.ico', function (req, res) {
	res.redirect('/favicon.ico');	
	//var img = fs.readFileSync('./favicon.ico');
	//response.writeHead(200, {"Content-Type": "image/x-icon"});
	//response.end(img,'binary');
	log(app, req, res);
	});*/

    app.get('/Videos', function(req, res) {
        callController('Videos.js')(app, req, res);
	log(app, req, res);
    });

    app.get('/Videos/logout', function(req, res) {
	callController('user.js').Disconnect(req, res);
	log(app, req, res);
    });

    app.post('/search', function(req, res) {
        callController('Videos.js')(app, req, res);
	log(app, req, res);
    });

    app.post('/Videos/login', function (req, res){
	callController('user.js').Connect(app,req, res);
	log(app, req, res);
    });

    app.get('/Videos/perso', function(req, res) {
        if( callController('user.js').VerifyRoutes(app, req) )
		callController('Videos.js')(app, req, res);
	else
		callController('Videos.js')(app, req, res);
        log(app, req, res);
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



