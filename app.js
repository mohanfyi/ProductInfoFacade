var express = require('express');
var config = require('./config');
var url = require('url');
var http = require('http');

var app = express();

/* Include the app engine handlers to respond to start, stop, and health checks. */
app.use(require('./lib/appengine-handlers'));


/*Returns back the complete product details on providing the ProductNum
This is what is being used for showing data on Dashboard after clubbing Product & Client info*/
app.get('/getProductDetails', function(req, res) {
	var product_num = req.query.productnum;
	var product_detail_chunk = "";
	var product_detail_client_chunk = "";
	var product_details = {};
	var options = {
          host: 'nmclvpoc.appspot.com',
          path: '/?productnum=' + req.query.productnum
    };

    var request = http.get(options, function(response) {
    	response.on("data", function(chunk) {
    		product_detail_chunk += chunk;
    	});

    	response.on("end", function(err) {
    		if(product_detail_chunk != null) {
    			//now trigger client info API to fetch the client details based on productid#
    			var client_API_options = {
    				host: 'clientinfopoc.appspot.com',
          			path: '/?productidnum=' + JSON.parse(product_detail_chunk)[0].product_id_num
    			};

    			var product_detail_response = http.get(client_API_options, function(response) {
    				response.on("data", function(chunk) {
    					product_detail_client_chunk += chunk;
    				});

    				response.on("end", function(err) {
    					//plugin client info & product info to the product details model
    					product_details.productinfo = JSON.parse(product_detail_chunk);
    					product_details.clientinfo = JSON.parse(product_detail_client_chunk);
    					res.header('Access-Control-Allow-Origin', '*');
    					res.send(JSON.stringify(product_details));
    				})
    			});
    		}
    	});
    });
});


var server = app.listen(config.port, '0.0.0.0', function() {
  console.log('App listening at http://%s:%s', server.address().address, server.address().port);
  console.log("Press Ctrl+C to quit.");
});
      
