module.exports = function(app, req, res) {
/*
var  localVideos = new(LocalVideos);
var list = localVideos.getLastFilms(5);
for (var i = 0, len = list.length; i < len; i++) {
        console.log(list[i].title);
*/
	var LocalVideos = callDataModel('localVideos.js');
	var localVideos = new LocalVideos(app.get('staticdir'));
	//console.log(localVideos.path);
	var userAuth = getSessionData( app, req, 'userAuth' );

	if( req.param('type') === 'films' ) {
		if( req.param('order') === 'news' ) {
			var list = localVideos.getLastFilms(15);
        		res.render('Videos.perso.twig', { userAuth : userAuth, lastFilms : list });
		}
		else if( req.param('order') === 'genre' ) {
			var list = localVideos.getLastFilmsbyGenre(req.param('value'));
			res.json(list);
			//console.log(list[0]);
		}
		else
			res.redirect('/Videos');
	}
	else if( req.param('type') === 'listgenres' ) {
		//console.log('listgenres');
		var list = localVideos.getListGenres();		
		res.json(list);		
	}
	else
		res.redirect('/Videos');
};

function callDataModel(name) {
        var path =__dirname + '/../models';
        return require(path + '/' + name);
}

function getSessionData( app, req, objectName )
{
        var object = null;
        if(  typeof app.get(req.sessionID + '.data') !== 'undefined' && app.get(req.sessionID + '.data') != null && app.get(req.sessionID + '.data').hasOwnProperty(objectName))
                object = app.get(req.sessionID + '.data')[objectName];

        return object;
};
