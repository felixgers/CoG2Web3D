// First import all required JS modules
// Therefore the HTML document must load the script star.js first.
// More importScript statements may follow at the end of JS files to cover dependencies.

/**
 * importScript javascripts
 * @param javascriptPath optinalHTMLelement
 */
importScript = function(javascriptPath) {
	var script = document.createElement("script");
	script.setAttribute("type", "text/javascript");
	script.setAttribute("src", javascriptPath);
	var absPath = script.src;
	var parentElement = "head";
	if(arguments.length > 1){parentElement = arguments[1];}
	document.getElementsByTagName(parentElement)[0].appendChild(script);
}

importScript("../../ext/glMatrix.js");
importScript("../../ext/matrixStack.js");

importScript("../../scene/shader.js");
importScript("../../scene/nodes.js");
importScript("../../scene/scene.js");

importScript("../../app/events.js");
importScript("../../app/app.js");

//define the only one global variable for this application
var BGE = BGE || {};

/**
 *
 * @param ns_string = name of namespace
 */
BGE.namespace = function (ns_string) {

    var parts = ns_string.split('.'),
        parent = BGE,
        i;

    //strip redundant leading global
    if (parts[0] == "BGE") {
        parts = parts.slice(1);
    }

    for (i = 0; i < parts.length; i += 1) {
        // create a property if it doesn't exist
        if (typeof parent[parts[i]] == "undefined") {
            parent[parts[i]] = {};
        }
        parent = parent[parts[i]];
    }
    return parent;
};

















