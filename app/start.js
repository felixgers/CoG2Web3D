/**
 * Import javascripts
 * @param javascriptPath optinalHTMLelement
 */

function import(javascriptPath) {
    try { var request = new XMLHttpRequest(); }
    catch(e) { alert("Could not create XMLHttpRequest");  return; }
    var localFileSys = document.URL.match(/^file:\/\/.*?$/);
    request.open("GET", javascriptPath, false);
    request.overrideMimeType("text/plain");
    request.send(null);
    if ((localFileSys && request.status == 0) ||
        request.status == 200) {
        var script = document.createElement("script");
        script.setAttribute("type", "text/javascript");
        var code =document.createTextNode(request.responseText);
        script.appendChild(code);
        document.getElementsByTagName("head")[0].appendChild(script);
    } else { alert("Could not load javascript file: "+javascriptPath);
return; }    
}


// First import all required JS modules
// Therefore the HTML document must load the script star.js first.
// More import statements may follow at the end of JS files to cover dependencies.
import("../../util/glMatrix.js");
import("../../util/matrices.js");

import("../../scene/shader.js");
import("../../scene/nodes.js");
import("../../scene/scene.js");

import("../../app/events.js"); 
import("../../app/app.js");



window.onload = function () {
	new MyApp().start('canvas');
};

