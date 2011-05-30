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
