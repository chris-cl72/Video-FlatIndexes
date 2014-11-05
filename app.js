//add timestamps in front of log messages
require('console-stamp')(console, '[dd/mm/yyyy HH:MM:ss.l]')
var express = require('express');
var twig = require('twig');
var path = require('path');
var bodyParser = require('body-parser');

var app = express();
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
app.use(express.static(path.join(__dirname, 'public'),{ dotfiles: 'allow' }));
//app.use(express.static('/home/chris/Vidéos'));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(session({
 //path: '/',
 secret: 'ilyHLKJgfjkdek467JKRDh',
// cookie: { maxAge: 900000, secure: true },
 resave: true,
 saveUninitialized: true
}));
//require('./config/system.js')(app,express);
//require('./config/user.js')(app,express);
require('./config/settings.js')(app,express);
require('./config/environment.js')(app, express);

//app.set(req.sessionID + '.data', []);

app.listen(app.get('port'), function(){
  console.log(("Express server listening on port " + app.get('port')))
});

