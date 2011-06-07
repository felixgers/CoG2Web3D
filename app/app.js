


function startApp(){
	startScene();
}


/**
 * 
 * @param canvas
 * @returns
 */
function initGL(canvas) {
	try {
		var gl = canvas.getContext("experimental-webgl");
		gl.viewport(0, 0, canvas.width, canvas.height);
	} catch(e) {
	}
	if (!gl) {
		alert("No gl context: Could not initialise WebGL.");
	}
	return gl;
}