#!/usr/bin/env nodejs

var fs = require('fs');
var path = require('path');
eval(fs.readFileSync(path.join(__dirname, '../libraries/tools.js'))+'');

var Videos = require(path.join(__dirname, './entities/videos.js'));

var LocalVideos = function() {

	//this.films = require(path.join(__dirname, 'entities/videos.js')).films(staticdir, filter);
	var videos = new Videos();
	this.objectMovieListGenres = null;
	this.objectMovieListGroups = null;
	this.objectMovieListCountrys = null;
	this.objectMovieListYears = null;
	this.objectSerieListCountrys = null;
	this.objectSerieListYears = null;
	this.objectSerieListGroups = null;
	this.objectSerieListGenres = null;
	this.objectSerieListTitles = null;
	//this.filmspath = readConf(path.join(__dirname, '../models/entities/videos.json')).films.path;

this.list = function (filter) {
	this.films = videos.listfilms(path.join(__dirname, '../../private/'),readConf(path.join(__dirname, './entities/videos.json')).films, filter);
	this.saisons = videos.listsaisons(path.join(__dirname, '../../private/'),readConf(path.join(__dirname, './entities/videos.json')).series, filter);
}

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

this.deleteMovieFile = function(filename, callback) {
	var filmsconf = readConf(path.join(__dirname, './entities/videos.json')).films;
	realfilename = filename.replace( filmsconf.urlpath, filmsconf.path);
	var descFile = path.join( path.dirname(realfilename), '.' + path.basename(realfilename) + '.desc');
	var imageFile = path.join( path.dirname(realfilename), '.' + path.basename(realfilename) + '.jpg');
	fs.unlink(realfilename, function (err) {
		if (err) {
			console.log('Error deleting file "' +  realfilename + '".');
		} else {
			console.log('File "' +  realfilename + '" was deleted.');
			fs.unlink(descFile, function (err) {
				fs.unlink(imageFile, function (err) {
					callback(null);
				});
			});			
		}
	});
}

this.deleteTvSerieFile = function(filename, callback) {
	var seriesconf = readConf(path.join(__dirname, './entities/videos.json')).series;
	realfilename = filename.replace( seriesconf.urlpath, seriesconf.path);
	// !!! Attention il faut regénérer le fichier .desc

	//var descFile = path.join( path.dirname(realfilename), '.' + path.basename(realfilename) + '.desc');
	//var imageFile = path.join( path.dirname(realfilename), '.' + path.basename(realfilename) + '.jpg');
	fs.unlink(realfilename, function (err) {
		if (err) {
			console.log('Error deleting file "' +  realfilename + '".');
		} else {
			console.log('File "' +  realfilename + '" was deleted.');
			callback(null);
			/*fs.unlink(descFile, function (err) {
				fs.unlink(imageFile, function (err) {
					callback(null);
				});
			});*/			
		}
	});
}


this.getMovieListGenres = function() {
	if( this.objectMovieListGenres == null ) {
		var listGenres = [];
		for (var i = 0, len = this.films.length; i < len; i++) {
			var genre = 'unclassed';
			if( typeof this.films[i].genre !== 'undefined' && this.films[i].genre !== null )
				genre = this.films[i].genre;
			listGenres[listGenres.length] = genre;
		}
		this.objectMovieListGenres = removeDuplicates(listGenres);
		return this.objectMovieListGenres;
	} else return this.objectMovieListGenres;
}

this.getMovieListGroups = function() {
	if( this.objectMovieListGroups == null ) {
		var listGroups = [];
		for (var i = 0, len = this.films.length; i < len; i++) {
			var groups = '';
			if( typeof this.films[i].groups !== 'undefined' && this.films[i].groups !== null && this.films[i].groups !== '' ) {
				groups = this.films[i].groups;
				var groupslist = groups.split(",");
				for(j in groupslist) {
					listGroups[listGroups.length] = groupslist[j];
				}
			}
		}
		this.objectMovieListGroups =  removeDuplicates(listGroups);
		return this.objectMovieListGroups;
	} else return this.objectMovieListGroups;
}

this.getMovieListYears = function() {
	if( this.objectMovieListYears == null ) {
		var listYears = [];
		for (var i = 0, len = this.films.length; i < len; i++) {
		        var year = '';
		        if( typeof this.films[i].year !== 'undefined' && this.films[i].year !== null && this.films[i].year !== ''  )
			{
		                year = this.films[i].year;
		        	listYears[listYears.length] = year;
			}
		}
		this.objectMovieListYears = removeDuplicates(listYears).sort().reverse();
		return this.objectMovieListYears;
	} else return this.objectMovieListYears;
}

this.getMovieListCountrys = function() {
	if( this.objectMovieListCountrys == null ) {
		var listCountrys = [];
		for (var i = 0, len = this.films.length; i < len; i++) {
		        var country = '';
		        if( typeof this.films[i].country !== 'undefined' && this.films[i].country !== null && this.films[i].country !== ''  )
			{
		                country = this.films[i].country;
		        	listCountrys[listCountrys.length] = country;
			}
		}
		this.objectMovieListCountrys = removeDuplicates(listCountrys);
		return this.objectMovieListCountrys;
	} else return this.objectMovieListCountrys;	
}

this.getSerieListTitles = function() {
	if( this.objectSerieListTitles == null ) {
		var listTitles = [];
		for (var i = 0, len = this.saisons.length; i < len; i++) {
			var title = '';
			if( typeof this.saisons[i].title !== 'undefined' && this.saisons[i].title !== null )
				title = this.saisons[i].title;
			listTitles[listTitles.length] = title;
		}
		this.objectSerieListTitles = removeDuplicates(listTitles);
		return this.objectSerieListTitles;
	} else return this.objectSerieListTitles;
}

this.getSerieListGenres = function() {
	if( this.objectSerieListGenres == null ) {
		var listGenres = [];
		for (var i = 0, len = this.saisons.length; i < len; i++) {
			var genre = 'unclassed';
			if( typeof this.saisons[i].genre !== 'undefined' && this.saisons[i].genre !== null )
				genre = this.saisons[i].genre;
			listGenres[listGenres.length] = genre;
		}
		this.objectSerieListGenres = removeDuplicates(listGenres);
		return this.objectSerieListGenres;
	} else return this.objectSerieListGenres;
}

this.getSerieListGroups = function() {
	if( this.objectSerieListGroups == null ) {
		var listGroups = [];
		for (var i = 0, len = this.saisons.length; i < len; i++) {
			var groups = '';
			if( typeof this.saisons[i].groups !== 'undefined' && this.saisons[i].groups !== null && this.saisons[i].groups !== '' ) {
				groups = this.saisons[i].groups;
				var groupslist = groups.split(",");
				for(j in groupslist) {
					listGroups[listGroups.length] = groupslist[j];
				}
			}
		}
		this.objectSerieListGroups = removeDuplicates(listGroups);
		return this.objectSerieListGroups;
	} else return this.objectSerieListGroups;
}

this.getSerieListYears = function() {
	if( this.objectSerieListYears == null ) {
		var listYears = [];
		for (var i = 0, len = this.saisons.length; i < len; i++) {
		        var year = '';
		        if( typeof this.saisons[i].year !== 'undefined' && this.saisons[i].year !== null && this.saisons[i].year !== ''  )
			{
		                year = this.saisons[i].year;
		        	listYears[listYears.length] = year;
			}
		}
		this.objectSerieListYears = removeDuplicates(listYears).sort().reverse();
		return this.objectSerieListYears;
	} else return this.objectSerieListYears;
}

this.getSerieListCountrys = function() {
	if( this.objectSerieListCountrys == null ) {
		var listCountrys = [];
		for (var i = 0, len = this.saisons.length; i < len; i++) {
		        var country = '';
		        if( typeof this.saisons[i].country !== 'undefined' && this.saisons[i].country !== null && this.saisons[i].country !== ''  )
			{
		                country = this.saisons[i].country;
		        	listCountrys[listCountrys.length] = country;
			}
		}
		this.objectSerieListCountrys = removeDuplicates(listCountrys);
		return this.objectSerieListCountrys;
	} else return this.objectSerieListCountrys;
}
	
this.getLastFilms = function(number) {
	if( number == -1 )
		return this.films;
	var lastFilms = [];
        for (var i = 0, len = this.films.length; i < len; i++) {
		lastFilms[lastFilms.length] = this.films[i];
		if( number !== -1 && i === number-1 )
			break;
        }
        return lastFilms;
}

this.getLastSeries = function(number) {
	if( number == -1 )
		return this.films;
	var lastseries = [];
        for (var i = 0, len = this.saisons.length; i < len; i++) {
		lastseries[lastseries.length] = this.saisons[i];
		if( number !== -1 && i === number-1 )
			break;
        }
        return lastseries; 
}

this.getLastSeriesbyTitle = function(title) {
	var lastSeriesbyTitle = [];
	var lastSeries = this.saisons; //this.getLastSeries(-1);	
	
        for (var i = 0, len = lastSeries.length; i < len; i++) {
		var mytitle = '';		
		if( typeof lastSeries[i].title !== '' && lastSeries[i].title !== null )
			mytitle = lastSeries[i].title;
		if( mytitle.toLowerCase() === title.toLowerCase() ) {
                	lastSeriesbyTitle[lastSeriesbyTitle.length] = lastSeries[i];
		}
        }
        return lastSeriesbyTitle;
}

this.getLastSeriesbyGenre = function(genre) {
	var lastSeriesbyGenre = [];
	var lastSeries = this.saisons; //this.getLastSeries(-1);	
	
        for (var i = 0, len = lastSeries.length; i < len; i++) {
		var mygenre = 'unclassed';		
		if( typeof lastSeries[i].genre !== '' && lastSeries[i].genre !== null )
			mygenre = lastSeries[i].genre;
		if( mygenre.toLowerCase() === genre.toLowerCase() )
                	lastSeriesbyGenre[lastSeriesbyGenre.length] = lastSeries[i];
        }
        return lastSeriesbyGenre;
}

this.getLastSeriesbyYear = function(year) {
        var lastSeriesbyYear = [];
        var lastSeries = this.saisons; //this.getLastSeries(-1);

        for (var i = 0, len = lastSeries.length; i < len; i++) {
                var myyear = '';
                if( typeof lastSeries[i].year !== 'undefined' && lastSeries[i].year !== null && lastSeries[i].year !== '' )
                        myyear = lastSeries[i].year;
                if( myyear.toLowerCase() === year.toLowerCase() )
                        lastSeriesbyYear[lastSeriesbyYear.length] = lastSeries[i];
        }
        return lastSeriesbyYear;
}

this.getLastSeriesbyCountry = function(country) {
        var lastSeriesbyCountry = [];
        var lastSeries = this.saisons; //this.getLastSeries(-1);

        for (var i = 0, len = lastSeries.length; i < len; i++) {
                var mycountry = '';
                if( typeof lastSeries[i].country !== 'undefined' && lastSeries[i].country !== null && lastSeries[i].country !== '' )
                        mycountry = lastSeries[i].country;
                if( mycountry.toLowerCase() === country.toLowerCase() )
                        lastSeriesbyCountry[lastSeriesbyCountry.length] = lastSeries[i];
        }
        return lastSeriesbyCountry;
}

this.getLastSeriesbyGroup = function(group) {
        var lastSeriesbyGroup = [];
        var lastSeries = this.saisons; //this.getLastSeries(-1);

        for (var i = 0, len = lastSeries.length; i < len; i++) {
                var groups = '';
                if( typeof lastSeries[i].groups !== 'undefined' && lastSeries[i].groups !== null && lastSeries[i].groups !== '' ) {
                        groups = lastSeries[i].groups;
			var groupslist = groups.split(",");
			var groupfound = false;
			for(j in groupslist) {
				if( groupslist[j].toLowerCase() === group.toLowerCase() ) {
					groupfound = true;
					break;
				}
			}
                	if( groupfound )
                        	lastSeriesbyGroup[lastSeriesbyGroup.length] = lastSeries[i];
		}
        }
        return lastSeriesbyGroup;
}


this.getLastFilmsbyGenre = function(genre) {
	var lastFilmsbyGenre = [];
	var lastFilms = this.films; //this.getLastFilms(-1);	
	
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
        var lastFilms = this.films; //this.getLastFilms(-1);

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
        var lastFilms = this.films; //this.getLastFilms(-1);

        for (var i = 0, len = lastFilms.length; i < len; i++) {
                var mycountry = '';
                if( typeof lastFilms[i].country !== 'undefined' && lastFilms[i].country !== null && lastFilms[i].country !== '' )
                        mycountry = lastFilms[i].country;
                if( mycountry.toLowerCase() === country.toLowerCase() )
                        lastFilmsbyCountry[lastFilmsbyCountry.length] = lastFilms[i];
        }
        return lastFilmsbyCountry;
}

this.getLastFilmsbyGroup = function(group) {
        var lastFilmsbyGroup = [];
        var lastFilms = this.films; //this.getLastFilms(-1);

        for (var i = 0, len = lastFilms.length; i < len; i++) {
                var groups = '';
                if( typeof lastFilms[i].groups !== 'undefined' && lastFilms[i].groups !== null && lastFilms[i].groups !== '' ) {
                        groups = lastFilms[i].groups;
			var groupslist = groups.split(",");
			var groupfound = false;
			for(j in groupslist) {
				if( groupslist[j].toLowerCase() === group.toLowerCase() ) {
					groupfound = true;
					break;
				}
			}
                	if( groupfound )
                        	lastFilmsbyGroup[lastFilmsbyGroup.length] = lastFilms[i];
		}
        }
        return lastFilmsbyGroup;
}

};

module.exports = LocalVideos;

/*var  localVideos = new(LocalVideos);
var list = localVideos.getLastFilms(5);
for (var i = 0, len = list.length; i < len; i++) {
	console.log(list[i].title);
}*/
