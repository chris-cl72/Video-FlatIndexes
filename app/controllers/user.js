exports.Connect = function(app, req, res)
{
	       sha1Auth(app, req.param('username'),
                           req.param('strcrypt'),
                           function(result) {
                                if( result !== null) {
                                        req.session.userid = result.userid;
                                        req.session.username = result.username;
                                        res.json(result);
                                        }
                                });

};

function sha1Auth(app, username, hash, callback)
{
	var users = app.get('users');
	var groups = app.get('groups');
	var user = userFindOne(users, username);
        if( (user !== null) && userValidPassword(user, hash, 'sha1') )
        {
                var result = { userid: user.id, username: user.username };
		//console.log( getAuthorizedRoutes(user) );
                callback(result);
        }
        else
                callback(null);
};

function userFindOne(users, username)
{
	for (var i = 0, len = users.length; i < len; i++) {
		var user = users[i];
		if (user.username === username) {
			return user;
		}
	}
	return null;
};

function userValidPassword(user, hash, algo)
{
        //console.log(users[0].ingroups[0]);
	var digest = null;
	if( user.config.mode === 'clear' )
	{
        	var crypto = require('crypto');
		var shasum = crypto.createHash(algo);
		shasum.update(user.password);

		digest = shasum.digest('hex');
	}
	else if ( user.config.mode === 'crypt' )
		digest = user.password;
	//console.log(digest);
	if( digest === hash )
        	return true;
	else
        	return false;
};

exports.Disconnect = function(req, res)
{
	req.session.destroy(function(err) {
        // cannot access session here
        });
	res.redirect('/Videos');
};


exports.VerifyRoutes = function(app, req)
{
	var isAuthorized = false
	if( typeof req.session !== 'undefined' && req.session !== null )
	{
	var routes = extractRoutes(app, req.session.userid);
	for( var i = 0, len = routes.length ; i < len; i++) {
		var reg=new RegExp(routes[i]);
		if( reg.test(req.path) )
		{
			isAuthorized = true;
			break;
		}
	}
	}
	return isAuthorized;
};

function extractRoutes(app, userid)
{
	var routes = new Array();
	var pos = 0;
	var user = null;
	var users = app.get('users');
	for( var i = 0, len = users.length ; i < len; i++) {
		if( users[i].id === userid ) { user = users[i]; break; }
	}

	if( user !== null )
	{
	for( var i = 0, len = user.ingroups.length; i < len; i++) {
		var groupname = user.ingroups[i];
		var localroutes = null;
		for( var j = 0, len = groups.length; j < len; j++) {
			if( groups[j].name === groupname ) {
				localroutes = groups[j].routes
				break;
			}
		}
		if( localroutes !== null ) {
			for( var j = 0, len = localroutes.length; j < len; j++) {
				routes[pos] = localroutes[j];
				pos++;		
			}
		}
	}
	}
	return routes;
};

