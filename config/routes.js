var path = require('path');

module.exports = function(app, express, passport) {

    var path =__dirname + '/../app/controllers';

    app.use(function (req, res, next){console.log("%s %s %s %s",req.method,req.url,res.statusCode,req.ip); next();});

    app.get(['/','/index'], function(req, res) {
	callController(app, req, res, 'index.js');
    });

    app.get('/Videos', function(req, res) {
        callController(app, req, res, 'Videos.js');
    });

    app.post('/search', function(req, res) {
        callController(app, req, res, 'Videos.js');
    });

/*app.router.post('/signup', passport.authenticate('signup', {
    successRedirect: '/home',
    failureRedirect: '/signup',
    failureFlash : true 
  }));
*/
/*app.post('/login', passport.authenticate('digest', {
	session: false,
    successRedirect: '/loginSuccess',
    failureRedirect: '/loginFailure'
    //failureFlash : true 
  }));


app.get('/loginFailure', function(req, res, next) {
  res.send('Failed to authenticate');
});
 
app.get('/loginSuccess', function(req, res, next) {
  res.send('Successfully authenticated');
});

app.all('/Videos/perso',
// Authenticate using HTTP Digest credentials, with session support disabled.
passport.authenticate('digest', { session: false }),
function(req, res){
//res.json({ username: req.user.username, email: req.user.email });
});*/
	/*app.get('/login', function(req, res) {
	require(path + '/' + 'user.js').login(app, req, res);*/
        //return callController(app, req, res, 'user.js').login;
    //});

/*
	app.get('/login', user.login);
	app.get('/logout', user.logout);*/
};

function callController(app, req, res, name) {
	var path =__dirname + '/../app/controllers';
	require(path + '/' + name)(app, req, res);
};

