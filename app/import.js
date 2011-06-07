// First import all required js modules
// Therefore the html document must load the script util/import.js first.
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
import("template.js");


/**
 * Import javascripts
 * @param javascriptPath
 */
function import(javascriptPath) {
	var script = document.createElement("script");
	script.setAttribute("type", "text/javascript");
	script.setAttribute("src", javascriptPath);
	var absPath = script.src;
	document.getElementsByTagName("head")[0].appendChild(script);
}
