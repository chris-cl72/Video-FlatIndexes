#!/usr/bin/env nodejs

var url = require('url');

var fs = require('fs');
var path = require('path');
eval(fs.readFileSync(path.join(__dirname, '../../libraries/tools.js'))+'');

var Film = function() {
//this.urlfile = '';
this.imagefile='';
this.file='';
this.descfile='';
//this.originalfile='';
//this.link='';
/*this.originalimage='';
this.originalimage_large='';*/
this.title='';
this.genre='unclassed';
this.directors='';
this.actors='';
this.synopsis='';
this.year='';
this.country='';
this.runtime='';
this.code = '';
this.href = '';
this.groupŝ = '';
this.imageWebpath = '';

this.write = function(file, callback) {
	var destdescFile = path.join( path.dirname(file), '.' + path.basename(file) + '.desc');
	this.file = file;
	this.descfile = destdescFile;

	var data = '';
	data += 'File|' + this.file + '\n';
	data += 'lien|' + this.href + '\n';
	data += 'Image|' + this.imageWebpath + '\n';
	data += 'Titre|' + this.title + '\n';
	data += 'Genre|' + this.genre + '\n';
	data += 'De|' + this.directors + '\n';
	data += 'Avec|' + this.actors + '\n';
	data += 'Synopsis|' + this.synopsis + '\n';
	data += 'Année|' + this.year + '\n';
	data += 'Pays|' + this.country + '\n';

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
// console.log( 'filename: ' + filename + ',filmsPath: ' + filmsPath + ', urlfilmsPath: ' + urlfilmsPath);
// filename: /home/chris/Vidéos/films/genre/unclassed/Knight.Rusty.mkv,filmsPath: /home/chris/Vidéos/films, urlfilmsPath: files/films

var urlFile = url.format(filename.replace(filmsPath, urlfilmsPath));
this.urlfile = urlFile;
/*this.imagefile=null;
this.file=null;
this.descfile=null;*/
if (fs.existsSync(filename)) {
this.file = filename;
//console.log('this.file : ' + this.file);
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
    			case 'File':
        			this.originalfile = arr[1];
        			break;
			case 'lien':
                                this.href = arr[1];
                                break;
			case 'Image':
                                /*this.originalimage = arr[1];
				this.originalimage_large = this.originalimage.replace('r_160_240','r_640_960'); //this.originalimage.replace('r_160_240','r_320_480');
				this.originalimage_large = this.originalimage.replace('b_1_d6d6d6','b_4_dffdffdff');*/
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
			case 'Année':
                                this.year = arr[1];
                                break;
			case 'Pays':
                                this.country = arr[1];
                                break;
			case 'Runtime':
                                this.runtime = arr[1];
                                break;
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

module.exports = Film;
