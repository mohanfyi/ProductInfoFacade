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
    					
    					
    					
    					
    					product_details = {
					    "clientinfo": fnGetArray(JSON.parse(product_detail_client_chunk))
					    
						}
					logger.info('product_details(JSON)=' + JSON.stringify(product_details));
					product_details = {
					    "clientinfo": [{"product_id_num":2},{"product_id_num":2}]
					    
						}
					logger.info('product_details(JSON2)=' + JSON.stringify(product_details));
					/*product_details = {
					    
					    "productinfo": [{
					    	"product_id_num":"2"
					    }]
					}*/
    					
    					//product_details.productinfo = product_detail_chunk;
    					//product_details.clientinfo = product_detail_client_chunk;
    					logger.info('product_details(JSON)=' + JSON.stringify(product_details));
    					logger.info('product_details=' + product_details);
    					res.setHeader('Access-Control-Allow-Origin', '*');
    					//res.setHeader('Content-Type', 'application/json');
    					//res.send(JSON.stringify(product_details));
    					res.json(product_details);
    				})
    			});
    		}
    	});
    });
}

function fnGetArray(obj) {
	var arr = Object.keys(obj).map(function(k) { return obj[k] });
	logger.info("Created array-->\n" + arr + "\n<--\n");
	return arr;
}
