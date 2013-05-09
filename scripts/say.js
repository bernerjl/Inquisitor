var client = module.parent.require('./lib/irc-client').getClient();

exports = module.exports = function(req, res, next) {
	if (req.method == 'POST') {
		var msg = req.body.msg.replace(/\r\n|\r|\n/g, ' ').substring(0, 400);

		for (var chan in client.chans) {
			client.say(chan, msg);
		}

		res.writeHead(302, {"Location": "/say"});
		res.end();
	} else {
		res.setHeader("Content-Type", "text/html");
		res.end('<html><head><title>IRC Confessions</title><body>'+
		'<form action="say" method="post">'+
		'<textarea name="msg" rows="7" cols="65"></textarea><br />'+
		'<input type="submit" name="cmd" value="Say!" />'+
		'</form></body></html>');
	}	
}