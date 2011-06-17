// First import all required JS modules
// Therefore the HTML document must load the script star.js first.
// More import statements may follow at the end of JS files to cover dependencies.
import("../../util/glMatrix.js");
import("../../util/matrixStack.js");

import("../../scene/shader.js");
import("../../scene/nodes.js");
import("../../scene/scene.js");

import("../../app/events.js"); 
import("../../app/app.js");


/**
 * Import javascripts
 * @param javascriptPath optinalHTMLelement
 */
function import(javascriptPath) {
	var script = document.createElement("script");
	script.setAttribute("type", "text/javascript");
	script.setAttribute("src", javascriptPath);
	var absPath = script.src;
	document.getElementsByTagName("head")[0].appendChild(script);
}
