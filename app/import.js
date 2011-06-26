/**
 * importScript javascripts
 * @param javascriptPath optinalHTMLelement
 */
function importScript(javascriptPath) {
	try { var request = new XMLHttpRequest(); }
	catch(e) { 
		alert("Could not create XMLHttpRequest"); 
		return;
	}
	// Check whether document is located in local file system.
	var localFileSys = document.URL.match(/^file:\/\/.*?$/);
	
	// Do not open asynchronously, thus wait for the response.
	request.open("GET", javascriptPath, false); 
	request.overrideMimeType("text/plain");
	request.send(null);
	// Check if we got HTTP status 200 (OK) or in local file system status 0
	if ((localFileSys && request.status == 0) || request.status == 200) {
		var scriptCode = request.responseText;
		var script = document.createElement("script");
		script.setAttribute("type", "text/javascript");
		var codeText = document.createTextNode(scriptCode);
		script.appendChild(codeText);
		var parentElement = "head";
		if(arguments.length > 1){parentElement = arguments[1];}
		document.getElementsByTagName(parentElement)[0].appendChild(script);
		
	} else { // Failed
		alert("Could not load shader file: "+url); 
		return;
	}

	/*
	var script = document.createElement("script");
	script.setAttribute("type", "text/javascript");
	script.setAttribute("src", javascriptPath);
	var absPath = script.src;
	var parentElement = "head";
	if(arguments.length > 1){parentElement = arguments[1];}
	document.getElementsByTagName(parentElement)[0].appendChild(script);
	*/
}

// First import all required JS modules
// Therefore the HTML document must load the script star.js first.
// More importScript statements may follow at the end of JS files to cover dependencies.
importScript("../../util/glMatrix.js");
importScript("../../util/matrixStack.js");

importScript("../../scene/shader.js");
importScript("../../scene/nodes.js");
importScript("../../scene/scene.js");

importScript("../../app/events.js"); 
importScript("../../app/app.js");


