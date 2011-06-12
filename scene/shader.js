
/*
 * Load shader source code and initialize shader and shader program.
 * Names for shader can be files/urls or HTML ids.
 */
function Shader(){
	this.shaderProgram;

	/*
	 *  Load shader source code and initialize vertex an fragment shader.
	 */
	this.init = function(gl, vertexShaderName, fragmentShaderName) {

		var vertexShaderSourceCode = getShaderSourceCodeFromHTMLTag(vertexShaderName)
		|| loadShaderFile(vertexShaderName);
		var vertexShader = initShader(gl, gl.VERTEX_SHADER, vertexShaderSourceCode);

		var fragmentShaderSourceCode = getShaderSourceCodeFromHTMLTag(fragmentShaderName)
		|| loadShaderFile(fragmentShaderName);
		var fragmentShader = initShader(gl, gl.FRAGMENT_SHADER, fragmentShaderSourceCode);

		// Create and initialize the shader program.
		this.shaderProgram = initShaderProgram(gl, vertexShader, fragmentShader);

		return this;
	};

	/*
	 *  Create and compile shader given the source.
	 */
	function initShader(gl, type, shaderSourceCode) {
		if( ! shaderSourceCode) {
			alert("Could not find shader source: "+shaderSourceCode);
		}

		var shader = gl.createShader(type);

		gl.shaderSource(shader, shaderSourceCode);
		gl.compileShader(shader);

		if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
			alert("Could not compile shader: "+gl.getShaderInfoLog(shader));
			return null;
		}
		return shader;
	};

	/*
	 *  Create and initialize shader program given the compiled shader.
	 */
	function initShaderProgram(gl, vertexShader, fragmentShader) {	
		// Create shader program.
		var shaderProgram = gl.createProgram();
		// Attach shader to shader program.
		gl.attachShader(shaderProgram, vertexShader);
		gl.attachShader(shaderProgram, fragmentShader);
		gl.linkProgram(shaderProgram);
		// Check shader program.
		if (! gl.getProgramParameter(shaderProgram, gl.LINK_STATUS)) {
			alert("Could not initialise shader program");
			return null;
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

		return shaderProgram;
	};

	/*
	 * Load shader source code from file/url and return content.
	 */
	function loadShaderFile(url) {
		try { var request = new XMLHttpRequest(); }
		catch(e) { 
			alert("Could not create XMLHttpRequest"); 
			return null;
		}
		// Do not open asynchronously, thus wait for the response.
		request.overrideMimeType("text/plain");
		request.open("GET", url, false); 
		request.send(null);
		// Check if we got HTTP status 200 (OK)
		if (request.status == 0) {
			return request.responseText;
		} else { // Failed
			alert("Could not load shader file: "+url); 
			return null;
		}
	};

	/*
	 * Try to load the shader source from an HTML tag
	 * with given name as id.
	 */
	function getShaderSourceCodeFromHTMLTag(id) {
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
	};
};
