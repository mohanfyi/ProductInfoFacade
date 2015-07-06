'use strict';
/*
 'use strict' is not required but helpful for turning syntactical errors into true errors in the program flow
 http://www.w3schools.com/js/js_strict.asp
*/

var http = require('http');
var logger = require('../../logger');

module.exports = {
  //getdashboarddata: fnGetDashboardDataForClient,
  getProductDetails: fnGetProductDetails,

};

/*Returns back the complete product details on providing the ProductNum
This is what is being used for showing data on Dashboard after clubbing Product & Client info*/
function fnGetProductDetails(req, res) {
	logger.info('Received Request for productnum=' + req.query.productnum);
	console.log('Listening to port(s) http=%d and https=%d', http_port, https_port);
	var product_num = req.query.productnum;
	var product_detail_chunk = "";
	var product_detail_client_chunk = "";
	var product_details = {};
	var options = {
	  host: 'nmclvpoc.appspot.com',
	  path: '/?productnum=' + req.query.productnum
	};

	//res.send(JSON.stringify(product_details));
	res.json(product_details);
	/*
    var request = http.get(options, function(response) {
    	
    	response.on("data", function(chunk) {
    		product_detail_chunk += chunk;
    	});

    	response.on("end", function(err) {
    		if(product_detail_chunk != null) {
    			logger.info('product_detail_chunk=' + product_detail_chunk);
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
    					logger.info('product_detail_client_chunk=' + product_detail_client_chunk);
    					//plugin client info & product info to the product details model
    					//product_details.productinfo = JSON.parse(product_detail_chunk);
    					//product_details.clientinfo = JSON.parse(product_detail_client_chunk);
    					res.header('Access-Control-Allow-Origin', '*');
    					//res.json(product_details);
    					//res.send(JSON.stringify(product_details));
    					res.send(JSON.stringify(product_details));
    				})
    			});
    		}
    	});
    });*/
}
