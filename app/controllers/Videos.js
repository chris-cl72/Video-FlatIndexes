module.exports.accueil = function(app, req, res) {
	var userAuth = getSessionData( app, req, 'userAuth' );
        res.render('Videos.twig', { userAuth : userAuth, searchResult : null });
};

module.exports.search = function(app, req, res) {
        callDataModel(app, req, 'searchOnline.js',function(data)
        {
                var userAuth = getSessionData( app, req, 'userAuth' );
                res.render('Videos.twig', { userAuth : userAuth, searchResult : data });
        });
};

function callDataModel(app, req, name, callBack) {
        var path =__dirname + '/../models';
        return require(path + '/' + name)(app, req, callBack);
}

function getSessionData( app, req, objectName )
{
        var object = null;
        if(  typeof app.get(req.sessionID + '.data') !== 'undefined' && app.get(req.sessionID + '.data') != null && app.get(req.sessionID + '.data').hasOwnProperty(objectName))
                object = app.get(req.sessionID + '.data')[objectName];

        return object;
};
