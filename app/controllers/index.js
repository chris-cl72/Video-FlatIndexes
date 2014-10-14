module.exports = function(app, req, res) {
//res.send('hello world !');
res.render('index.twig', {
    message : "bonjour christophe !"
    });
}
