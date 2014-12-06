#!/usr/bin/env nodejs

var allocine = require('allocine-api');
var async = require('async');
var waterfall = require('async-waterfall');


function searchSeries(error,object, searchResult)
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
                var monfilm = new film(code);
                var title = '';
                try{ title = movie.title; } catch(error) {title = '';}
                if( title === '' || typeof title === 'undefined')
                        try { title = movie.originalTitle;} catch(error) {title = '';}
                var productionYear = '';
                try{ productionYear = movie.yearStart } catch(error) {productionYear= ''; }

                if( title !== '' && movie.productionYear !== '' )
                {
                        data += title + ' (' + productionYear + ')' + '<br/>';
                        // console.log(title +  '(' + productionYear + ')');
                }

                var href = 'http://fr.web.img4.acsta.net/r_160_240/b_1_d6d6d6/commons/emptymedia/empty_photo.jpg';
                if( typeof movie.poster !== 'undefined' && typeof movie.poster.href !== 'undefined' )
		{
                        href = movie.poster.href;
			href = href.replace(/^(http:\/\/[^\/]*)(.*)$/g, "$1/r_160_240/b_1_d6d6d6$2");
		}

                monfilm.imageWebpath = href;
                monfilm.title = title;
                monfilm.productionYear = productionYear;
               searchResult.tvseries[i] = monfilm;
        }
        }
	}
	return searchResult;
}

function serieDetails(error, object, localResult, callback)
{
        var nbMovieDetailsEvent = 0;
	/*
        if(localResult.tvseries.length !== 0 )
        {
        for (i = 0; i < localResult.tvseries.length ; i++) {
                allocine.api('tvseries', {code: localResult.tvseries[i].code}, function(error,result) {
                        nbMovieDetailsEvent++;
                        for (j = 0; j < localResult.tvseries.length ; j++) {
                        if(  localResult.tvseries[j].code === result.movie.code ) {
                        var genre = '';
                        var nationality = '';
                        if( typeof result.movie.genre !== 'undefined' &&  result.movie.genre.length !== 0 )
                                genre = result.movie.genre[0].$;
                        if( typeof result.movie.nationality !== 'undefined' && result.movie.nationality.length !== 0 )
                                nationality = result.movie.nationality[0].$;

                        localResult.tvseries[j].genre = genre;
                        localResult.tvseries[j].nationality = nationality;
                        break;
                        }
                        }
                        if( nbMovieDetailsEvent === localResult.tvseries.length ) {
                                callback(localResult);
                        }
                 });
        }
        }
        else*/
                callback(localResult);
}

var film = function (code)
{
        this.code = code;
        this.title = '';
        this.productionYear = '';
        this.imageWebpath = '';
        this.imageLocalpath = '';
        this.genre = '';
        this.nationality = '';
        this.href = '';
/*
this.originalfile //File
this.link //lien
this.originalimage //Image
this.title //Titre
this.genre //Genre
this.director //De
this.actors //Avec
this.synopsis //Synopsis
this.year //Année
this.country //Pays
this.runtime //Runtime*/
};

var SearchResult = function()
{
        this.movies = new Array;
        this.tvseries = new Array;
};

var OnlineVideos = function()
{
	var searchResult = new SearchResult();
	//this.movies = new Array;
	//this.tvseries = new Array;
	this.searchAllocine = function(value, entityResult) {
		async.waterfall(
                [
                        function(callback) {
                                allocine.api('search', {q: value, count: 4, filter: 'movie'}, function(err, object) { /*localResult = */searchMovies(err,object, searchResult, callback);/* callback(null,localResult);*/ });
                        },
                        function (localResult, callback) {
                                searchMovieDetails(localResult, callback);  
                        }/*,
                        function (err, object, callback) {
                                 allocine.api('search', {q: req.param('search'), count: 4, filter: 'tvseries'}, function(err, object) { searchResult = searchSeries(err,object, searchResult); callback(null, object, callback); });
                        },
                        function (err, object, callback) {
                                serieDetails(err, object, searchResult, function(result) { searchResult = result; callback(null, object, callback); } );
                        }*/
                ],
                function (err, result) {
                        entityResult(result);
                }
                );

	}


function searchMovies(error,object, searchResult, callback)
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
                var monfilm = new film(code);
                var title = '';
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
                monfilm.productionYear = productionYear;
                monfilm.href = link_href;
                searchResult.movies[i] = monfilm;
        }
        }
        }
	callback(null, searchResult);
        //return searchResult;
}

/*function searchMovieDetails(error, object, localResult, callback)
{
        var nbMovieDetailsEvent = 0;
        if(localResult.movies.length !== 0 )
        {
        for (i = 0; i < localResult.movies.length ; i++) {
                allocine.api('movie', {code: localResult.movies[i].code}, function(error,result) {
                        nbMovieDetailsEvent++;
                        //console.log(result);
                        for (j = 0; j < localResult.movies.length ; j++) {
                        if(  localResult.movies[j].code === result.movie.code ) {
                        var genre = '';
                        var nationality = '';
                        if( typeof result.movie.genre !== 'undefined' &&  result.movie.genre.length !== 0 )
                                genre = result.movie.genre[0].$;
                        if( typeof result.movie.nationality !== 'undefined' && result.movie.nationality.length !== 0 )
                                nationality = result.movie.nationality[0].$;

                        localResult.movies[j].genre = genre;
                        localResult.movies[j].nationality = nationality;
                        break;
                        }
                        }
                        if( nbMovieDetailsEvent === localResult.movies.length ) {
                                callback(localResult);
                        }
                 });
        }
        }
        else
                callback(localResult);
}*/

function movieDetails(localResult, j, result, callback)
{
	var genre = '';
        var nationality = '';
        if( typeof result.movie.genre !== 'undefined' &&  result.movie.genre.length !== 0 )
        	genre = result.movie.genre[0].$;
        if( typeof result.movie.nationality !== 'undefined' && result.movie.nationality.length !== 0 )
        	nationality = result.movie.nationality[0].$;

        localResult.movies[j].genre = genre;
        localResult.movies[j].nationality = nationality;
	callback();
}

function doThingsWith(arrayItem, lastItemResult)
{
	return lastItemResult;
}
function searchMovieDetails(localResult, mycallback) {
        if(localResult.movies.length !== 0 )
        {	
		/*async.waterfall(
                [
                        function(callback) {
				allocine.api('movie', {code: localResult.movies[0].code}, function(error,result) { movieDetails(localResult,0,result, callback);});},
			function(localResult,callback)  {
                                allocine.api('movie', {code: localResult.movies[1].code}, function(error,result) { movieDetails(localResult,1,result, callback);});}
                ],
                function (err, result) {
                        mycallback(err,result);
                }
                );*/

		/*var myArray = [1,2,3];
		var myResult = 1;
		waterfall(myArray.map(function (arrayItem) {
  			return function (nextCallback) {
    				myResult *= arrayItem;
    				nextCallback();
			}}), function (err) {
		});*/

		var i = 0;
                waterfall(localResult.movies.map(function (arrayItem) {
                        return function (nextCallback) {
				allocine.api('movie', {code: arrayItem.code}, function(error,result) { movieDetails(localResult,i,result, nextCallback); i=i+1;});
                        }}), function (err) {
			mycallback(err, localResult);
                });	
        }
        else
                mycallback(null, localResult);
}


};

module.exports = OnlineVideos;

var        onlineVideos = new OnlineVideos();
                onlineVideos.searchAllocine('black', function(list) {
                        console.log(list.movies);
                });

