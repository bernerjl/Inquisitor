var fs = require("fs");

module.exports = function (resolver) {
	return function(mod) {
		var path = resolver(mod);
		if (!require.cache[path]) {
			console.log("watching file: " + path);
			fs.watchFile(path, function (curr, prev) {
				if (curr.mtime !== prev.mtime) {
					console.log("unwatching file: " + path);
					fs.unwatchFile(path);
					console.log("File changed: " + path);
					console.log("Removing module cache");
					delete require.cache[path];
				}
			});
		}
		return module.parent.require(mod);
	};
};