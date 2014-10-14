module.exports = function(app, req, res) {
	callEntity(app, req, 'searchOnline.js',function(data)
	{
		res.render('test.twig', { searchResult : data });
	}
);

function callEntity(app, req, name, callBack) {
        var path =__dirname + '/../entities';
        return require(path + '/' + name)(app, req, callBack);
}

};
