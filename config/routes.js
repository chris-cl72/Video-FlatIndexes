var path = require('path');
var url = require('url');
//var http = require('follow-redirects').http;
//var modRewrite = require('connect-modrewrite');



function sleep(milliseconds) {
  var start = new Date().getTime();
  for (var i = 0; i < 1e7; i++) {
    if ((new Date().getTime() - start) > milliseconds){
      break;
    }
  }
}


module.exports = function(app, express, passport) {
    var path =__dirname + '/../app/controllers';

    app.get('/Videos', function(req, res) {
        callController('Videos.js').accueil(app, req, res);
	log(app, req, res);
    });

    app.get('/Videos/logout', function(req, res) {
	callController('userauth.js').logout(app, req, res);
	log(app, req, res);
    });

    app.post('/Videos/search', function(req, res) {
        callController('Videos.js').search(app, req, res);
	log(app, req, res);
    });

    app.post('/Videos/login', function (req, res){
	callController('userauth.js').login(app, req, res);
	log(app, req, res);
    });

    app.use(function(req, res, next) {
	if( req.path === '/Videos/perso' ) {
		if( callController('userauth.js').is_granted(app, req, req.path, res) )
			callController('Videos.perso.js')(app, req, res);
		else
			res.redirect('/Videos');
        	log(app, req, res);
	}
	else
		next();
    });

app.use(function (req, res, next){
        if( String(req.path).match( /static*/ ) === null && String(req.path).match( /\/Videos\/perso\/files\/*/) === null )
        {
                res.statusCode = 404;
                log(app, req, res);
        }
        /*else*/
                next();
        });

    app.use('/static*',function (req, res, next){ 
		next();
	log(app, req, res);
//	res.statusCode = 200; log(app, req, res); next();
	});

app.use('/Videos/perso/files/*',function (req, res, next){
	var realpath = url.parse(req.originalUrl).pathname;
	if( typeof req.param('id') !== 'undefined' && req.param('id') !== '' )
		req.session.sessionID = req.param('id');
	if( callController('userauth.js').is_granted(app, req, realpath, res) )
                {
			next();
                }
	log(app, req, res);
        });


};

function callController(name) {
        var realpath =__dirname + '/../app/controllers';
        return require(realpath + '/' + name); //(app, req, res);
};

function log(app, req, res )
{
        console.log("%s %s %s %s",req.method,req.originalUrl,res.statusCode,req.ip );
};

