#!/usr/bin/env nodejs

//var acl = function(users, roles) {
var path = require('path');
var fs = require('fs');

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

var acl = readConf(path.join(__dirname, 'acl.json'));
module.exports.users = acl.users;
module.exports.roles = acl.roles;
