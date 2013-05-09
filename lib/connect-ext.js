var fs = require('fs');

exports = module.exports = function (connect) {
	connect.dynamic = function(root, options) {

		if (!root) throw new Error('static() root path required');
	
		options = options || {};
		options.loader = options.loader || module.parent.require;

		var parse = require('url').parse;

		return function (req, res, next) {
			var url = parse(req.url);
			var script = './' + root + url.path;

			fs.stat(script, function (err, stat) {
				if (!err && stat.isDirectory()) script += 'index.js';
				try {
					options.loader(script)(req, res, next);
				} catch (e) {
					console.log("Could not load dynamic script: " + script);
					console.log(e);
					next();
				}
			});
		};
	};
	return connect;
};




