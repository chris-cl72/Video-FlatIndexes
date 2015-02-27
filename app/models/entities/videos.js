#!/usr/bin/env nodejs

//var acl = function(users, roles) {
var path = require('path');
var fs = require('fs');
var Finder = require('fs-finder');
var url = require('url');

function readConf(configFile)
{
var data = fs.readFileSync(configFile,  'utf-8');
var myObj = null;

  try {
    myObj = JSON.parse(data);
  }
  catch (err) {
    //console.log('There has been an error parsing your JSON.')
    console.log(err);
  }
  return myObj;
};

var Downloads = function(conf) {
	this.path = conf.path;
	var list = new Array();
	var files = Finder.from(this.path.toString()).findFiles('*.avi'); // $ ne semble pas supporté
        for (var i = 0, len = files.length; i < len; i++) {
		var file = files[i];
		var patt = new RegExp(/.avi$/gm);
		if( patt.test(file) ) {
			file = file.replace(this.path + "/","");
			file = file.replace(this.path,"");
                	list[list.length] = file;
		}
        }
	files = Finder.from(this.path.toString()).findFiles('*.mkv');
        for (var i = 0, len = files.length; i < len; i++) {
		var file = files[i];
                var patt = new RegExp(/.mkv$/gm);
                if( patt.test(file) ) {
                        file = file.replace(this.path + "/","");
                        file = file.replace(this.path,"");
                        list[list.length] = file;
                }
        }
	

	this.list =list;
};

var Videos = function(staticdir,conf, keywordsfilter) {
	this.path = conf.path;
	this.urlpath = conf.urlpath;	
	if( fs.existsSync(path.join(staticdir,this.urlpath)) ) 
		fs.unlinkSync(path.join(staticdir,this.urlpath));
	fs.symlinkSync(this.path, path.join(staticdir,this.urlpath));	
	var list = new Array();
        var files = Finder.from(this.path.toString()).findFiles('*.avi');
        for (var i = 0, len = files.length; i < len; i++) {
		var file = files[i];
		if( find(keywordsfilter, file) )
                {

                var patt = new RegExp(/.avi$/gm);
                if( patt.test(file) ) {
                	var film = new Film(file, this.path, this.urlpath);
			list[list.length] = film;
		}
		}
        }
	files = Finder.from(this.path.toString()).findFiles('*.mkv');
	for (var i = 0, len = files.length; i < len; i++) {
		var file = files[i];
		if( find(keywordsfilter, file) )
                {

                var patt = new RegExp(/.mkv$/gm);
                if( patt.test(file) ) {
			//var urlfilename = files[i].replace(this.path, this.urlpath);
                	var film = new Film(file, this.path, this.urlpath);
			list[list.length] = film;
		}
		}
        }

	this.list =list;
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

var Film = function(filename, filmsPath, urlfilmsPath) {

var urlFile = url.format(filename.replace(filmsPath, urlfilmsPath));
//console.log('this.urlfile : ' + urlFile);
                //urlfilename = urlfilename.replace(' ','\%20');
this.urlfile = urlFile;
this.imagefile=null;
this.file=null;
this.descfile=null;
if (fs.existsSync(filename)) {
this.file = filename;
//console.log('this.file : ' + this.file);
var imageFile = path.join( path.dirname(filename), '.' + path.basename(filename) + '.jpg');
if( fs.existsSync(imageFile) ) {
	this.imagefile = imageFile;
	this.urlimagefile = url.format(imageFile.replace(filmsPath, urlfilmsPath));
	//console.log('this.imagefile : ' + this.imagefile);
}
var index = 1;
var descFile = path.join( path.dirname(filename), '.' + path.basename(filename) + '.desc');
if (fs.existsSync(descFile)) {
this.descfile=descFile;
//console.log('this.descfile : ' + this.descfile);
var lines = fs.readFileSync(descFile).toString().split('\n'); //.forEach(
//function (line) { 
	for(i in lines) {
	var arr = lines[i].split("|");
	if( arr.length === 2 ) {
		switch(arr[0]) {
    			case 'File':
        			this.originalfile = arr[1];
				//console.log('this.originalfile : ' + this.originalfile);
        			break;
			case 'lien':
                                this.link = arr[1];
                                //console.log('this.link : ' + this.link);
                                break;
			case 'Image':
                                this.originalimage = arr[1];
				this.originalimage_large = this.originalimage.replace('r_160_240','r_640_960'); //this.originalimage.replace('r_160_240','r_320_480');
				this.originalimage_large = this.originalimage.replace('b_1_d6d6d6','b_4_dffdffdff');
                                //console.log('this.originalimage : ' + this.originalimage);
                                break;
			case 'Titre':
                                this.title = arr[1];
                                //console.log('this.title : ' + this.title);
                                break;
			case 'Genre':
                                this.genre = arr[1];
                                //console.log('this.genre : ' + this.genre);
                                break;
			case 'De':
                                this.director = arr[1];
                                //console.log('this.director : ' + this.director);
                                break;
			case 'Avec':
                                this.actors = arr[1];
                                //console.log('this.actors : ' + this.actors);
                                break;
			case 'Synopsis':
                                this.synopsis = arr[1];
                                //console.log('this.synopsis : ' + this.synopsis);
                                break;
			case 'Année':
                                this.year = arr[1];
                                //console.log('this.year : ' + this.year);
                                break;
			case 'Pays':
                                this.country = arr[1];
                                //console.log('this.country : ' + this.country);
                                break;
			case 'Runtime':
                                this.runtime = arr[1];
                                //console.log('this.runtime : ' + this.runtime);
                                break;
    			default:
		} 
	}
    }
//);
}
}


};

module.exports.films = function(staticdir, keywordsfilter) { return new Videos(staticdir,readConf(path.join(__dirname, 'videos.json')).films, keywordsfilter) };
module.exports.downloads = function() { return new Downloads(readConf(path.join(__dirname, 'videos.json')).downloads) };
//module.exports.files = new Videos(readConf(path.join(__dirname, 'videos.json')).files);
//module.exports.series = new Videos(readConf(path.join(__dirname, 'videos.json')).series);
