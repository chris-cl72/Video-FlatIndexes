#!/usr/bin/env nodejs

var fs = require('fs');
var path = require('path');
eval(fs.readFileSync(path.join(__dirname, '../libraries/tools.js'))+'');

var Videos = require(path.join(__dirname, 'entities/videos.js'));
var staticconf_downloads = readConf(path.join(__dirname, '../models/entities/videos.json')).downloads;
var staticconf_films = readConf(path.join(__dirname, '../models/entities/videos.json')).films;
var staticconf_series = readConf(path.join(__dirname, '../models/entities/videos.json')).series;

var LocalDownloads = function() {
	this.path = staticconf_downloads.path;
	this.filmspath = staticconf_films.path;
	this.seriespath = staticconf_series.path;
	this.list = null;

	this.setpath = function(refpath) {
		this.path = refpath;
	}

	this.setfilmspath = function(refpath) {
		this.filmspath = refpath;
	}

	this.setseriespath = function(refpath) {
		this.seriespath = refpath;
		
	}

	this.readall = function() {
		var videos = new Videos();
		//var staticconf = readConf(path.join(__dirname, '../models/entities/videos.json')).downloads;
		this.list = videos.listDownload(this.path);
	}

	this.rename = function(oldfile, newfile, callback) {
		var oldfilepath = this.path + '/' + oldfile;
		var newfilepath = this.path + '/' + newfile;
		console.log('Moving "' +  oldfilepath + '" into "' + newfilepath + '" ...');
		fs.rename(oldfilepath, newfilepath, function() {
			callback(oldfilepath, newfilepath);
		});
	}

	this.importFilm = function(filename, film, callback) {
		var videos = new Videos();
		var srcfile = path.join(this.path, filename);
		var destdir = path.join(this.filmspath, 'genre');
		
		if( fs.existsSync(srcfile) ) {
			ensureExists(destdir, 0744, function(err) {
			destdir = path.join(destdir, film.genre);
			var destfile = path.join(destdir, path.basename(filename));
			ensureExists(destdir, 0744, function(err) {
    				if (err) {
					console.log('Cannot create dir : "' +  destdir + '"');
					callback(err);
				}
    				else {
					console.log('Moving "' +  srcfile + '" into "' + destfile + '" ...');

					var source = fs.createReadStream(srcfile);
					var dest = fs.createWriteStream(destfile);
					source.pipe(dest);
					source.on('end', function() {
						fs.unlink(srcfile, function (err) {
	  						if (err) {
								console.log('Error moving file "' +  srcfile + '".');
								callback(err);
							} else {
								console.log('File "' +  srcfile + '" successfully moved');
								if( film.genre !== 'unclassed' ) { 
									videos.importfilm(destfile, film, callback);
								} else {
									callback(null);
								}
							}						
						}); 						
					});
					source.on('error', function(err) { callback(err); });
				}
			});
			});
			
		}else callback(null);
	}

	this.importSerie = function(filename, masaison, callback) {
		var videos = new Videos();
		var srcfile = path.join(this.path, filename);
		console.log('!!!!!!!!!!!!! srcfile: ' + srcfile);
		var destdir = '';
		if( masaison.genre !== 'unclassed' ) { 
			var destdirname = path.basename(filename);
			var vostfr = '';
			var patt = new RegExp('^.*S[0-9]{1,2}E[0-9]{1,2}_(VOSTFR).*$','gi');
			if( patt.test(destdirname) ) 
				vostfr = '_VOSTFR';
			destdirname = destdirname.replace(/([^_]*)_.*/,'$1');

			var saisonname = '_saison' + masaison.number;
			destdir = path.join(this.seriespath, destdirname + saisonname + vostfr);
		} else {
			destdir = path.join(this.seriespath, 'unclassed');
		}

		
		if( fs.existsSync(srcfile) ) {
			ensureExists(destdir, 0744, function(err) {
			var destfile = path.join(destdir, path.basename(filename));
			
    				if (err) {
					console.log('Cannot create dir : "' +  destdir + '"');
					callback(err);
				}
    				else {
					console.log('Moving "' +  srcfile + '" into "' + destfile + '" ...');

					var source = fs.createReadStream(srcfile);
					var dest = fs.createWriteStream(destfile);
					source.pipe(dest);
					source.on('end', function() {
						fs.unlink(srcfile, function (err) {
	  						if (err) {
								console.log('Error moving file "' +  srcfile + '".');
								callback(err);
							} else {
								console.log('File "' +  srcfile + '" successfully moved');
								if( masaison.genre !== 'unclassed' ) { 
									videos.importserie(destdir, masaison, callback);
								} else {
									callback(null);
								}
							}						
						}); 						
					});
					source.on('error', function(err) { callback(err); });
				}
			});
			
		} else callback(null);
	}
};

module.exports = LocalDownloads;
