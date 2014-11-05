#!/usr/bin/env nodejs

var path = require('path');
var fs = require('fs');

var LocalVideos = function() {

	var films = require(path.join(__dirname, 'entities/videos.js')).films;
	this.path = films.path;
	
this.getLastFilms = function(number) {
	var lastFilms = [];
	var filmsByDate = {};
	var arrayDate = [];
	for (var i = 0, len = films.list.length; i < len; i++) {
		arrayDate[i] = new Date(fs.statSync(films.list[i].file).mtime).toISOString();
		filmsByDate[arrayDate[i]] = films.list[i];
		//console.log(new Date(fs.statSync(films.list[i].file).mtime).toISOString().sort());
	}
	arrayDate.sort().reverse();
	for (var i = 0, len = arrayDate.length; i < len; i++) {
		lastFilms[lastFilms.length] = filmsByDate[arrayDate[i]];
		if( i === number-1 )
			break;
		//console.log( arrayDate[i]);
	}
	return lastFilms;
}

};

module.exports = LocalVideos;

/*var  localVideos = new(LocalVideos);
var list = localVideos.getLastFilms(5);
for (var i = 0, len = list.length; i < len; i++) {
	console.log(list[i].title);
}*/
