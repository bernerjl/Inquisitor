var moment = require('moment');
var Entities = require('html-entities').AllHtmlEntities;
var entities = new Entities();
var db = module.parent.require('./lib/mongo-db').getDB();
var client = module.parent.require('./lib/irc-client').getClient();

exports = module.exports = function(req, res) {
	res.setHeader("Content-Type", "text/html");
	res.write("<html><head><title>IRC Confessions</title><body>");

	printLoudMouths();

	function printLoudMouths() {
		db.chat.mapReduce(function () {
			emit(this.nick, (this.message.match(/\w+/g) || []).length );
		}, function (key, values) {
			return values.reduce(function (a, b) { return a + b });
		}, { out: { inline: 1}, query: { channel: '#uwec-cs' } }, function (err, result) {
			// Get top 10 in descending order
			result = result.sort(function (a, b) { return b.value - a.value }).slice(0, 10);
			printTable(res, "Top 10 Loud Mouths", "Word Count", result);
			printCryBabies();
		});
	}

	function printCryBabies() {
		db.chat.mapReduce(function () {
			emit(this.nick, (this.message.match(/qq/ig) || []).length );
		}, function (key, values) {
			return values.reduce(function (a, b) { return a + b });
		}, { out: { inline: 1}, query: { channel: '#uwec-cs' } }, function (err, result) {
			// Get top 10 in descending order
			result = result.sort(function (a, b) { return b.value - a.value }).slice(0, 10);
			printTable(res, "Top 10 Cry Babies", "QQ Count", result);
			printFoulMouths();
		});
	}

	function printFoulMouths() {
		db.chat.mapReduce(function () {
			emit(this.nick, (this.message.match(/fuck|shit|bitch|ass|damn/g) || []).length );
		}, function (key, values) {
			return values.reduce(function (a, b) { return a + b });
		}, { out: { inline: 1}, query: { channel: '#uwec-cs' } }, function (err, result) {
			// Get top 10 in descending order
			result = result.sort(function (a, b) { return b.value - a.value }).slice(0, 10);
			printTable(res, "Top 10 Potty Mouths", "Curse Count", result);
			printEnd();
		});
	}

	function printEnd() {
		res.end("</body></html");
	}
};

function printTable(res, title, label, docs) {
	res.write("<h3>" + title + "</h3>");
	if (docs) {
		res.write("<table>");
		res.write("<tr><th>Nickname</th><th>" + label + "</th></tr>");

		docs.forEach(function (doc) {
			res.write("<tr><td>" + doc._id + "</td><td>" + doc.value + "</td></tr>");
		});
		res.write("</table>");
	} else {
		res.write("<p>No results</p>");
	}
}



