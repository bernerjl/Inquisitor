var fs = require("fs");
var options = {};

exports.setOpts = function (opts) {
	options = opts;
};

exports.trigger = function (root) {

	if (!root) throw new Error('trigger() root path required');

	options.loader = options.loader || module.parent.require;

	return function (raw, next) {
		if (!/^!(\w+)(?:\s+(.*)|$)/.test(raw.args[1])) {
			return next();
		}
		var cmd = RegExp.$1;
		var argstr = RegExp.$2 || '';
		var script = './' + root + '/' + cmd;
		fs.stat(script, function (err, stat) {
			if (!err && stat.isDirectory()) script += '/main';
			try {
				options.loader(script)(raw, options.client);
			} catch (e) {
				console.log("IRC Trigger not found: " + cmd + "\n" + e);
				next();
			}
		});
	};
};

