#!/usr/bin/env nodejs

var fs = require('fs');
var path = require('path');

var LocalVideos = require(__dirname + '/app/models/localVideos.js');
var LocalDownloads = require(__dirname + '/app/models/localDownloads.js');
var OnlineVideos =  require(__dirname + '/app/models/onlineVideos.js');

var srcdir = '';
var destdir = '';
process.argv.forEach(function(val, index, array) {
	if( index == 2 ) 
		srcdir=val;
	if( index == 3 ) {
		destdir=val;
		importFilms(srcdir, destdir);
	}
});

function suggestVideoFilename(orifinalFilename)
{
	var str = orifinalFilename;
	var filename = str.replace(/.*\//g,"");
    var basename = filename.replace(/\.[^.]*$/g,"");
    var extension = filename.replace(/.*\./g,"");
	//var shortbasename = basename.replace(/_[a-zA-Z0-9]*/g,"");
        //var extend = shortbasename.replace(/.*_/g,"");
        //if( extend !== "" && extend !== shortbasename )
        //	extend = "_" + extend;
        //else
        //	extend = "";
	var shortbasename = basename;
	var extend = "";
var txt = shortbasename.replace(/\[[^\]]*\]/g,"");
txt=txt.trim();
txt = txt.replace(new RegExp(" ", "g"),".");

for (var i = 0; i <= 99; i++) {
    var iString = i.toString();
    if( iString.length == 1 )
	iString = "0" + iString;
    var reg=new RegExp("\\.20" + iString + "\\.", "g");
    txt = txt.replace(reg,".");
    reg=new RegExp("\\.20" + iString + "$", "g");
    txt = txt.replace(reg,".");
}

var keywords = ["WEBRip","dvd", "brrip", "bdrip", "xvid", "truefrench","stv","x264","fastsub","web-dl","ld","ac3","hdtv"];
for (var i = 0; i < keywords.length; i++)
{
	var reg=new RegExp("\\." + keywords[i] + "[^.]*\\.", "gi");
	txt = txt.replace(reg,".");
	reg=new RegExp("\\." + keywords[i] + "[^.]*$", "gi");
        txt = txt.replace(reg,"."); 
}

var keywordsSolo = ["french"];
for (var i = 0; i < keywordsSolo.length; i++)
{
        var reg=new RegExp("\\." + keywordsSolo[i] + "\\.", "gi");
        txt = txt.replace(reg,".");
        reg=new RegExp("\\." + keywordsSolo[i] + "$", "gi");
        txt = txt.replace(reg,".");
}

    var newfilename = txt.trim() + extend.trim() + "." + extension.trim();
    newfilename = newfilename.replace(/\.\./g,".");
    return newfilename;
}

function importFilms( srcdir, destdir) {
	var localDownloads = new LocalDownloads();
	localDownloads.setpath(srcdir);
	localDownloads.setfilmspath(destdir);
	localDownloads.readall();

	for(var i  in localDownloads.list ){
		var fileName = localDownloads.list[i];
		var newFilename = suggestVideoFilename(fileName)

		localDownloads.rename(fileName,newFilename, function(oldfile,newfile) {	
			var searchkeywords = newfile.replace(/^(.*)\/([^\/]*)$/g, "$2");

			searchkeywords = searchkeywords.replace(/^(.*)(\.[^.]*)$/g, "$1");
			searchkeywords = searchkeywords.replace(/_[a-zA-Z0-9]*/g,"");
			searchkeywords = searchkeywords.replace(/\./g, ' ');

			var onlineVideos = new OnlineVideos();
			onlineVideos.listmovies( searchkeywords,function(movies) {
				var code = 0;
				if( movies.length > 0 ) { code = movies[0].code }

				onlineVideos.getMovie(code, function(monfilm) {
					console.log(path.basename(newfile));
					localDownloads.importFilm(path.basename(newfile), monfilm, function(error) { 
						if( error ) {
							console.log(monfilm.title);
							console.log(error);
						} else {
							console.log(monfilm.title);
						}
					});
					
				});
				//}
			});
		});
	}
}
