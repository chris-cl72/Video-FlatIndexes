var fs = require('fs');
var path = require('path');

module.exports = function(app, req, res) {
	var LocalVideos = callDataModel('localVideos.js');
	var LocalDownloads = callDataModel('localDownloads.js');
	var OnlineVideos = callDataModel('onlineVideos.js');

	var userAuth = getSessionData( app, req, 'userAuth' );
	if( req.method === 'GET' ) {
	if( req.param('type') === 'films' ) {
		if( req.param('order') === 'news' ) {
			var localVideos = getSessionData(app,req,'localVideos');
			if( localVideos == null || typeof localVideos === 'undefined' ) { localVideos = new LocalVideos(); localVideos.list(""); setSessionData(app,req,'localVideos', localVideos); }
			//deleteSessionData(app,req,'localVideos');	
			//var localVideos = new LocalVideos("");
			//setSessionData(app,req,'localVideos', localVideos);
			var list = localVideos.getLastFilms(15);
        		res.render('Videos.perso.twig', { userAuth : userAuth, lastFilms : list, id : req.session.sessionID });
		}
		else if( req.param('order') === 'genre' ) {
			var localVideos = getSessionData(app,req,'localVideos');
			if( localVideos == null || typeof localVideos === 'undefined' ) { localVideos = new LocalVideos(); localVideos.list(""); setSessionData(app,req,'localVideos', localVideos); }
			var list = localVideos.getLastFilmsbyGenre(req.param('value'));
			res.json({ userAuth : userAuth, list : list, id : req.session.sessionID });
		}
		else if( req.param('order') === 'year' ) {
                        //var localVideos = getSessionData(app,req,'localVideos');
			var localVideos = getSessionData(app,req,'localVideos');
			if( localVideos == null || typeof localVideos === 'undefined' ) { localVideos = new LocalVideos(); localVideos.list(""); setSessionData(app,req,'localVideos', localVideos); }
                        var list = localVideos.getLastFilmsbyYear(req.param('value'));
                        res.json({ userAuth : userAuth, list : list, id : req.session.sessionID });
                }
		else if( req.param('order') === 'country' ) {
                        //var localVideos = getSessionData(app,req,'localVideos');
			var localVideos = getSessionData(app,req,'localVideos');
			if( localVideos == null || typeof localVideos === 'undefined' ) { localVideos = new LocalVideos(); localVideos.list(""); setSessionData(app,req,'localVideos', localVideos); }
                        var list = localVideos.getLastFilmsbyCountry(req.param('value'));
                        res.json({ userAuth : userAuth, list : list, id : req.session.sessionID });
                }
		else if( req.param('order') === 'group' ) {
                        //var localVideos = getSessionData(app,req,'localVideos');
			var localVideos = getSessionData(app,req,'localVideos');
			if( localVideos == null || typeof localVideos === 'undefined' ) { localVideos = new LocalVideos(); localVideos.list(""); setSessionData(app,req,'localVideos', localVideos); }
                        var list = localVideos.getLastFilmsbyGroup(req.param('value'));
                        res.json({ userAuth : userAuth, list : list, id : req.session.sessionID });
                }
		else
			res.redirect('/Videos');
	}
	else if( req.param('type') === 'listgenres' ) {
		var localVideos = getSessionData(app,req,'localVideos');
		if( localVideos == null || typeof localVideos === 'undefined' ) { localVideos = new LocalVideos(); localVideos.list(""); setSessionData(app,req,'localVideos', localVideos); }
		var list = localVideos.getListGenres();		
		res.json(list);		
	}
	else if( req.param('type') === 'listyears' ) {
                var localVideos = getSessionData(app,req,'localVideos');
		if( localVideos == null || typeof localVideos === 'undefined' ) { localVideos = new LocalVideos(); localVideos.list(""); setSessionData(app,req,'localVideos', localVideos); }
                var list = localVideos.getListYears();
                res.json(list);
        }
	else if( req.param('type') === 'listcountrys' ) {
                var localVideos = getSessionData(app,req,'localVideos');
		if( localVideos == null ) { localVideos = new LocalVideos(); localVideos.list(""); setSessionData(app,req,'localVideos', localVideos); }
                var list = localVideos.getListCountrys();
                res.json(list);
        }
	else if( req.param('type') === 'listgroups' ) {
                var localVideos = getSessionData(app,req,'localVideos');
		if( localVideos == null ) { localVideos = new LocalVideos(); localVideos.list(""); setSessionData(app,req,'localVideos', localVideos); }
                var list = localVideos.getListGroups();
                res.json(list);
        }	
	else if( req.param('type') === 'listdownloads'  && userAuth.is_granted_role('ROLE_ADMIN') ) {
		var localDownloads = new LocalDownloads();
		localDownloads.readall();
		res.json(localDownloads);
	}
	else
		res.redirect('/Videos');
	}
	else if (req.method === 'POST') {
		var jsonParams = req.body;
		if( jsonParams['type'] === 'rename' &&  userAuth.is_granted_role('ROLE_ADMIN') ) {
			for(var key in jsonParams){
				if( key !== 'type' && key !== 'typevideo' && key !== 'seasonnumber' ) {
					var localDownloads = new LocalDownloads();
					localDownloads.rename(decodeURIComponent(key),decodeURIComponent(jsonParams[key]), function(oldfile, newfile) {
						res.json({filename:oldfile,data:newfile});
					});					
				}
    			}
			
         	}
		else if( jsonParams['type'] === 'search' &&  userAuth.is_granted_role('ROLE_ADMIN') ) {
			var searchkeywords = '';
			var filename = '';
			var typevideo = jsonParams['typevideo'];
			var seasonnumber = jsonParams['seasonnumber'];
			for(var key in jsonParams){
				if( key !== 'type' && key !== 'typevideo' && key !== 'seasonnumber' ) {
					filename = key;
					searchkeywords = jsonParams[filename];					
				}
    			}
			if( typevideo === 'tvserie' ) {
				var onlineVideos = new OnlineVideos();
				onlineVideos.listseries( searchkeywords,seasonnumber, function(saisons) {
					res.json({filename:filename,typevideo:typevideo,data:saisons});
				});
			}
			if( typevideo === 'movie' ) {
				var onlineVideos = new OnlineVideos();
				onlineVideos.listmovies( searchkeywords,function(movies) {
					res.json({filename:filename,typevideo:typevideo,data:movies});
				});
			}
         	}
		else if( jsonParams['type'] === 'indexation' &&  userAuth.is_granted_role('ROLE_ADMIN') ) {
			var filename = '';
			var id = 0;
			var typevideo = jsonParams['typevideo'];
			for(var key in jsonParams){
				if( key !== 'type' && key !== 'typevideo' ) {
					filename = key;
					id = jsonParams[filename];
				}
			}	
			if( typevideo === 'tvserie' ) {
				var onlineVideos = new OnlineVideos();
				onlineVideos.getSaison(id, function(masaison) {
					var localDownloads = new LocalDownloads();
					localDownloads.importSerie(decodeURIComponent(filename), masaison, function(error) { 
						if( error )
							console.log(error);
						res.json({filename:filename,masaison:masaison});
					});	
				}); 
			}
			else if( typevideo === 'movie' ) {
				var onlineVideos = new OnlineVideos();
				onlineVideos.getMovie(id, function(monfilm) {
					var localDownloads = new LocalDownloads();
					localDownloads.importFilm(decodeURIComponent(filename), monfilm, function(error) { 
						if( error )
							console.log(error);
						res.json({filename:filename,monfilm:monfilm});
					});	
				}); 
			}   			
		}
		else if( jsonParams['type'] === 'delete' &&  userAuth.is_granted_role('ROLE_ADMIN') ) {
			deleteSessionData(app,req,'localVideos');
			var localVideos = new LocalVideos();
			localVideos.deleteMovieFile(decodeURIComponent(jsonParams['filename']), function(err) {
				res.json({error:err});
			});
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



