#!/usr/bin/env nodejs

var path = require('path');
var fs = require('fs');

var LocalDownloads = function(staticdir) {

	var downloads = require(path.join(__dirname, 'entities/videos.js')).downloads();
	this.path = downloads.path;
	this.list = downloads.list;
/*this.getAll = function() {
	return this.downloads.list;
}*/
};

module.exports = LocalDownloads;
