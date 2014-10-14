exports.login = function(app, req, res){
    auth.check(req, res, function(email){
        req.session.authenticated = true;
        //res.end("Hello "+JSON.stringify(req.headers));
    });
};
