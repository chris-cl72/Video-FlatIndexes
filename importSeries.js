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
		console.log(val);
		destdir=val;
		importSeries(srcdir, destdir);
	}
});

function suggestVideoFilename(orifinalFilename)
{
		var str = orifinalFilename;
	var filename = str.replace(/.*\//g,"");
    var basename = filename.replace(/\.[^.]*$/g,"");
    var extension = filename.replace(/.*\./g,"");

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

var vostfr = '';
pattern = new RegExp("\\.VOSTFR", "gi");
if( pattern.test(txt) ) {
	pattern.lastIndex=0;
	vostfr = '_VOSTFR';
	txt = txt.replace(pattern,'.');
}

var episode = '';
pattern = new RegExp("\\.S[0-9]{1,2}E[0-9]{1,2}", "gi");
pattern1 = new RegExp("S[0-9]{1,2}E[0-9]{1,2}", "gi");
if( pattern.test(txt) ) {
	pattern.lastIndex=0;
	episode = '_' + pattern1.exec(txt)[0];
	txt = txt.replace(pattern,'');
}

	var newfilename = txt.trim() + episode.trim() + vostfr.trim() +  extend.trim() + "." + extension.trim();
	newfilename = newfilename.replace(/\.\./g,".");
	newfilename = newfilename.replace(/\._/g,"_");
	newfilename = newfilename.replace(/_\./g,"_");
	return newfilename;
}

function getSeasonNumber(filename) {
	var seasonnumber = 0;
	if( filename.match(/_S[0-9]{1,2}E[0-9]{1,2}/) ) {
		var strseasonnumber = filename.replace(/.*_S([0-9]{1,2})(E[0-9]{1,2}.*)/,'$1');
		//alert(filename + ':' + strseasonnumber);
		if( strseasonnumber !== '' ) { seasonnumber = parseInt(strseasonnumber,10); }	
	}
	return seasonnumber;
}

function importSeries( srcdir, destdir) {
	var localDownloads = new LocalDownloads();
	localDownloads.setpath(srcdir);
	localDownloads.setseriespath(destdir);
	
	localDownloads.readall();

	for(var i  in localDownloads.list ){
		var fileName = decodeURIComponent(localDownloads.list[i]);
		var newFilename = suggestVideoFilename(path.basename(fileName))
		//console.log( '!!!!!!!! ' + fileName + '->' + newFilename);
		localDownloads.rename(fileName,path.basename(newFilename), function(oldfile,newfile) {	
		var searchkeywords = newfile.replace(/^(.*)\/([^\/]*)$/g, "$2");
		searchkeywords = searchkeywords.replace(/^(.*)(\.[^.]*)$/g, "$1");
		searchkeywords = searchkeywords.replace(/_[a-zA-Z0-9]*/g,"");
		searchkeywords = searchkeywords.replace(/\./g, ' ');
		//console.log( 'searchkeywords :' + searchkeywords);
			var onlineVideos = new OnlineVideos();
			//console.log('dfsdfs');
			onlineVideos.listseries( searchkeywords,getSeasonNumber(newfile),function(movies) {
				var code = 0;
				if( movies.length > 0 ) { code = movies[0].code }

				onlineVideos.getSaison(code, function(masaison) {
					console.log(path.basename(newfile));
					localDownloads.importSerie(path.basename(newfile), masaison, function(error) { 
						if( error ) {
							//console.log(masaison.title);
							console.log(error);
						} else {
							//console.log(masaison.title);
						}
					});
					
				});
				//}
			});
		});
	}
}
