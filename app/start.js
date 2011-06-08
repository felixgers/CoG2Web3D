// First import all required JS modules
// Therefore the HTML document must load the script star.js first.
// More import statements may follow at the end of JS files to cover dependencies.
import("../../util/event.js");
import("../../util/glMatrix.js");
import("../../util/matrices.js");

import("../../app/event.js"); 
import("../../app/nodes.js");
import("../../app/shader.js");
import("../../app/app.js");

import("../../scene/scene.js");
import("../../scene/nodes.js");

import("event.js"); // MySpecializedEventManager
import("nodes.js"); // RotorXMutableSpeed and PositionCamera


/**
 * This is the entry main point for the application.
 */
window.onload = function () {
	new MyApp().start();
};

///////////////// import utility to organize code ////////////////////////////

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
