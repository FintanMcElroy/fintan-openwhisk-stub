/*eslint-env node*/
'use strict'

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
const openwhisk = require('openwhisk');
const ow = openwhisk({
	api: 'https://openwhisk.ng.bluemix.net/api/v1/',
	//api_key: '622afc08-27ac-4a05-b5b6-2d7c3408df25:GNmeEWxqQhNF0mY9WhvcBOuL9tu9sDm6bnIsTVoXOPrXIwFuVTyOdFkL3OGLxLax';
	api_key: '622afc08-27ac-4a05-b5b6-2d7c3408df25:GNmeEWxqQhNF0mY9WhvcBOuL9tu9sDm6bnIsTVoXOPrXIwFuVTyOdFkL3OGLxLax',
	namespace: 'fintan_mcelroy@uk.ibm.com_fintan_us'});

app.get("/invoke/:action", function(req, res) {

	console.log("LOG - Inside the app.get(/invoke/:action) ...");
	/*ow.packages.get({packageName: "fintanCloudant"}).then(function(pkg) {
		console.log("Returned from ow.packages.get with pkg : " + JSON.stringify(pkg));
		res.send(JSON.stringify(pkg));
	}).catch(function(err) {
		console.log("ERROR Returned from ow.packages.get with err : " );
		res.send("Error");
	});
	ow.actions.list().then(function(actions) {
		console.log("Returned from ow.actions.list : " + JSON.stringify(actions));
		res.send(JSON.stringify(actions));
	}).catch(function(err) {
		console.log("ERROR Returned from ow.actions.list with err : " + JSON.stringify(err));
		res.send("Error");
	});
	ow.actions.get({actionName: "trivial"}).then(function(trivial) {
		console.log("Returned from ow.actions.get with trivial : " + JSON.stringify(trivial));
		res.send(JSON.stringify(trivial));
	}).catch(function(err) {
		console.log("ERROR Returned from ow.actions.get with err : " + JSON.stringify(err));
		res.send("Error");
	});
	console.log("LOG - About to execute James provided code ...");
	ow.actions.invoke({actionName: 'trivial', blocking: true}).then(result => {
  console.dir(result)
}).catch(err => console.log) */


 	console.log("ow.actions.invoke -> actionName: req.params.action " + req.params.action );
	console.log("ow.actions.invoke -> params: req.query " + JSON.stringify(req.query));
	ow.actions.invoke({
		blocking: true,
		actionName: req.params.action,
		params: req.query
	}).then(function(param) {
		console.log("Returned from ow.actions.invoke with param : " + JSON.stringify(param));
		console.log("Returned from ow.actions.invoke with param.response.result : " + JSON.stringify(param.response.result));
		// Return the result of the OpenWhisk call
		res.send(JSON.stringify(param.response.result));
	}).catch(function(err) {
		console.log("ERROR Returned from ow.actions.invoke with err : " + JSON.stringify(err));
		res.send("Error: " + JSON.stringify(err));
	});

});

// start server on the specified port and binding host
app.listen(appEnv.port, '0.0.0.0', function() {

	// print a message when the server starts listening
  console.log("server starting on " + appEnv.url);
});
