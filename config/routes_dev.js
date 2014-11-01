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
	deleteSession(app, req);
        res.redirect('/Videos');
	//callController('user.js').Disconnect(req, res);
	log(app, req, res);
    });

    app.post('/Videos/search', function(req, res) {
        callController('Videos.js')(app, req, res);
	log(app, req, res);
    });

    app.post('/Videos/login', function (req, res){
	var UserAuth = callController('user.js');
	var userAuth = new UserAuth(app.get('users'), app.get('roles') );
	if( userAuth.is_granted_user(req.param('username'), req.param('strcrypt')) ) {
		setSessionData(app, req, 'userAuth', userAuth);
		res.json(userAuth.user);
	}
	log(app, req, res);
    });

    app.get('/Videos/perso', function(req, res) {
	var userAuth = getSessionData(app, req, 'userAuth');
	if( userAuth !=  null && userAuth.is_granted_route(req.path) ) 
		callController('Videos.perso.js')(app, req, res);
	else
		res.redirect('/Videos');
        /*if( callController('user.js').VerifyRoutes(app, req) )
		callController('Videos.js')(app, req, res);
	else
		callController('Videos.js')(app, req, res);*/
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

function getSessionData( app, req, objectName )
{
	var object = null;
        if(  typeof app.get(req.sessionID + '.data') !== 'undefined' && app.get(req.sessionID + '.data') != null && app.get(req.sessionID + '.data').hasOwnProperty(objectName))
                object = app.get(req.sessionID + '.data')[objectName];

	return object;
};

function setSessionData( app, req, objectName, object )
{
	var arrayData = {};
        if( typeof app.get(req.sessionID + '.data') !== 'undefined'  && app.get(req.sessionID + '.data') !== null)
        	arrayData = app.get(req.sessionID + '.data');
        arrayData[objectName] = object;
        app.set(req.sessionID + '.data', arrayData);
};

function deleteSessionData( app, req, objectName )
{
	var arrayData = {};
	if(  typeof app.get(req.sessionID + '.data') !== 'undefined' && app.get(req.sessionID + '.data') != null && app.get(req.sessionID + '.data').hasOwnProperty(objectName))
	{
		arrayData = app.get(req.sessionID + '.data');
		delete arrayData[objectName];
	}
};

function deleteSession(app, req)
{
        app.set(req.sessionID + '.data', null);
	req.session.destroy(function(err) {
        // cannot access session here
        });
};
