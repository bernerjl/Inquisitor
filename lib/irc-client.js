var irc = require('irc');
var chans = ['#confess-dev'];
chans.push('#uwec-cs'); // comment out for rigorous testing

var db = module.parent.require('./lib/mongo-db').getDB();
var trigger = module.parent.require('./lib/irc-plugins').trigger('./irc-plugins');

var client;
// Connect IRC client

exports.getClient = function() {
	if (!client) {
		client = new irc.Client('irc.freenode.org', 'TheInquisition', {
			userName: "inquisitor",
			realName: "The Grand Inquisitor",
			channels: chans
		});

		chans.forEach(function (chan) {
			client.addListener('message'+chan, function (from, message, raw) {
				// Tries to run trigger, else logs chat
				trigger(raw, function () {
					db.chat.insert({
						time: Date.now(),
						nick: from,
						channel: chan,
						message: message
					}, function(err, doc){
					});
				});
			});
		});
		
		client.addListener('pm', function (from, message, raw) {
			trigger(raw, function () {
				client.say(from, "I am just a lowly Node.js bot; you probably shouldn't be talking to me here.");
				client.say(from, "Feel free to confess your secrets @ http://inquisitor.two-bits.com though!");
			});
		});
	}
	return client;
}
