module.exports.login = function(app, req, res) {
	var UserAuth = require(__dirname + '/../models/userauth.js');	
	var userAuth = new UserAuth(); //app.get('users'), app.get('roles') );
        if( userAuth.is_granted_user(req.param('username'), req.param('strcrypt')) ) {
                setSessionData(app, req, 'userAuth', userAuth);
                res.json(userAuth.user);
        }
};

module.exports.logout = function(app, req, res) {
	deleteSession(app, req);
        res.redirect('/Videos');
};

module.exports.is_granted = function(app, req, res) {
	var userAuth = getSessionData(app, req, 'userAuth');
        if( userAuth !=  null && userAuth.is_granted_route(req.path) )
		return true;
	else
		return false
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

