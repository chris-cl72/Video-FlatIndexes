module.exports = function(app, req, res) {
	callEntity(app, req, 'searchOnline.js',function(data)
	{
		var user = null;
		if( typeof req.session.userid !== 'undefined' && req.session.userid !== null )
			{
			user = { userid: req.session.userid, username: req.session.username };
			}

		res.render('test.twig', { user : user, searchResult : data });
	}
);

function callEntity(app, req, name, callBack) {
        var path =__dirname + '/../entities';
        return require(path + '/' + name)(app, req, callBack);
}

};
