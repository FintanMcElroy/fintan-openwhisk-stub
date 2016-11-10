/*eslint-env node*/

//------------------------------------------------------------------------------
// node.js starter application for Bluemix
//------------------------------------------------------------------------------

// This application uses express as its web server
// for more info, see: http://expressjs.com
var express = require('express');

// cfenv provides access to your Cloud Foundry environment
// for more info, see: https://www.npmjs.com/package/cfenv
var cfenv = require('cfenv');

// create a new express server
var app = express();

// serve the files out of ./public as our main files
app.use(express.static(__dirname + '/public'));

// get the app environment from Cloud Foundry
var appEnv = cfenv.getAppEnv();

// Connect to OpenWhisk
var openwhisk = require('openwhisk');
var ow = openwhisk({
	api: 'https://openwhisk.ng.bluemix.net/api/v1/',
	//api_key 'NjIyYWZjMDgtMjdhYy00YTA1LWI1YjYtMmQ3YzM0MDhkZjI1OkdObWVFV3hxUWhORjBtWTlXaHZjQk91TDl0dTlzRG02Ym5Jc1RWb1hPUHJYSXdGdVZUeU9kRmtMM09HTHhMYXg='
	//api_key: '622afc08-27ac-4a05-b5b6-2d7c3408df25:GNmeEWxqQhNF0mY9WhvcBOuL9tu9sDm6bnIsTVoXOPrXIwFuVTyOdFkL3OGLxLax';
	api_key: '622afc08-27ac-4a05-b5b6-2d7c3408df25:GNmeEWxqQhNF0mY9WhvcBOuL9tu9sDm6bnIsTVoXOPrXIwFuVTyOdFkL3OGLxLax',
	namespace: 'fintan_mcelroy%40uk.ibm.com_fintan_us'});

app.get("/invoke/:action", function(req, res) {
	console.log("LOG - Inside the app.get(/invoke/:action) ...");
	ow.packages.get().then(function(pkg) {
		console.log("Returned from ow.packages.get with pkg : " + JSON.stringify(pkg));
		console.log("Returned from ow.packages.get with pkg.response.result : " + JSON.stringify(pkg.response.result));
	}).catch(function(err) {
		console.log("ERROR Returned from ow.packages.get with err : " + JSON.stringify(err));
	});
	console.log("ow.actions.invoke -> actionName: req.params.action " + req.params.action );
	console.log("ow.actions.invoke -> params: req.query " + req.query);
	ow.actions.invoke({
		blocking: true,
		actionName: req.params.action,
		params: req.query
	}).then(function(param) {
		console.log("Returned from ow.actions.invoke with param : " + param);
		console.log("Returned from ow.actions.invoke with param.response.result : " + param.response.result);
		// Return the result of the OpenWhisk call
		res.send(JSON.stringify(param.response.result));
	}).catch(function(err) {
		console.log("ERROR Returned from ow.actions.invoke with err : " + err);
		res.send("Error: " + JSON.stringify(err));
	});

});

// start server on the specified port and binding host
app.listen(appEnv.port, '0.0.0.0', function() {

	// print a message when the server starts listening
  console.log("server starting on " + appEnv.url);
});
