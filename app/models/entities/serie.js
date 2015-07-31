#!/usr/bin/env nodejs

var url = require('url');
var Finder = require('fs-finder');
var fs = require('fs');
var path = require('path');
eval(fs.readFileSync(path.join(__dirname, '../../libraries/tools.js'))+'');


var EpisodeSaison = function() {
	this.code = 0;
	this.number = 0;
	this.synopsis = '';
	this.synopsisShort = '';
	this.title = '';
	this.file = '';
	//this.runtime = '';
}

var Saison = function() {
this.episodes = new Array();
this.href = '';
this.dir = '';
this.code = 0;
this.codeSerie = 0;
this.number = 0;
this.episodeCount = 0;
this.year = '';
this.imageWebpath = '';
this.imageFile = '';
this.synopsis = '';
this.synopsisShort = '';
this.genre='unclassed';
this.directors='';
this.actors='';
this.country='';

this.write = function(dir, callback) {
	var patt = new RegExp('^.*_(VOSTFR).*$','gi');
	var vostfr = '';
	if( patt.test(dir) ) 
		vostfr = ' [VOSTFR]';
	var destdescFile = path.join( dir, '.' + path.basename(dir) + '.desc');
	this.dir = dir;
	this.descfile = destdescFile;

	var data = '';
	data += 'lien|' + this.href + '\n';
	data += 'Image|' + this.imageWebpath + '\n';
	data += 'Titre|' + this.title + vostfr + '\n';
	data += 'Genre|' + this.genre + '\n';
	data += 'De|' + this.directors + '\n';
	data += 'Avec|' + this.actors + '\n';
	data += 'Synopsis|' + this.synopsis + '\n';
	data += 'SynopsisShort|' + this.synopsisShort + '\n';
	data += 'Année|' + this.year + '\n';
	data += 'Pays|' + this.country + '\n';
	data += 'Code|' + this.code + '\n';
	data += 'CodeSerie|' + this.codeSerie + '\n';
	data += 'SaisonNumber|' + this.number + '\n';
	data += 'EpisodeCount|' + this.episodeCount + '\n';
	var saisonnumbertxt = '';
	if( this.number > 9 ) { saisonnumbertxt = this.number; }
	else saisonnumbertxt = '0' + this.number;

	for (i = 0; i < this.episodes.length ; i++) {
		data += 'Episode' + this.episodes[i].number + '.' + 'Title|' + this.episodes[i].title + '\n';	
		data += 'Episode' + this.episodes[i].number + '.' + 'Synopis|' + this.episodes[i].synopsis + '\n'; 
		data += 'Episode' + this.episodes[i].number + '.' + 'SynopisShort|' + this.episodes[i].synopsisShort + '\n';
		data += 'Episode' + this.episodes[i].number + '.' + 'Code|' + this.episodes[i].code + '\n';	
		data += 'Episode' + this.episodes[i].number + '.' + 'Number|' + this.episodes[i].number + '\n';	
		var numbertxt = '';
		if( this.episodes[i].number > 9 ) { numbertxt = this.episodes[i].number; }
		else numbertxt = '0' + this.episodes[i].number;

		var files = Finder.from(dir.toString()).findFiles('*.avi'); 
        	for (var j = 0, len = files.length; j < len; j++) {
			var file = files[j];
			var patt = new RegExp('^.*S' + saisonnumbertxt + 'E' + numbertxt + '.*\.avi$','gi');
			if( patt.test(file) ) {
				data += 'Episode' + this.episodes[i].number + '.' + 'File|' + path.basename(file) + '\n';
			}
		}
		files = Finder.from(dir.toString()).findFiles('*.mkv'); 
        	for (var j = 0, len = files.length; j < len; j++) {
			var file = files[j];
			var patt = new RegExp('^.*S' + saisonnumbertxt + 'E' + numbertxt + '.*\.mkv$','gi');
			if( patt.test(file) ) {
				data += 'Episode' + this.episodes[i].number + '.' + 'File|' + path.basename(file) + '\n';
			}
		}
	}
	// Création du fichier destdescFile		
	fs.writeFile(destdescFile,data,function(err) { 
		if( err ) {
			//console.log(err);
			callback(err);
		} else {
			console.log('File ' + destdescFile + ' was created !');
			callback(null);
		}
	});	
};

this.read = function(filename, filmsPath, urlfilmsPath) {

var urlFile = url.format(filename.replace(filmsPath, urlfilmsPath));
this.urlfile = urlFile;
if (fs.existsSync(filename)) {
this.file = filename;

var imageFile = path.join( path.dirname(filename), '.' + path.basename(filename) + '.jpg');
if( fs.existsSync(imageFile) ) {
	this.imagefile = imageFile;
	this.urlimagefile = url.format(imageFile.replace(filmsPath, urlfilmsPath));
}
var index = 1;
var descFile = path.join( path.dirname(filename), '.' + path.basename(filename) + '.desc');
if (fs.existsSync(descFile)) {
this.descfile=descFile;
var lines = fs.readFileSync(descFile).toString().split('\n');
	for(i in lines) {
	var arr = lines[i].split("|");
	if( arr.length === 2 ) {
		switch(arr[0]) {
    			/*case 'File':
        			this.originalfile = arr[1];
        			break;*/
			case 'lien':
                                this.href = arr[1];
                                break;
			case 'Image':
				var originalimage = arr[1];
				this.imageWebpath = originalimage.replace('r_160_240','r_640_960');
				this.imageWebpath = this.imageWebpath.replace('b_1_d6d6d6','b_4_dffdffdff');
                                break;
			case 'Titre':
                                this.title = arr[1];
                                break;
			case 'Genre':
                                this.genre = arr[1];
                                break;
			case 'De':
                                this.directors = arr[1];
                                break;
			case 'Avec':
                                this.actors = arr[1];
                                break;
			case 'Synopsis':
                                this.synopsis = arr[1];
                                break;
			case 'SynopsisShort':
                                this.synopsisShort = arr[1];
                                break;
			case 'Année':
                                this.year = arr[1];
                                break;
			case 'Pays':
                                this.country = arr[1];
                                break;
			case 'Code':
                                this.code = arr[1];
                                break;
			case 'CodeSerie':
                                this.codeSerie = arr[1];
                                break;
			case 'EpisodeCount':
                                this.episodeCount = arr[1];
                                break;
			case 'SaisonNumber':
                                this.number = arr[1];
                                break;
			/*case 'Runtime':
                                this.runtime = arr[1];
                                break;*/
			case 'Groups':
                                this.groups = arr[1];
                                break;
    			default:
			} 
		}
	}
    }
}


};

}

module.exports = Saison;
