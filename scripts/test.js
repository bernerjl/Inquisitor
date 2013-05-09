var moment = require('moment');
var Entities = require('html-entities').AllHtmlEntities;
var entities = new Entities();
var db = module.parent.require('./lib/mongo-db').getDB();
var replacements = ['fornication', 'one eyed garden snake', 'shucks', 'pee pee', 'taco', 'milk of human kindness', 'golly'];
var smutReplacements = ['(.Y.)', '8====D', '3~~~', '(y)', '(!)'];
//var client = module.parent.require('./lib/irc-client').getClient();
//Test
exports = module.exports = function(req, res) {
	res.setHeader("Content-Type", "text/html");
	res.write('<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">\n');
	res.write('<html xmlns="http://www.w3.org/1999/xhtml">\n');
	res.write('<head>\n');
	res.write('	<meta http-equiv="Content-Type" content="text/html; charset=utf-8" />\n');
	res.write('	<title>IRC Confession</title>\n');
	res.write('    <link rel ="stylesheet" type="text/css" href="styles.css" />\n');
	res.write('	<script type="text/javascript" src="/main.js"></script>\n');
	res.write('</head>\n');
	res.write('<body>\n');
	res.write('<div id="bodycenter">\n');
	res.write('	<div id="banner">\n');
	res.write('		<p class="HugeWhiteItalicText">Eau Claire IRC Confessions</p>\n');
	res.write('		<p class="HugeWhiteBoldText">Feel free to post your deepest secrets here, you\'re among friends</p>\n');
	res.write('		<em>Confessions are limited to 400 characters or less</em>\n');
	res.write('		<form action="/confess" method="post">\n');
	res.write('			<textarea name="confession" rows="7" cols="65"></textarea><br />\n');
	res.write('			<input type="submit" name="cmd" value="Confess" />\n');
	res.write('		</form>\n');
	res.write('	</div>\n');
	res.write('	<div id="recentActivity">\n');

	printConfessions();
	
	function printActivity () {

		res.write('		<h3>Recent IRC Activity</h3>\n');
		db.chat.find({ channel: '#confess-dev' }).sort({ time: -1}).limit(20).all(function (err, docs) {
			if (docs && docs.length) {
				var i = 0;
				var day = null;
				res.write('<table>\n');
				docs.reverse().forEach(function (doc) {
					var tDay = moment(doc.time).format('DD MMMM YYYY');
					if (day != tDay) {
						day = tDay;
						res.write('<tr class="date"><td colspan="3">' + day + '</td></tr>\n');
						i = 0;
					}
					var className = (++i & 1) ? 'odd' : 'even';
					res.write('<tr class="' + className + '"><td valign="top">' + moment(doc.time).format('HH:mm:ss') + '</td><td valign="top" class="nick"><nobr>' + doc.nick + '</nobr></td><td valign="top">' + filter(doc.message) + '</td></tr>\n');
				});
				res.write("</table>\n");
			} else {
				res.write("<p>There has been no recent IRC activity</p>\n");
			}
			end();
		});
	}
	
	
	function printConfessions() {
		res.write("		<h3>Recent Confessions</h3>\n");
		
		db.confessions.sort({time: -1}).limit(20).all(function (err, docs) {
			if (docs && docs.length) {
				var i = 0;
				var day = null;
				res.write('<table>\n');
				docs.reverse().forEach(function (doc) {
					var tDay = moment(doc.time).format('DD MMMM YYYY');
					if (day != tDay) {
						day = tDay;
						res.write('<tr class="date"><td colspan="2">' + day + '</td></tr>\n');
						i = 0;
					}
					var className = (++i & 1) ? 'odd' : 'even';
					res.write('<tr class="' + className + '"><td valign="top">' + moment(doc.time).format('HH:mm:ss') + '</td><td valign="top">' + filter(doc.confession) + '</td></tr>\n');
				});
				res.write("</table>\n");
			} else {
				res.write("<p>There have been no recent confessions</p>\n");
			}
			printActivity();
		});
	}

	function end() {
		res.write('	</div>\n</div>\n');
		res.end("</body></html>\n");
	}
	function wordFilter(comment){
		return comment.replace(/(fuck|fark)|(dick|cock)|(shit)|(8=+D(?:\s*~+)?)|(pussy|cunt)|(cum|jizz)|(damn)/ig, function(){ 
			var args = Array.prototype.slice.call(arguments);
			return replacements[args.indexOf(args.shift())];
		});

	
	}
	function smutEnforcer(comment){
		return comment.replace(/(tit|breast|boob)|(penis|wang|willy|willie|pee pee)|(poo|crap|dung)|(ass|butt)|(vag(?:ina)?|vulva)/ig, function(){
                        var args = Array.prototype.slice.call(arguments);
                        return smutReplacements[args.indexOf(args.shift())];
                });
	}
	function linkfinder(comment){
		return comment.replace(/https?:\/\/\S+/g, function(match){
			return "<a href=" + match + ">" + match + "</a>";
		});
	}
	function filter(comment){
		return linkfinder(entities.encode(smutEnforcer(wordFilter(comment))));
	}
};
