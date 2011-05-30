/**
 * Load shader source code and init shaders and shader program.
 */

function initShader(gl, type, shaderSourceCode) {

	var shader = gl.createShader(type);

	gl.shaderSource(shader, shaderSourceCode);
	gl.compileShader(shader);

	if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
		alert(gl.getShaderInfoLog(shader));
		return null;
	}
	return shader;
}


function getShaderSourceCode(id) {
	   var shaderScript = document.getElementById(id);
	    if (!shaderScript) {
	      return null;
	    }
	 
	    var str = "";
	    var k = shaderScript.firstChild;
	    while (k) {
	      if (k.nodeType == 3) {
	        str += k.textContent;
	      }
	      k = k.nextSibling;
	    }
	return str;
}


function Shader(gl, vertexShaderId, fragmentShaderId) {	
	// Public variables.
	this.shaderProgram;
	this.vertexShader;
	this.fragmentShader;
    
	// Load source code and initialize vertex an fragment shader.
    var vertexShaderSourceCode = getShaderSourceCode("shader-vs");
	vertexShader = initShader(gl, gl.VERTEX_SHADER, vertexShaderSourceCode);
	var fragmentShaderSourceCode = getShaderSourceCode("shader-fs");
	fragmentShader = initShader(gl, gl.FRAGMENT_SHADER, fragmentShaderSourceCode);

	// Create shader program.
	shaderProgram = gl.createProgram();
	// Attach shader to shader program.
	gl.attachShader(shaderProgram, vertexShader);
	gl.attachShader(shaderProgram, fragmentShader);
	gl.linkProgram(shaderProgram);
	// Check shader program.
	if (!gl.getProgramParameter(shaderProgram, gl.LINK_STATUS)) {
		alert("Could not initialise shaders");
	}
	// Use the shader program in the rendering pipeline.
	gl.useProgram(shaderProgram);

	// Set parameter and variables for shader program.
	//
	// glGetAttribLocation: returns index of generic vertex attribute that is bound to that attribute variable.
	// We store the position of the attribute in the shader program into an new object variable. 
	shaderProgram.vertexPositionAttribute = gl.getAttribLocation(shaderProgram, "aVertexPosition");
	// Tell WebGL that we will want to provide values for the attribute using an array.
	gl.enableVertexAttribArray(shaderProgram.vertexPositionAttribute);
	//
	shaderProgram.vertexColorAttribute = gl.getAttribLocation(shaderProgram, "aVertexColor");
    gl.enableVertexAttribArray(shaderProgram.vertexColorAttribute);
	
	// Store location of matrices, as specific uniform variable within the linked program, in shaderProgram object
	shaderProgram.pMatrixUniform = gl.getUniformLocation(shaderProgram, "uPMatrix");
	shaderProgram.mvMatrixUniform = gl.getUniformLocation(shaderProgram, "uMVMatrix");
}


