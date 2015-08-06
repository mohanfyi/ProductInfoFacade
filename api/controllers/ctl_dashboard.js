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
	//var product_num = req.query.productnum;
	var product_num = req.swagger.params.productnum.value;
	logger.info('Received Request for productnum=' + product_num);
	var product_detail_chunk = "";
	var product_detail_client_chunk = "";
	var position_detail_chunk = "";
	var product_details = {};
	var async_counter = 2;
	var options = {
	  host: '104.154.61.252',
	  port: 8080,
	  path: '/?productnum=' + product_num
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
    				host: '104.197.3.27',
    				port: 8080,
          			path: '/?productidnum=' + JSON.parse(product_detail_chunk)[0].product_id_num
    			};
    			
    			var position_API_options = {		
                    		host: '146.148.47.97',
                    		port: 8080,
                    		path: '/?productnum=' + product_num		
                	};

    			var product_detail_response = http.get(client_API_options, function(response) {
    				response.on("data", function(chunk) {
    					product_detail_client_chunk += chunk;
    				});

    				response.on("end", function(err) {
    					logger.info('product_detail_client_chunk=' + product_detail_client_chunk);
    					//plugin client info & product info to the product details model
    					
    					async_counter = async_counter - 1;
    					
    					//Replace null values
    					//product_detail_client_chunk=product_detail_client_chunk.replace(/null/g, "");
    					
    					var arrClient = fnGetArray(JSON.parse(product_detail_client_chunk));
    					var arrProduct = fnGetArray(JSON.parse(product_detail_chunk));
    					arrClient.forEach(function(entry) {
    						if (entry.middle_name == null)
    							 entry.middle_name =  "";
    						if (entry.org_name == null)
    							 entry.org_name = "";
						
    						if (entry.client_type_cde == null)
    							 entry.client_type_cde = 0;
					});
    					product_details = {
					    "clientinfo": arrClient,
					    "productinfo": arrProduct
						}
					logger.info('product_details(JSON)=' + JSON.stringify(product_details));
					/*product_details = {
					    "clientinfo": [{"product_id_num":2},{"product_id_num":2}]
					    
						}
					logger.info('product_details(JSON2)=' + JSON.stringify(product_details));*/
					/*product_details = {
					    
					    "productinfo": [{
					    	"product_id_num":"2"
					    }]
					}*/
    					
    					//product_details.productinfo = product_detail_chunk;
    					//product_details.clientinfo = product_detail_client_chunk;
    					logger.info('product_details(JSON)=' + JSON.stringify(product_details));
    					logger.info('product_details=' + product_details);
    					//res.setHeader('Access-Control-Allow-Origin', '*'); // New
    					//res.setHeader('Content-Type', 'application/json');
    					//res.send(JSON.stringify(product_details));
    					//res.json(product_details); //New
    					checkStatus(async_counter,res);
    				})
    			});
    			
    			//new
    			var position_detail_response = http.get(position_API_options, function(response) {		
		                    response.on("data", function(chunk) {		
		                        position_detail_chunk +=chunk;		
		                    });		
		                    response.on("end", function(err) {		
		                        async_counter = async_counter - 1;
		                        var arrPosition = fnGetArray(JSON.parse(position_detail_chunk));
		                        //product_details.position_info = JSON.parse(position_detail_chunk);		
		                        product_details.position_info = arrPosition;		
		                        checkStatus(async_counter,res);		
		                    })		
                	});
    			//new
    			
    		}
    	});
    	
    	
    });
    
    //new 
    function checkStatus() {		
        if(async_counter == 0) {		
            res.header('Access-Control-Allow-Origin', '*');		
            //res.send(JSON.stringify(product_details));  
            res.json(product_details); //New
        }		
    }
    //new
}

function fnGetArray(obj) {
	var arr = Object.keys(obj).map(function(k) { return obj[k] });
	logger.info("Created array-->\n" + arr + "\n<--\n");
	return arr;
}
