#!/usr/bin/env nodejs

var allocine = require('allocine-api');
var async = require('async');
var path = require('path');
var Film = require(path.join(__dirname, './entities/film.js'));
var Saison = require(path.join(__dirname, './entities/serie.js'));

var onlineVideos = function() {
this.listmovies = function( filter, entityResult ) {
	var movies = new Array;

		async.waterfall(
    		[
        		function(callback) {
				allocine.api('search', {q: filter, count: 4, filter: 'movie'}, function(err, object) { movies = searchMovies(err, object, movies); callback(null, callback); });
        		},
			function (err, callback) {
				moviesDetails(err, movies, function(result) {movies = result; callback(null, callback); } );
			}
    		],
		function (err, callback) {
			entityResult(movies);
		}		
		);
}

function searchMovies(error,object, movies)
{
	var data = '';
	if( typeof object.feed !== 'undefined' && typeof object.feed.totalResults !== 'undefined') {

	for (i = 0; i < object.feed.totalResults ; i++) {
	var movie = object.feed.movie[i];
	if( movie !== null && typeof movie !== 'undefined' )
	{
		var code = '';
		if( typeof movie.code !== 'undefined' )
			code = movie.code;
		var monfilm = new Film();
		monfilm.code = code;
		/*var title = '';
		try{ title = movie.title; } catch(error) {title = '';}
		if( title === '' || typeof title === 'undefined')
			try { title = movie.originalTitle;} catch(error) {title = '';}
		var productionYear = '';
		try{ productionYear = movie.productionYear } catch(error) {productionYear= ''; }

		if( title !== '' && movie.productionYear !== '' )
		{	
			data += title + ' (' + productionYear + ')' + '<br/>';
		}

		var href = 'http://fr.web.img4.acsta.net/r_160_240/b_1_d6d6d6/commons/emptymedia/empty_photo.jpg';
		if( typeof movie.poster !== 'undefined' && typeof movie.poster.href !== 'undefined' )
		{
			href = movie.poster.href;
			href = href.replace(/^(http:\/\/[^\/]*)(.*)$/g, "$1/r_160_240/b_1_d6d6d6$2");
		}
	
		var link_href = '';
		try{ link_href = movie.link[0].href; } catch(error) {link_href = '';}
		monfilm.imageWebpath = href;
		monfilm.title = title;
		monfilm.year = productionYear;
		monfilm.href = link_href; */
		movies[i] = monfilm;
	}
	}
	}
	return movies;	
}

this.getMovie = function( code, callback)
{
	getMovie( code, callback);
}

function getMovie( code, callback)
{
	var monfilm = new Film();
	if( code != 0 ) {
	monfilm.code = code;
	allocine.api('movie', {code: code}, function(error,result) {
		if( error ) { }
		else {
		if( typeof result.movie.genre !== 'undefined' &&  result.movie.genre.length !== 0 ) {
			monfilm.genre = result.movie.genre[0].$;		
		}
		if( typeof result.movie.nationality !== 'undefined' && result.movie.nationality.length !== 0 ) {
                	monfilm.country = result.movie.nationality[0].$;
		}
		if( typeof result.movie.synopsis !== 'undefined' ) {
                	monfilm.synopsis = result.movie.synopsis;
		}
		if( typeof result.movie.synopsisShort !== 'undefined' ) {
                	monfilm.synopsisShort = result.movie.synopsisShort;
		}
		if( typeof result.movie.runtime !== 'undefined' ) {
                	monfilm.runtime = result.movie.runtime;
		}
		/*var castingShort = '';
		if( typeof result.movie.castingShort !== 'undefined' ) {
                	castingShort = result.movie.castingShort;
		}*/
		var castMember = new Array();
		if( typeof result.movie.castMember !== 'undefined' && result.movie.castMember.length !== 0 ) {
                	castMember = result.movie.castMember;
		}
		var maxdirectors = 2;
		var maxactors = 5
		var nbdirectors = 0;
		var nbactors = 0;
		for (i = 0; i < castMember.length ; i++) {
			if( typeof castMember[i].activity.$ !== 'undefined' && (castMember[i].activity.$ === 'Réalisateur' || castMember[i].activity.$ === 'Réalisatrice' ) && nbdirectors < maxdirectors ) {
				nbdirectors++;
				if( monfilm.directors === '' ) {
					monfilm.directors = castMember[i].person.name;
				} else {
					monfilm.directors += ', ' + castMember[i].person.name;
				}
			}
			if( typeof castMember[i].activity.$ !== 'undefined' && (castMember[i].activity.$ === 'Acteur' || castMember[i].activity.$ === 'Actrice' ) && nbactors < maxactors ) {
				nbactors++;
				if( monfilm.actors === '' ) {
					if( typeof castMember[i].role !== 'undefined' )
						monfilm.actors = castMember[i].person.name + " (" + castMember[i].role + ")";
					else
						monfilm.actors = castMember[i].person.name;
				} else {
					if( typeof castMember[i].role !== 'undefined' )
						monfilm.actors += ', ' + castMember[i].person.name + " (" + castMember[i].role + ")";
					else
						monfilm.actors += ', ' + castMember[i].person.name;
				}
			}
		}


		var title = '';
		if( typeof result.movie.title !== 'undefined' ) {
			title = result.movie.title;
		}
		else { 
			if( typeof result.movie.originalTitle !== 'undefined' ) {
				title = result.movie.originalTitle;
			}
		}
		
		var productionYear = '';
		if( typeof result.movie.productionYear !== 'undefined' ) {
			productionYear = result.movie.productionYear;
		}

		var href = 'http://fr.web.img4.acsta.net/r_160_240/b_1_d6d6d6/commons/emptymedia/empty_photo.jpg';
		if( typeof result.movie.poster !== 'undefined' && typeof result.movie.poster.href !== 'undefined' )
		{
			href = result.movie.poster.href;
			href = href.replace(/^(http:\/\/[^\/]*)(.*)$/g, "$1/r_160_240/b_1_d6d6d6$2");
		}
	
		var link_href = '';
		if( typeof result.movie.link[0] !== 'undefined' && typeof result.movie.link[0].href !== 'undefined' ) {
			link_href = result.movie.link[0].href;
		}
		monfilm.href = link_href;

		monfilm.imageWebpath = href;
		monfilm.title = title;
		monfilm.year = productionYear;
		
		}
		callback(monfilm);
	});
	} else { callback(monfilm); }
}

function moviesDetails(error, movies, callback)
{
	var nbMovieDetailsEvent = 0;
	if(movies.length !== 0 )
	{
		for (i = 0; i < movies.length ; i++) {
			getMovie( movies[i].code, function(movie){
				nbMovieDetailsEvent++;
				for (j = 0; j < movies.length ; j++) {
					if(  typeof movies[j] !== 'undefined' && movies[j].code === movie.code ) {
						movies[j] = movie;
						break;
					}
				}
				if( nbMovieDetailsEvent === movies.length ) {
					callback(movies);
				}
			});
		}
	}
	else
		callback(movies);
	
}

this.listseries = function( filter, saisonnumber, entityResult ) {
	var series = new Array;

		async.waterfall(
    		[
			function (callback) {
                                 allocine.api('search', {q: filter, count: 4, filter: 'tvseries'}, function(err, object) { series = searchSeries(err,object, series); callback(null, callback); });
                        },
                        function (err, callback) {
                                serieDetails(err, saisonnumber, series, function(result) { series = result; callback(null, callback); } );
                        },
                        function (err, callback) {
                                saisonDetails(err, saisonnumber,series, function(result) { series = result; callback(null, callback); } );
                        }
    		],
		function (err, object, callback) {
			entityResult(series);
		}		
		);
}

function searchSeries(error,object, series)
{
        var data = '';
	if( typeof object.feed !== 'undefined' && typeof object.feed.totalResults !== 'undefined') {
		for (i = 0; i < object.feed.totalResults ; i++) {
			var movie = object.feed.tvseries[i];
			if( movie !== null && typeof movie !== 'undefined' )
			{
				var code = '';
				if( typeof movie.code !== 'undefined' )
				        code = movie.code;
				var masaison = new Saison();
				//console.log('codeeeeeeee: '  +code);
				masaison.codeSerie = code;
				var title = '';
				try{ title = movie.title; } catch(error) {title = '';}
				if( title === '' || typeof title === 'undefined')
				try { title = movie.originalTitle;} catch(error) {title = '';}

				var href = 'http://fr.web.img4.acsta.net/r_160_240/b_1_d6d6d6/commons/emptymedia/empty_photo.jpg';
				if( typeof movie.poster !== 'undefined' && typeof movie.poster.href !== 'undefined' )
				{
				        href = movie.poster.href;
					href = href.replace(/^(http:\/\/[^\/]*)(.*)$/g, "$1/r_160_240/b_1_d6d6d6$2");
				}

				var link_href = '';
				if( typeof movie.link[0] !== 'undefined' && typeof movie.link[0].href !== 'undefined' ) {
					link_href = movie.link[0].href;
				}
				masaison.href = link_href; 

				masaison.imageWebpath = href;
				masaison.title = title;
				series[i] = masaison;
			}
		}
	}
	return series;  
}


function serieDetails(error, saisonnumber, series, callback)
{
	var nbMovieDetailsEvent = 0;
	if(series.length !== 0 )
	{
	for (i = 0; i < series.length ; i++) {
		//allocine.api('tvseries', {code: series[i].codeSerie}, function(error,result) {
		//console.log(series[i].codeSerie);
		getSerie(series[i], series[i].codeSerie, saisonnumber, function(masaison) {
			nbMovieDetailsEvent++;
			for (j = 0; j < series.length ; j++) {
				var codeSerie = masaison.codeSerie;
				
				if(  typeof series[j] !== 'undefined' && series[j].codeSerie === codeSerie ) {
					//console.log('!!!! ' + codeSerie);
					series[j] = masaison;
					break;
				}
			}
			if( nbMovieDetailsEvent === series.length ) {
				callback(series);
			}
		 });
	}
	}
	else
		callback(series);
}

var EpisodeSaison = function() {
	this.code = 0;
	this.number = 0;
	this.synopsis = '';
	this.synopsisShort = '';
	this.title = '';
}

this.getSaison = function( code, callback) {
	getSaison( code, callback);
}

function getSerie( saison, code, saisonnumber, callback ) {
	//console.log('codeeeeeeeeee1 : ' + code);
	var masaison = null;
	if( saison == null || typeof saison === 'undefined' ) {
		//console.log('newwwwwwwwwwwwwwwww');
		masaison = new Saison();
	}
	else {
		masaison = saison;
		//console.log('old');
	}
	if( code != 0 ) {
		
		allocine.api('tvseries', {code: code}, function(error,result) {
		if( error ) { }
		else {
			if(  typeof result !== 'undefined' ) {
				var genre = '';
				if( typeof result.tvseries.genre !== 'undefined' &&  result.tvseries.genre.length !== 0 )
					genre = result.tvseries.genre[0].$;
		
				var nationality = '';
				if( typeof result.tvseries.nationality !== 'undefined' && result.tvseries.nationality.length !== 0 )
		                        nationality = result.tvseries.nationality[0].$;

				var title = '';
				try{ title = result.tvseries.title; } catch(error) {title = '';}
				if( title === '' || typeof title === 'undefined')
				try { title = result.tvseries.originalTitle;} catch(error) {title = '';}

				var href = 'http://fr.web.img4.acsta.net/r_160_240/b_1_d6d6d6/commons/emptymedia/empty_photo.jpg';
				if( typeof result.tvseries.poster !== 'undefined' && typeof result.tvseries.poster.href !== 'undefined' )
				{
				        href = result.tvseries.poster.href;
					href = href.replace(/^(http:\/\/[^\/]*)(.*)$/g, "$1/r_160_240/b_1_d6d6d6$2");
				}

				var castMember = new Array();
				if( typeof result.tvseries.castMember !== 'undefined' && result.tvseries.castMember.length !== 0 ) {
					castMember = result.tvseries.castMember;
				}
				var maxdirectors = 2;
				var maxactors = 5
				var nbdirectors = 0;
				var nbactors = 0;
				for (i = 0; i < castMember.length ; i++) {
					if( typeof castMember[i].activity.$ !== 'undefined' && (castMember[i].activity.$ === 'Réalisateur' || castMember[i].activity.$ === 'Réalisatrice' ) && nbdirectors < maxdirectors ) {
						nbdirectors++;
						if( masaison.directors === '' ) {
							masaison.directors = castMember[i].person.name;
						} else {
							masaison.directors += ', ' + castMember[i].person.name;
						}
					}
					if( typeof castMember[i].activity.$ !== 'undefined' && (castMember[i].activity.$ === 'Acteur' || castMember[i].activity.$ === 'Actrice' ) && nbactors < maxactors ) {
						nbactors++;
						if( masaison.actors === '' ) {
							if( typeof castMember[i].role !== 'undefined' )
								masaison.actors = castMember[i].person.name + " (" + castMember[i].role + ")";
							else
								masaison.actors = castMember[i].person.name;
						} else {
							if( typeof castMember[i].role !== 'undefined' )
								masaison.actors += ', ' + castMember[i].person.name + " (" + castMember[i].role + ")";
							else
								masaison.actors += ', ' + castMember[i].person.name;
						}
					}
				}
				var link_href = '';
				if( typeof result.tvseries.link[0] !== 'undefined' && typeof result.tvseries.link[0].href !== 'undefined' ) {
					link_href = result.tvseries.link[0].href;
				}
				masaison.href = link_href; 

				masaison.imageWebpath = href;
				masaison.title = title;
				if( typeof result.tvseries.synopsis !== 'undefined' ) {
                			masaison.synopsis = result.tvseries.synopsis;
				}
				if( typeof result.tvseries.synopsisShort !== 'undefined' ) {
                			masaison.synopsisShort = result.tvseries.synopsisShort;
				}
				if( typeof result.tvseries.seasonCount !== 'undefined' ) {
                			masaison.seasonCount = result.tvseries.seasonCount;
				}
				if( typeof result.tvseries.yearStart !== 'undefined' ) {
                			masaison.year = result.tvseries.yearStart;
				}
				masaison.genre = genre;
				masaison.country = nationality;
				if( typeof result.tvseries.season !== 'undefined' ) {
				for (k = 0; k < result.tvseries.season.length ; k++) {
					if( typeof result.tvseries.season[k] !== 'undefined' && result.tvseries.season[k].seasonNumber == saisonnumber ) {
						masaison.code = result.tvseries.season[k].code;
						//console.log('!!!!!!!!!!!!! ' + masaison.code);
						break;
					}
				}
				}
					
	
			}
			}
			callback(masaison);
		 });

	} else { callback(masaison); }
}

this.getSaison = function( code, callback) {
	getSaisonDetails( null, code, function(masaison) {
		getSerie( masaison, masaison.codeSerie, masaison.number, callback);
	});
}

function getSaisonDetails( saison, code, callback) {
	var masaison = null;
	if( saison == null || typeof saison === 'undefined' )
		masaison = new Saison();
	else
		masaison = saison;
	if( code != 0 ) {
		//masaison.code = code;
		allocine.api('season', {code: code}, function(error,result) {
		if( error ) { }
		else {
				if(  typeof result !== 'undefined' &&  typeof result.season !== 'undefined') {
						if( typeof result.season.parentSeries !== 'undefined' && typeof result.season.parentSeries.code !== 'undefined' ) {
							masaison.codeSerie = result.season.parentSeries.code;
						}
						if( typeof result.season.seasonNumber !== 'undefined' ) {
							masaison.number = result.season.seasonNumber;
						}
						if( typeof result.season.episodeCount !== 'undefined' ) {
							masaison.episodeCount = result.season.episodeCount;
						}
						if( typeof result.season.episode !== 'undefined' ) {
						for (k = 0; k < result.season.episode.length ; k++) {
							var episodeSaison = new EpisodeSaison();
							if( typeof result.season.episode[k] !== 'undefined' ) {
							if( typeof result.season.episode[k].code !== 'undefined' ) {
								episodeSaison.code = result.season.episode[k].code;
							}
							if( typeof result.season.episode[k].episodeNumberSeason !== 'undefined' ) {
								episodeSaison.number = result.season.episode[k].episodeNumberSeason;
							}
							if( typeof result.season.episode[k].synopsis !== 'undefined' ) {
								episodeSaison.synopsis = result.season.episode[k].synopsis;
							}
							if( typeof result.season.episode[k].synopsisShort !== 'undefined' ) {
								episodeSaison.synopsisShort = result.season.episode[k].synopsisShort;
							}
							if( typeof result.season.episode[k].title !== 'undefined' ) {
								episodeSaison.title = result.season.episode[k].title;
							}
							masaison.episodes[k] = episodeSaison;
							}
						}	
						}
				}
			}
			callback(masaison);
		 });

	} else { callback(masaison); }
}

function saisonDetails(error, saisonnumber, series, callback)
{
	var nbMovieDetailsEvent = 0;
	if(series.length !== 0 )
	{
	for (i = 0; i < series.length ; i++) {
		getSaisonDetails( series[i], series[i].code, function( masaison ) {
			nbMovieDetailsEvent++;
				for (j = 0; j < series.length ; j++) {
					if(  typeof series[j] !== 'undefined' &&  typeof masaison !== 'undefined' && masaison.code == series[j].code ) {
						series[j] = masaison
						break;
					}
				}
				if( nbMovieDetailsEvent === series.length ) {
					callback(series);
				}
		 });
	}
	}
	else
		callback(series);
}

};

module.exports = onlineVideos;


