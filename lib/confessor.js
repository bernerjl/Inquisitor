var db = module.parent.require('./lib/mongo-db').getDB();
var client = module.parent.require('./lib/irc-client').getClient();

exports.MORE = "more";
exports.FLOOD = "flood";

exports.confess = function (confessed, success, failure) {

        if (confessed.length < 3) {
		failure(exports.MORE);
		return;
        }

        db.confessions.count({ time: { $gt: Date.now() - 10000 } }, function (err, count) {
                if (err || count < 5) {
                        db.confessions.insert({
                                time: Date.now(),
                                confession: confessed
                        }, function (err, doc) {
                        });

                        for (var chan in client.chans) {
                                client.say(chan, 'Confession: ' + confessed);
                        }
			success();
                } else {
			failure(exports.FLOOD);
                }
        });

}
