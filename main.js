
// Load modules.
//var Memcached = require('memcached');
var connect = require('./lib/connect-ext')(require('connect'));
var http = require('http');

var include = require('./lib/include')(require.resolve);
require('./lib/irc-plugins').setOpts({ 
	loader: include, 
	client: require('./lib/irc-client').getClient() 
});

console.log("Modules loaded");

// Configure our HTTP connect server with required middleware.
var app = connect()
  .use(connect.favicon())
  .use(connect.static('public'))
  .use(connect.urlencoded())
  .use(connect.dynamic('scripts', {loader: include}))
  .use(function(req, res){
	res.writeHead(404);
	res.end();
  });
console.log("Server configured");

// Create server with http
var server = http.createServer(app);
console.log("Server created");

// Listen on port 8080
server.listen(80);

console.log("Server started. Listening on port 8080");

