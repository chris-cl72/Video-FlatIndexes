var path = require('path');

module.exports = function(app, express, passport) {
    var path =__dirname + '/../app/controllers';
    var users = app.get('users');
    var groups = app.get('groups');
    var http = require('follow-redirects').http;
    var startTime = new Date().getTime();

    var modRewrite = require('connect-modrewrite');

    app.use(modRewrite([ '^/$ /Videos', '^$ /Videos [L]']));


    app.get('/Videos', function(req, res) {
        callController(app, req, res, 'Videos.js');
	
    });

    app.post('/search', function(req, res) {
        callController(app, req, res, 'Videos.js');
    });

    app.post('/Videos/login', function (req, res){
	var user = require(path + '/' + 'user.js');
	user.sha1Auth(app, req.param('username'),
	                   req.param('strcrypt'),
	                   function(result) {
				if( result !== null) {
				//console.log(result);
				res.json(result);
				req.session.userid = result.userid;
				req.session.username = result.username; }
				else {
				//console.log(result); 
				/*res.redirect('http://192.168.0.107:3000/Videos/toto')*/
			//	res.header('Location', '/#/home');
				//res.writeHead(302, {'Location': '/'}); 
     				//res.end();
				//modRewrite(['^/Videos/login$ /Videos']);
				}
				log(app, req, res);
			   });
    }); 

    app.use(function (req, res, next){ res.statusCode = 404; log(app, req, res)});
};
	
function callController(app, req, res, name) {
	//var startTime = new Date().getTime();
        var path =__dirname + '/../app/controllers';
        require(path + '/' + name)(app, req, res);
	log(app, req, res);
};

function log(app, req, res )
{
	/*var endTime = new Date().getTime();
        var respTime = endTime - startTime;*/
        console.log("%s %s %s %s",req.method,req.url,res.statusCode,req.ip );
};



