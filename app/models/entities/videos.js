#!/usr/bin/env nodejs

var path = require('path');
var Finder = require('fs-finder');
var url = require('url');

var fs = require('fs');
var path = require('path');
eval(fs.readFileSync(path.join(__dirname, '../../libraries/tools.js'))+'');

var Film = require(path.join(__dirname, './film.js'));

var Videos = function() {

this.listDownload = function(conf) {
	var currentpath = conf.path;
	var list = new Array();
	var files = Finder.from(currentpath.toString()).findFiles('*.avi'); // $ ne semble pas supporté
        for (var i = 0, len = files.length; i < len; i++) {
		var file = files[i];
		var patt = new RegExp(/.avi$/gm);
		if( patt.test(file) ) {
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

this.listfilms = function(staticdir,conf, keywordsfilter) {
	var currentpath = conf.path;
	var urlpath = conf.urlpath;	
	// A revoir ????
	if( fs.existsSync(path.join(staticdir,urlpath)) ) 
		fs.unlinkSync(path.join(staticdir,urlpath));
	fs.symlinkSync(currentpath, path.join(staticdir,urlpath));	
	// ----    ????
	var list = new Array();
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
			if( filterFound === true || find(keywordsfilter,film.synopsis) || find(keywordsfilter,film.actors) || find(keywordsfilter,film.director) ||  find(keywordsfilter,film.country) ||  find(keywordsfilter,film.title))
				list[list.length] = film;
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
			if( filterFound === true || find(keywordsfilter,film.synopsis) || find(keywordsfilter,film.actors) || find(keywordsfilter,film.director) ||  find(keywordsfilter,film.country) ||  find(keywordsfilter,film.title))
				list[list.length] = film;
		}
        }

	return list;
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

