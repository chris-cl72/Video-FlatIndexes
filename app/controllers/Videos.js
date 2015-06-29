var path = require('path');
var LocalVideos = callDataModel('localVideos.js');

module.exports.accueil = function(app, req, res) {
	var userAuth = getSessionData( app, req, 'userAuth' );
        res.render('Videos.twig', { userAuth : userAuth, searchResult : null });
};

module.exports.search = function(app, req, res) {
	if( req.param('scope') === 'online' )
	{
	var OnlineVideos = callDataModel('onlineVideos.js');
	var onlineVideos = new OnlineVideos();
        //callDataModel(app, req, 'onlineVideos.js',function(data)
	onlineVideos.listmovies( req.param('search'),function(data)
        {
                var userAuth = getSessionData( app, req, 'userAuth' );
		var searchResult = new SearchResult();
		searchResult.movies = data;
		//console.log(data);
                res.render('Videos.twig', { userAuth : userAuth, searchResult : searchResult, id : req.session.sessionID });
        });
	}
        if( req.param('scope') === 'local' )
        {
	//var LocalVideos = callDataModel('localVideos.js');
	var localVideos = new LocalVideos();
	localVideos.list(req.param('search'));
	//localVideos = new LocalVideos(path.join(__dirname, '../../private/'),req.param('search')); //app.get('staticdir'));
	var list = localVideos.getLastFilms(100);
	var userAuth = getSessionData( app, req, 'userAuth' );
	var searchResult = new SearchResult();
                searchResult.movies = list;
	res.render('Videos.twig', { userAuth : userAuth, searchResult : searchResult, id : req.session.sessionID });
	
        /*callDataModel(app, req, 'localVideos.js',function(data)
        {
                var userAuth = getSessionData( app, req, 'userAuth' );
                res.render('Videos.twig', { userAuth : userAuth, searchResult : data });
        });*/
        }

};

/*function callDataModel(app, req, name, callBack) {
        var path =__dirname + '/../models';
        return require(path + '/' + name)(app, req, callBack);
}*/

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
}

function SearchResult()
{
        this.movies = new Array;
        this.tvseries = new Array;
}

