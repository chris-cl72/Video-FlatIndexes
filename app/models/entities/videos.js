#!/usr/bin/env nodejs

var path = require('path');
var Finder = require('fs-finder');
var url = require('url');

var fs = require('fs');
var path = require('path');
eval(fs.readFileSync(path.join(__dirname, '../../libraries/tools.js'))+'');

var Film = require(path.join(__dirname, './film.js'));
var Saison = require(path.join(__dirname, './serie.js'));

var Videos = function() {

this.listDownload = function(currentpath) {
	//console.log(conf);
	//var currentpath = conf.path;
	var list = new Array();
	var files = Finder.from(currentpath.toString()).findFiles('*.avi'); // $ ne semble pas supporté
        for (var i = 0, len = files.length; i < len; i++) {
		var file = files[i];
		var patt = new RegExp(/.avi$/gm);
		//var patt1 = new RegExp(/.mkv$/gm);
		if( patt.test(file) ) { //|| patt1.test(file) ) {
			file = file.replace(currentpath + "/","");
			file = file.replace(currentpath,"");
                	list[list.length] = encodeURIComponent(file);
		}
        }
	files = Finder.from(currentpath.toString()).findFiles('*.mkv');
        for (var i = 0, len = files.length; i < len; i++) {
		var file = files[i];
                var patt = new RegExp(/.mkv$/gm);
                if( patt.test(file) ) {
                        file = file.replace(currentpath + "/","");
                        file = file.replace(currentpath,"");
			file = encodeURIComponent(file);
                        list[list.length] = file;
                }
        }
	return list;
};

this.importfilm = function( file, film, callback ) {
	var imageFile = path.join( path.dirname(file), '.' + path.basename(file) + '.jpg');
	var srcimageWebpath = film.imageWebpath.replace('r_160_240','r_640_960');
	srcimageWebpath = srcimageWebpath.replace('b_1_d6d6d6','b_4_dffdffdff')
	downloadfile(srcimageWebpath, imageFile, function(){
  		film.imageFile = imageFile;
		film.write(file, callback);
	});
}

this.importserie = function( dir, saison, callback ) {
	var imageFile = path.join( dir, '.' + path.basename(dir) + '.jpg');
	var srcimageWebpath = saison.imageWebpath.replace('r_160_240','r_640_960');
	srcimageWebpath = srcimageWebpath.replace('b_1_d6d6d6','b_4_dffdffdff')
	downloadfile(srcimageWebpath, imageFile, function(){
  		saison.imageFile = imageFile;
		saison.write(dir, callback);
	});
}

/*function downloadfile(urlfile, filedest, cb, callback) {
	var file = fs.createWriteStream(filedest);
	var request = http.get(urlfile, function(response) { 
		response.pipe(file);
		file.on('finish', function() { 
			file.close(cb);
			callback();
		});
	});
};*/  

var downloadfile = function(uri, filename, callback){
    var request = require('request');
    request.head(uri, function(err, res, body){
    //console.log('content-type:', res.headers['content-type']);
    //console.log('content-length:', res.headers['content-length']);

    request(uri).pipe(fs.createWriteStream(filename)).on('close', callback);
  });
};


this.listfilms = function(staticdir,conf, keywordsfilter) {
	var currentpath = conf.path;
	var urlpath = conf.urlpath;	
	// A revoir ????
	if( fs.existsSync(path.join(staticdir,urlpath)) ) 
		fs.unlinkSync(path.join(staticdir,urlpath));
	fs.symlinkSync(currentpath, path.join(staticdir,urlpath));	
	// ----    ????
	var list = new Array();
	var filmsByDate = {};
	var arrayDate = [];

        var files = Finder.from(currentpath.toString()).findFiles('*.avi');
        for (var i = 0, len = files.length; i < len; i++) {
		var file = files[i];
		var filterFound = false;
		if( find(keywordsfilter, path.basename(file)) )
			 filterFound = true;

                var patt = new RegExp(/.avi$/gm);
                if( patt.test(file) ) {
                	var film = new Film();
			film.read(file, currentpath, urlpath);
			if( filterFound === true || find(keywordsfilter,film.synopsis) || find(keywordsfilter,film.actors) || find(keywordsfilter,film.director) ||  find(keywordsfilter,film.country) ||  find(keywordsfilter,film.title)) {
				list[list.length] = film;
				if( fs.existsSync(film.file) ) {
					arrayDate[i] = new Date(fs.statSync(film.file).mtime).toISOString() + "-" + film.file;
					filmsByDate[arrayDate[i]] = film;
				}
			}
		}
        }
	files = Finder.from(currentpath.toString()).findFiles('*.mkv');
	for (var i = 0, len = files.length; i < len; i++) {
		var file = files[i];
		var filterFound = false;
		if( find(keywordsfilter, path.basename(file)) )
			filterFound = true;	

                var patt = new RegExp(/.mkv$/gm);
                if( patt.test(file) ) {
                	var film = new Film();
			film.read(file, currentpath, urlpath);
			if( filterFound === true || find(keywordsfilter,film.synopsis) || find(keywordsfilter,film.actors) || find(keywordsfilter,film.directors) ||  find(keywordsfilter,film.country) ||  find(keywordsfilter,film.title)) {
				list[list.length] = film;
				if( fs.existsSync(film.file) ) {
					arrayDate[i] = new Date(fs.statSync(film.file).mtime).toISOString() + "-" + film.file;
					filmsByDate[arrayDate[i]] = film;
				}
			}
		}
        }
	var lastFilms = [];

	arrayDate.sort().reverse();
	for (var i = 0, len = arrayDate.length; i < len; i++) {
		lastFilms[lastFilms.length] = filmsByDate[arrayDate[i]];
	}
	return lastFilms;

	//return list;
};

var find = function(keywords, instring) {
	if( keywords === "" )
		return true;
	var keywordslist = keywords.split(" ");
	for(i in keywordslist) {
		var patt = new RegExp( keywordslist[i], "gi");
                if( !patt.test(instring) ) {
			return false;	
		}
	}
	return true;
};

this.listsaisons = function(staticdir,conf, keywordsfilter) {
	//console.log('staticdir: ' + staticdir + ', conf: ' + conf + ', keywordsfilter: ' + keywordsfilter);
	var currentpath = conf.path;
	var urlpath = conf.urlpath;	
	// A revoir ????
	if( fs.existsSync(path.join(staticdir,urlpath)) ) 
		fs.unlinkSync(path.join(staticdir,urlpath));
	fs.symlinkSync(currentpath, path.join(staticdir,urlpath));	
	// ----    ????
	var list = new Array();
	var seriesByDate = {};
	var arrayDate = [];

	//console.log('!!!!!!! ' + currentpath);
        var files = Finder.from(currentpath.toString()).showSystemFiles().findFiles('*.desc');
	//console.log('!!!!!!!!!! ' + files.length);
        for (var i = 0, len = files.length; i < len; i++) {
		var file = files[i];
		//console.log('!!!!!!!!!! ' + file);
		var filterFound = false;
		if( find(keywordsfilter, path.basename(file)) )
			 filterFound = true;

                var patt = new RegExp(/.desc$/gm);
                if( patt.test(file) ) {
                	var saison = new Saison();
			//console.log('file: ' + file + ', currentpath: ' + currentpath + ', urlpath: ' + urlpath);
			saison.read(file, currentpath, urlpath);
			if( filterFound === true || find(keywordsfilter,saison.synopsis) || find(keywordsfilter,saison.actors) || find(keywordsfilter,saison.directors) ||  find(keywordsfilter,saison.country) ||  find(keywordsfilter,saison.title)) {
				list[list.length] = saison;
				if( fs.existsSync(saison.descfile) ) {
					arrayDate[i] = new Date(fs.statSync(saison.descfile).mtime).toISOString() + "-" + saison.descfile;
					seriesByDate[arrayDate[i]] = saison;
				}
				else if ( fs.existsSync( saison.dir ) ) {
					arrayDate[i] = new Date(fs.statSync(saison.dir).mtime).toISOString() + "-" + saison.dir;
					seriesByDate[arrayDate[i]] = saison;
				}
			}
		}
        }
	var lastseries = [];
	arrayDate.sort().reverse();
	for (var i = 0, len = arrayDate.length; i < len; i++) {
		lastseries[lastseries.length] = seriesByDate[arrayDate[i]];
	}
	return lastseries;
	//return list;
};

var find = function(keywords, instring) {
	if( keywords === "" )
		return true;
	var keywordslist = keywords.split(" ");
	for(i in keywordslist) {
		var patt = new RegExp( keywordslist[i], "gi");
                if( !patt.test(instring) ) {
			return false;	
		}
	}
	return true;
};

	
}


/*function callDataEntitie(name) {
        var path =__dirname + '/../entities';
        return require(path + '/' + name);
}*/

module.exports = Videos;

