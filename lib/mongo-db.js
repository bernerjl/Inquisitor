var mongo = require('mongo-lite');
var db;

exports.getDB = function() {
	if (!db) {
		db = mongo.connect('mongodb://localhost/irc', ['chat', 'confessions']);
	}
	return db;
}
