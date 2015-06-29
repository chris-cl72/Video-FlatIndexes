#!/usr/bin/env nodejs

var fs = require('fs');
var path = require('path');
eval(fs.readFileSync(path.join(__dirname, '../libraries/tools.js'))+'');

var Videos = require(path.join(__dirname, 'entities/videos.js'));
var staticconf_downloads = readConf(path.join(__dirname, '../models/entities/videos.json')).downloads;
var staticconf_films = readConf(path.join(__dirname, '../models/entities/videos.json')).films;
var LocalDownloads = function() {
	this.path = staticconf_downloads.path;
	this.filmspath = staticconf_films.path;
	this.list = null;

	this.setpath = function(refpath) {
		this.path = refpath;
	}

	this.setfilmspath = function(refpath) {
		this.filmspath = refpath;
	}

	this.readall = function() {
		var videos = new Videos();
		//var staticconf = readConf(path.join(__dirname, '../models/entities/videos.json')).downloads;
		this.list = videos.listDownload(staticconf_downloads);
	}

	this.rename = function(oldfile, newfile, callback) {
		var oldfilepath = this.path + '/' + decodeURIComponent(oldfile);
		var newfilepath = this.path + '/' + decodeURIComponent(newfile);
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
			var destfile = path.join(destdir, filename);
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
			
		}
	}
};

module.exports = LocalDownloads;
