'use strict';

var appconfig = require('./config/appconfig');

var fs = require('fs');
var http = require('http');
var https = require('https');

var privateKey  = fs.readFileSync(__dirname + '/keys/key.pem', 'utf8');
var certificate = fs.readFileSync(__dirname + '/keys/key-cert.pem', 'utf8');
var credentials = {key: privateKey, cert: certificate};

var SwaggerExpress = require('swagger-express-mw');
var express = require('express');
var app = express();
var logger = require('./logger');

module.exports = app; // for testing

/*app.get('/api', function(req,res) {
		res.render('index.html');
});*/

app.use(require('./lib/appengine-handlers'));
app.use(express.static('public'));

var config = {
  appRoot: __dirname // required config
};

SwaggerExpress.create(config, function(err, swaggerExpress) {
  if (err) { throw err; }

  // install middleware
  swaggerExpress.register(app);
  
  var http_port = appconfig.http_port;
  var https_port = appconfig.https_port;
  //app.listen(port);
  
  http.createServer(app).listen(http_port);
  https.createServer(credentials, app).listen(https_port);
  logger.info('Listening to port(s) http=%d and https=%d', http_port, https_port);

  console.log('try this:\ncurl http://127.0.0.1:' + http_port + '\ncurl https://127.0.0.1:' + https_port);
});
