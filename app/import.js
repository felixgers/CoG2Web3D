// First import all required JS modules
// Therefore the HTML document must load the script star.js first.
// More importScript statements may follow at the end of JS files to cover dependencies.
importScript("../../ext/glMatrix.js");
importScript("../../ext/matrixStack.js");

importScript("../../scene/shader.js");
importScript("../../scene/nodes.js");
importScript("../../scene/scene.js");

importScript("../../app/events.js"); 
importScript("../../app/app.js");


/**
 * importScript javascripts
 * @param javascriptPath optinalHTMLelement
 */
function importScript(javascriptPath) {
	var script = document.createElement("script");
	script.setAttribute("type", "text/javascript");
	script.setAttribute("src", javascriptPath);
	var absPath = script.src;
	var parentElement = "head";
	if(arguments.length > 1){parentElement = arguments[1];}
	document.getElementsByTagName(parentElement)[0].appendChild(script);
}

