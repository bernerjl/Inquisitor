var confessor = module.parent.require('./lib/confessor');

exports = module.exports = function (raw, client) {
	var confessed = raw.args[1].replace(/^!\w+(?:\s+|$)/, '');

	confessor.confess(confessed, function () {
		client.say(raw.nick, "Sorry, I have not the power to forgive your sins. But don't you feel better now?");
	}, function (reason) {
		if (reason == confessor.MORE) {
			client.say(raw.nick, "I'm sorry, that's not nearly long enough to count as a proper confession.");
		} else if (reason == confessor.FLOOD) {
			client.say(raw.nick, "I'm sorry, there are too many sinners confessing right now. Please try again later.");
		} else {
			client.say(raw.nick, "Something went wrong, and I don't know what :/");
		}
	});
};
