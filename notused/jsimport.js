/**
 * @author Christoph Schršder
 * NOT WORKING YET!
 */

var docHead = document.getElementsByTagName("head")[0];
var docURL = document.URL;
var importDict = {};
var depth = 0;
var importDepth = [""];


// Initialize
var scripts = document.getElementsByTagName("script");
for(var i=0;i<scripts.length;i++) {
	importDict[scripts[i].src] = true;
	importDepth[depth] = scripts[i].src;
}

function startswith(str)
{
	var expr = eval("/^"+str.replace("/","\\/")+"/");
	if (this.search(expr) == 0) {
		return true; 
	} 
	return false; 
}
String.prototype.startswith = startswith;

function isRelative(path) { 
	if (basePath.startswith("http://") ||
			basePath.startswith("https://") ||
			basePath.startswith("file://") )
	{
		return false;
	}
	return true;
}


/**
 * Function for importing other javascript files.
 * @param javascriptPath
 */
function import(javascriptPath) {

	var basePath = importDepth[depth];
	
	var path = javascriptPath;
	if(isRelative(path)) {
		// path = 
	}
	
	depth += 1;
	if(importDepth.length < depth-1) {
		importDepth.push("");
	}
	
	var script = document.createElement("script");
	script.setAttribute("type", "text/javascript");
	script.setAttribute("src", path);
	var absPath = script.src;

	importDepth[depth] = absPath;
	
	if (importDict[absPath] == null) {
		importDict[absPath] = true;
		docHead.appendChild(script);
	}
	depth -= 1;
}

