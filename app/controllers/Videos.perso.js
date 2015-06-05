var path = require('path');
var fs = require('fs');

module.exports = function(app, req, res) {
/*
var  localVideos = new(LocalVideos);
var list = localVideos.getLastFilms(5);
for (var i = 0, len = list.length; i < len; i++) {
        console.log(list[i].title);
*/
	var LocalVideos = callDataModel('localVideos.js');
	var LocalDownloads = callDataModel('localDownloads.js');
	var OnlineVideos = callDataModel('onlineVideos.js');

	var userAuth = getSessionData( app, req, 'userAuth' );
	//console.log('Videos.perso controller');
	if( req.method === 'GET' ) {
	if( req.param('type') === 'films' ) {
		if( req.param('order') === 'news' ) {
			deleteSessionData(app,req,'localVideos');	
			localVideos = new LocalVideos(path.join(__dirname, '../../private/'),""); //app.get('staticdir'));
			setSessionData(app,req,'localVideos', localVideos);
			var list = localVideos.getLastFilms(15);
        		res.render('Videos.perso.twig', { userAuth : userAuth, lastFilms : list, id : req.session.sessionID });
		}
		else if( req.param('order') === 'genre' ) {
			var localVideos = getSessionData(app,req,'localVideos');
			var list = localVideos.getLastFilmsbyGenre(req.param('value'));
			res.json({ userAuth : userAuth, list : list, id : req.session.sessionID });
			//console.log(list[0]);
		}
		else if( req.param('order') === 'year' ) {
                        var localVideos = getSessionData(app,req,'localVideos');
                        var list = localVideos.getLastFilmsbyYear(req.param('value'));
                        res.json({ userAuth : userAuth, list : list, id : req.session.sessionID });
                        //console.log(list[0]);
                }
		else if( req.param('order') === 'country' ) {
                        var localVideos = getSessionData(app,req,'localVideos');
                        var list = localVideos.getLastFilmsbyCountry(req.param('value'));
                        res.json({ userAuth : userAuth, list : list, id : req.session.sessionID });
                        //console.log(list[0]);
                }
		else
			res.redirect('/Videos');
	}
	else if( req.param('type') === 'listgenres' ) {
		//console.log('listgenres');
		var localVideos = getSessionData(app,req,'localVideos');
		var list = localVideos.getListGenres();		
		res.json(list);		
	}
	else if( req.param('type') === 'listyears' ) {
                //console.log('listgenres');
                var localVideos = getSessionData(app,req,'localVideos');
                var list = localVideos.getListYears();
                res.json(list);
        }
	else if( req.param('type') === 'listcountrys' ) {
                //console.log('listgenres');
                var localVideos = getSessionData(app,req,'localVideos');
                var list = localVideos.getListCountrys();
                res.json(list);
        }
	else if( req.param('type') === 'listdownloads'  && userAuth.is_granted_role('ROLE_ADMIN') ) {
	//	var localDownloads = getSessionData(app,req,'localDownloads');
	//	if( localDownloads === null || typeof localDownloads === 'undefined' )
	//	{
		var localDownloads = new LocalDownloads();
		setSessionData(app,req,'localDownloads', localDownloads);
		//localDownloads = getSessionData(app,req,'localDownloads');
	//	}
                //var list = localDownloads.getAll();
		//var path = localDownloads.path;
		res.json(localDownloads);
	}
	else
		res.redirect('/Videos');
	}
	else if (req.method === 'POST') {
		//console.log( req.body );
		var jsonParams = req.body;
		if( req.param('type') === 'searchonline' && userAuth.is_granted_role('ROLE_ADMIN') ) {
                	var onlineVideos = new OnlineVideos();
			var list = onlineVideos.searchAllocine(req.param('value'), function(list) {
				res.json(list);
			});
         	}
		else if( jsonParams['type'] === 'rename' &&  userAuth.is_granted_role('ROLE_ADMIN') ) {
			var localDownloads = getSessionData(app,req,'localDownloads');
			
			var datadownload = localDownloads.list;
			var pathdownload = localDownloads.path;

			for(var key in jsonParams){
				if( key !== 'type' ) {
					var oldfile = pathdownload + '/' + decodeURIComponent(key);
					var newfile = pathdownload + '/' + decodeURIComponent(jsonParams[key]);
					console.log('Moving "' +  oldfile + '" into "' + newfile + '" ...');
					fs.rename(oldfile, newfile, function() {
						res.json({filename:key,data:jsonParams[key]});
					});
				}
    			}
			
         	}
		else if( jsonParams['type'] === 'search' &&  userAuth.is_granted_role('ROLE_ADMIN') ) {
			var localDownloads = getSessionData(app,req,'localDownloads');
			var datadownload = localDownloads.list;

			for(var key in jsonParams){
				if( key !== 'type' ) {
					var searchkeywords = decodeURIComponent(key).replace(/^(.*)\/([^\/]*)$/g, "$2");
					searchkeywords = searchkeywords.replace(/^(.*)(\.[^.]*)$/g, "$1");
					searchkeywords = searchkeywords.replace(/\./g, ' ');
					console.log(searchkeywords);
					var onlineVideos = new OnlineVideos();
					onlineVideos.listmovies( searchkeywords,function(movies) {
						res.json({filename:key,data:movies});
					});
				}
    			}
         	}

	}
};

function callDataModel(name) {
        var path =__dirname + '/../models';
        return require(path + '/' + name);
}

function getSessionData( app, req, objectName )
{
        var object = null;
        if(  typeof app.get(req.session.sessionID + '.data') !== 'undefined' && app.get(req.session.sessionID + '.data') !== null && app.get(req.session.sessionID + '.data').hasOwnProperty(objectName))
                object = app.get(req.session.sessionID + '.data')[objectName];

        return object;
};

function setSessionData( app, req, objectName, object )
{
        var arrayData = {};
        if( typeof app.get(req.session.sessionID + '.data') !== 'undefined'  && app.get(req.session.sessionID + '.data') !== null)
                arrayData = app.get(req.session.sessionID + '.data');
        else
                req.session.sessionID = req.sessionID;
        arrayData[objectName] = object;
        app.set(req.session.sessionID + '.data', arrayData);
};

function deleteSessionData( app, req, objectName )
{
        var arrayData = {};
        if(  typeof app.get(req.session.sessionID + '.data') !== 'undefined' && app.get(req.session.sessionID + '.data') != null && app.get(req.session.sessionID + '.data').hasOwnProperty(objectName))
        {
                arrayData = app.get(req.session.sessionID + '.data');
                delete arrayData[objectName];
        }
};

