var inquisitor = module.parent.require('./lib/confessor.js');

exports = module.exports = function(req, res, next) {
	if (req.method != 'POST') return next();
	
	var confessed = req.body.confession.replace(/\r\n|\r|\n/g, ' ').substring(0, 400);

	inquisitor.confess(confessed, function () {
		res.writeHead(302, {"Location": "/thanks.html" });
	}, function (reason) {
		res.writeHead(302, {"Location": "/#" + reason });
	});
	res.end();
}
