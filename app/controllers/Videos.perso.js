module.exports = function(app, req, res) {
/*
var  localVideos = new(LocalVideos);
var list = localVideos.getLastFilms(5);
for (var i = 0, len = list.length; i < len; i++) {
        console.log(list[i].title);
*/
	var LocalVideos = callDataModel('localVideos.js');
	var localVideos = new(LocalVideos);
	console.log(localVideos.path);
	//app.use(express.static(localVideos.path));
	var list = localVideos.getLastFilms(20);
	/*for (var i = 0, len = list.length; i < len; i++) {
        	console.log(list[i].title);
	}*/
	var userAuth = getSessionData( app, req, 'userAuth' );
        res.render('Videos.perso.twig', { userAuth : userAuth, lastFilms : list });
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
