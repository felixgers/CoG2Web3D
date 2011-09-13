// First import all required JS modules
// Therefore the HTML document must load the script star.js first.
// More importScript statements may follow at the end of JS files to cover dependencies.
//define the only one global variable for this application
var BGE = BGE || {};
/**
 * importScript javascripts
 * @param javascriptPath optinalHTMLelement
 */
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

BGE.namespace("importScript");

BGE.importScript=function(javascriptPath) {
	var script = document.createElement("script");
	script.setAttribute("type", "text/javascript");
	script.setAttribute("src", javascriptPath);
	var absPath = script.src;
	var parentElement = "head";
	if(arguments.length > 1){parentElement = arguments[1];}
	document.getElementsByTagName(parentElement)[0].appendChild(script);
}



BGE.importScript("../../ext/glMatrix.js");
BGE.importScript("../../ext/matrixStack.js");

BGE.importScript("../../scene/shader.js");
BGE.importScript("../../scene/nodes.js");
BGE.importScript("../../scene/scene.js");

BGE.importScript("../../app/events.js");
BGE.importScript("../../app/app.js");





















