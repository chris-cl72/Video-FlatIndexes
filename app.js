//add timestamps in front of log messages
require('console-stamp')(console, '[dd/mm/yyyy HH:MM:ss.l]')
var express = require('express');
var twig = require('twig');
var path = require('path');
var bodyParser = require('body-parser');
var util = require('util');

var app = express();
var timeout = require('connect-timeout'); //express v4
app.use(timeout(120000));
var session = require('express-session');
//var session = require(express.cookieSession());
/*var yaml = require('js-yaml');
var fs = require('fs');

module.exports = function(callback){
  var database_configs;
  try {
    database_configs = yaml.safeLoad(fs.readFileSync('./config/database.yml', 'utf8'));
  } catch (err) {
    return callback(err);
  }
*/
app.disable('x-powered-by');
app.set('views',__dirname + '/app/views');
app.set('view engine', 'html');
app.engine('html', twig.__express);
//app.use(express.static(path.join(__dirname, 'public'),{ dotfiles: 'allow' }));
//app.use(express.static(path.join(__dirname, 'public'),{ dotfiles: 'allow' }));
app.set('staticdir',path.join(__dirname, 'public'));
//app.use(express.static('/home/chris/Vidéos'));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(session({
 //path: '/',
 secret: 'ilyHLKJgfjkdek467JKRDh',
 //cookie: { maxAge: 900000, secure: true },
 resave: true,
 saveUninitialized: true
//"store":  new session.MemoryStore({ reapInterval: 60000 * 10 })
}));
//require('./config/system.js')(app,express);
//require('./config/user.js')(app,express);
require('./config/settings.js')(app,express);
require('./config/environment.js')(app, express);

app.use('/static',express.static(path.join(__dirname, 'public'),{ dotfiles: 'allow' }));
app.use('/Videos/perso/files',express.static(path.join(__dirname, 'private/files'),{ dotfiles: 'allow' }));
//app.set('staticdir',path.join(__dirname, 'public'));
app.set('privatedir',path.join(__dirname, 'private'));

app.listen(app.get('port'), function(){
  console.log(("Express server listening on port " + app.get('port')))
});
