var allocine = require('allocine-api');
var async = require('async');

//var SearchOnline = function(staticdir) {

//module.exports = function(app, req, entityResult) {
var onlineVideos = function() {
this.listmovies = function( filter, entityResult ) {
	//var searchResult = new searchResult();
	var movies = new Array;

		async.waterfall(
    		[
        		function(callback) {
				allocine.api('search', {q: filter, count: 4, filter: 'movie'}, function(err, object) { movies = searchMovies(err,object, movies); callback(null, object, callback); });
        		},
			function (err, object, callback) {
				movieDetails(err, object, movies, function(result) {movies = result; callback(null, object, callback); } );
			}
    		],
		function (err, object, callback) {
			entityResult(movies);
		}		
		);
}
	//}

/*module.exports = function(app, req, entityResult) {

        var searchResult = new searchResult();
        if( req.method === 'GET' )
                entityResult(null);
        if(req.method === 'POST' )
        {
                async.waterfall(
                [
                        function(callback) {
                                allocine.api('search', {q: req.param('search'), count: 4, filter: 'movie'}, function(err, object) { searchResult = searchMovies(err,object, searchResult); callback(null, object, callback); });
                        },
                        function (err, object, callback) {
                                movieDetails(err, object, searchResult, function(result) {searchResult = result; callback(null, object, callback); } );
                        },
                        function (err, object, callback) {
                                 allocine.api('search', {q: req.param('search'), count: 4, filter: 'tvseries'}, function(err, object) { searchResult = searchSeries(err,object, searchResult); callback(null, object, callback); });
                        },
                        function (err, object, callback) {
                                serieDetails(err, object, searchResult, function(result) { searchResult = result; callback(null, object, callback); } );
                        }
                ],
                function (err, object, callback) {
                        entityResult(searchResult);
                }
                );
        }
*/


function searchMovies(error,object, movies)
{
	var data = '';
	if( typeof object.feed !== 'undefined' && typeof object.feed.totalResults !== 'undefined') {
//console.log("2");	
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
		//console.log(movie.link);
		try{ link_href = movie.link[0].href; } catch(error) {link_href = '';}
		monfilm.imageWebpath = href;
		monfilm.title = title;
		monfilm.year = productionYear;
		monfilm.href = link_href; 
		movies[i] = monfilm;
	}
	}
	}
	return movies;	
}

function movieDetails(error, object, movies, callback)
{
	var nbMovieDetailsEvent = 0;
	if(movies.length !== 0 )
	{
	for (i = 0; i < movies.length ; i++) {
		allocine.api('movie', {code: movies[i].code}, function(error,result) {
			nbMovieDetailsEvent++;
			//console.log(result);
			for (j = 0; j < movies.length ; j++) {
			if(  movies[j].code === result.movie.code ) {
			var genre = '';
			var nationality = '';
			if( typeof result.movie.genre !== 'undefined' &&  result.movie.genre.length !== 0 )
				genre = result.movie.genre[0].$;		
			if( typeof result.movie.nationality !== 'undefined' && result.movie.nationality.length !== 0 )
                                nationality = result.movie.nationality[0].$;

			movies[j].genre = genre;	
			movies[j].country = nationality;
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
                //console.log(monfilm);
        }
        }
	}
	return searchResult;
        //_entityResult(_searchResult);   
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


function film(code)
{
	this.code = code;
	this.title = '';
	this.year = '';
	this.imageWebpath = '';
	this.imageLocalpath = '';
	this.genre = '';
	this.country = '';
	this.href = '';
}

function searchResult()
{
	this.movies = new Array;
	this.tvseries = new Array;
}

};

module.exports = onlineVideos;
