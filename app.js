//add timestamps in front of log messages
require('console-stamp')(console, '[dd/mm/yyyy HH:MM:ss.l]')
var express = require('express');
var twig = require('twig');
var path = require('path');
var bodyParser = require('body-parser')

var app = express();
var session = require('express-session')

app.disable('x-powered-by');
app.set('views',__dirname + '/app/views');
app.set('view engine', 'html');
app.engine('html', twig.__express);
app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(session({
 secret: 'ilyHLKJgfjkdek467JKRDh', cookie: { maxAge: 900000, secure: true },
 resave: true,
 saveUninitialized: true
}));
require('./config/system.js')(app,express);
require('./config/user.js')(app,express);
require('./config/environment.js')(app, express);

app.listen(app.get('port'), function(){
  console.log(("Express server listening on port " + app.get('port')))
});

