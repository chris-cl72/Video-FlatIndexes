#!/usr/bin/env nodejs

var fs = require('fs');
var path = require('path');
eval(fs.readFileSync(path.join(__dirname, '../libraries/tools.js'))+'');

var Videos = require(path.join(__dirname, './entities/videos.js'));

var LocalVideos = function(filter) {

	//this.films = require(path.join(__dirname, 'entities/videos.js')).films(staticdir, filter);
	var videos = new Videos();
	this.films = videos.listfilms(path.join(__dirname, '../../private/'),readConf(path.join(__dirname, './entities/videos.json')).films, filter);
	//this.filmspath = readConf(path.join(__dirname, '../models/entities/videos.json')).films.path;

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
	var listGenres = [];
	for (var i = 0, len = this.films.length; i < len; i++) {
		var genre = 'unclassed';
		if( typeof this.films[i].genre !== 'undefined' && this.films[i].genre !== null )
			genre = this.films[i].genre;
		listGenres[listGenres.length] = genre;
	}
	return removeDuplicates(listGenres);
}

this.getListYears = function() {
        var listYears = [];
        for (var i = 0, len = this.films.length; i < len; i++) {
                var year = '';
                if( typeof this.films[i].year !== 'undefined' && this.films[i].year !== null && this.films[i].year !== ''  )
		{
                        year = this.films[i].year;
                	listYears[listYears.length] = year;
		}
        }
        return removeDuplicates(listYears).sort().reverse();
}

this.getListCountrys = function() {
        var listCountrys = [];
        for (var i = 0, len = this.films.length; i < len; i++) {
                var country = '';
                if( typeof this.films[i].country !== 'undefined' && this.films[i].country !== null && this.films[i].country !== ''  )
		{
                        country = this.films[i].country;
                	listCountrys[listCountrys.length] = country;
		}
        }
        return removeDuplicates(listCountrys);
}
	
this.getLastFilms = function(number) {
	var lastFilms = [];
	var filmsByDate = {};
	var arrayDate = [];
	for (var i = 0, len = this.films.length; i < len; i++) {
		arrayDate[i] = new Date(fs.statSync(this.films[i].file).mtime).toISOString() + "-" + this.films[i].file;
		filmsByDate[arrayDate[i]] = this.films[i];
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

this.getLastFilmsbyYear = function(year) {
        var lastFilmsbyYear = [];
        var lastFilms = this.getLastFilms(-1);

        for (var i = 0, len = lastFilms.length; i < len; i++) {
                var myyear = '';
                if( typeof lastFilms[i].year !== 'undefined' && lastFilms[i].year !== null && lastFilms[i].year !== '' )
                        myyear = lastFilms[i].year;
                if( myyear.toLowerCase() === year.toLowerCase() )
                        lastFilmsbyYear[lastFilmsbyYear.length] = lastFilms[i];
        }
        return lastFilmsbyYear;
}

this.getLastFilmsbyCountry = function(country) {
        var lastFilmsbyCountry = [];
        var lastFilms = this.getLastFilms(-1);

        for (var i = 0, len = lastFilms.length; i < len; i++) {
                var mycountry = '';
                if( typeof lastFilms[i].country !== 'undefined' && lastFilms[i].country !== null && lastFilms[i].country !== '' )
                        mycountry = lastFilms[i].country;
                if( mycountry.toLowerCase() === country.toLowerCase() )
                        lastFilmsbyCountry[lastFilmsbyCountry.length] = lastFilms[i];
        }
        return lastFilmsbyCountry;
}

};

module.exports = LocalVideos;

/*var  localVideos = new(LocalVideos);
var list = localVideos.getLastFilms(5);
for (var i = 0, len = list.length; i < len; i++) {
	console.log(list[i].title);
}*/
