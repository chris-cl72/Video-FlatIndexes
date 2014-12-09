// Constructor
// var user = new userAuth(app.get('users'), app.get('roles') );
// user.is_granted_user(req.param('username'), req.param('strcrypt'));
// user.is_granted_route(req.path); //req.session.userid
// user.is_granted_role('ROLE_ADMIN');
var path = require('path');
var acl = require(path.join(__dirname, 'entities/acl.js'));

var UserAuth = function() {
  this.user = null;
  this.users = acl.users
  this.roles = acl.roles;


//UserAuth.prototype.is_granted_user = function(username, passwd) {
this.is_granted_user = function(username, passwd) {
	this.user = sha1Auth( username, passwd, this.users );
	if( this.user !== null )
		return true;
	else
		return false;
};

// class methods
//UserAuth.prototype.is_granted_route = function(path) {
this.is_granted_route = function(path) {
        var isAuthorized = false;
	if( this.user !== null ) {
        	var routes = extractRoutes(this.user, this.roles);
		var len = routes.length;
        	for( var i = 0; i < len; i++) {
                	var reg=new RegExp(routes[i]);
                	if( reg.test(path) ) {
                        	isAuthorized = true;
                        	break;
               		}
        	}
	}
	//console.log('is_granted_route: ' + path + ' : ' + isAuthorized);
        return isAuthorized;
};

//UserAuth.prototype.is_granted_role = function(role){
this.is_granted_role = function(role){
	var isAuthorized = false;
	if( this.user !== null ) {
		var len = this.user.inroles.length;
		for( var i = 0; i < len; i++) {		
			//console.log(this.user.inroles[i]);
			if( this.user.inroles[i] === role ) {
				isAuthorized = true;
				console.log('User id ' + this.user.id + ' has granted role ' + role + '.');
                                break;
			}
		}
	}
	if( !isAuthorized )
		console.log('User id ' + this.user.id + ' has not granted role ' + role + '!');
	return isAuthorized;
};

//UserAuth.prototype.getUserName = function() {
this.getUserName = function() {
	return this.user.username;
};

//UserAuth.prototype.getUserId = function() {
this.getUserId = function() {
        return this.user.userid;
};

function sha1Auth(username, passwd, users)
{
	var user = userFindOne(username,users);
        if( (user !== null) && isValidPassword(user, passwd, 'sha1') )
        {
		return user;
        }
        else
		return null;
};

function userFindOne(username, users)
{
	var len = users.length;
	for (var i = 0; i < len; i++) {
		var user = users[i];
		if (user.username === username) {
			return user;
		}
	}
	return null;
};

function isValidPassword(user, hash, algo)
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

/*exports.Disconnect = function(req, res)
{
	req.session.destroy(function(err) {
        // cannot access session here
        });
	res.redirect('/Videos');
};*/



function extractRoutes(user, roles)
{
	//var users = app.get('users');
        //var roles = app.get('roles');

	var routes = new Array();
	var pos = 0;
/*	var user = null;
	for( var i = 0, len = users.length ; i < len; i++) {
		if( users[i].id === userid ) { user = users[i]; break; }
	}*/

	if( user !== null )
	{
	var len = user.inroles.length;
	for( var i = 0; i < len; i++) {
		var rolename = user.inroles[i];
		var localroutes = null;
		var len1 = roles.length;
		for( var j = 0; j < len1; j++) {
			if( roles[j].name === rolename ) {
				localroutes = roles[j].routes
				break;
			}
		}
		if( localroutes !== null ) {
			len1 = localroutes.length;
			for( var j = 0; j < len1; j++) {
				routes[pos] = localroutes[j];
				pos++;		
			}
		}
	}
	}
	return routes;
};
}
// export the class
module.exports = UserAuth;
