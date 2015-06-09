#!/usr/bin/env nodejs

var fs = require('fs');
var path = require('path');
eval(fs.readFileSync(path.join(__dirname, '../libraries/tools.js'))+'');

var Videos = require(path.join(__dirname, 'entities/videos.js'));
var LocalDownloads = function(staticdir) {

	var videos = new Videos();
	var downloads = videos.listDownload(staticdir);
	this.path = staticdir.path;
	this.list = downloads;
};

module.exports = LocalDownloads;
