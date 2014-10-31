module.exports = function(app, req, res) {
	callDataModel(app, req, 'searchOnline.js',function(data)
	{
		//var user = null;
		/*if( typeof req.session.userid !== 'undefined' && req.session.userid !== null )
			{
			user = { userid: req.session.userid, username: req.session.username };
			}*/
		//var userAuth = app.set(req.sessionID + '.userAuth');
       		var userAuth = null;
        	if(  typeof app.get(req.sessionID + '.data') !== 'undefined' && app.get(req.sessionID + '.data') != null && app.get(req.sessionID + '.data').hasOwnProperty('userAuth'))
                	userAuth = app.get(req.sessionID + '.data')['userAuth'];

		res.render('test.twig', { userAuth : userAuth, searchResult : data });
	}
);

function callDataModel(app, req, name, callBack) {
        var path =__dirname + '/../models';
        return require(path + '/' + name)(app, req, callBack);
}

};
