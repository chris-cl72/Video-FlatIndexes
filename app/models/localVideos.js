#!/usr/bin/env nodejs

var path = require('path');
var fs = require('fs');

var LocalVideos = function(staticdir) {

	this.films = require(path.join(__dirname, 'entities/videos.js')).films(staticdir);
	this.path = this.films.path;

function removeDuplicates(target_array) {
    target_array.sort();
    var i = 0;

    while(i < target_array.length) {
        if(target_array[i] === target_array[i+1]) {
	 	target_array.splice(i+1,1);
        }
        else {
            i += 1;
        }
	if( i >= target_array.length -1)
		break;
    }
    return target_array;
}

this.getListGenres = function() {
	var listGenre = [];
	for (var i = 0, len = this.films.list.length; i < len; i++) {
		var genre = 'unclassed';
		if( typeof this.films.list[i].genre !== 'undefined' && this.films.list[i].genre !== null )
			genre = this.films.list[i].genre;
		listGenre[listGenre.length] = genre;
	}
	return removeDuplicates(listGenre);
}
	
this.getLastFilms = function(number) {
	var lastFilms = [];
	var filmsByDate = {};
	var arrayDate = [];
	for (var i = 0, len = this.films.list.length; i < len; i++) {
		arrayDate[i] = new Date(fs.statSync(this.films.list[i].file).mtime).toISOString();
		filmsByDate[arrayDate[i]] = this.films.list[i];
		//console.log(new Date(fs.statSync(films.list[i].file).mtime).toISOString().sort());
	}
	arrayDate.sort().reverse();
	for (var i = 0, len = arrayDate.length; i < len; i++) {
		lastFilms[lastFilms.length] = filmsByDate[arrayDate[i]];
		if( number !== -1 && i === number-1 )
			break;
		//console.log( arrayDate[i]);
	}
	return lastFilms;
}

this.getLastFilmsbyGenre = function(genre) {
	var lastFilmsbyGenre = [];
	var lastFilms = this.getLastFilms(-1);	
	
        for (var i = 0, len = lastFilms.length; i < len; i++) {
		var mygenre = 'unclassed';		
		if( typeof lastFilms[i].genre !== 'undefined' && lastFilms[i].genre !== null )
			mygenre = lastFilms[i].genre;
		if( mygenre.toLowerCase() === genre.toLowerCase() )
                	lastFilmsbyGenre[lastFilmsbyGenre.length] = lastFilms[i];
        }
        return lastFilmsbyGenre;
}

};

module.exports = LocalVideos;

/*var  localVideos = new(LocalVideos);
var list = localVideos.getLastFilms(5);
for (var i = 0, len = list.length; i < len; i++) {
	console.log(list[i].title);
}*/
