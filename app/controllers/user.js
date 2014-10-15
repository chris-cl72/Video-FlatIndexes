exports.sha1Auth = function(app, username, hash, callback)
{
	var users = app.get('users');
	var groups = app.get('groups');
	var user = userFindOne(username);
        if( (user !== null) && userValidPassword(user, hash, 'sha1') )
        {
                var result = { userid: user.id, username: user.username };
		//console.log( getAuthorizedRoutes(user) );
                callback(result);
        }
        else
                callback(null);


function userFindOne(username)
{
	for (var i = 0, len = users.length; i < len; i++) {
		var user = users[i];
		if (user.username === username) {
			return user;
		}
	}
	return null;
}

function userValidPassword(user, hash, algo)
{
        //console.log(users[0].ingroups[0]);
        var crypto = require('crypto');
	var shasum = crypto.createHash(algo);
	shasum.update(user.password);
	var digest = shasum.digest('hex');
	//console.log(digest);
	if( digest === hash )
        	return true;
	else
        	return false;
}

exports.AuthorizedRoutes = function(userid)
{
	var routes = new Array();
	var pos = 0;
	var user = null;
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
}

};
