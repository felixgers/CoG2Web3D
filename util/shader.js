/**
 * Load shader source code and init shaders and shader program.
 */

function Shader(gl, vertexShader, fragmentShader) {	
	// Public variables.
	this.gl = gl;
	this.shaderProgram;
//	this.vertexShader;
//	this.fragmentShader;

	this.loadShaders(vertexShader, fragmentShader);
};

Shader.prototype.initShader = function(type, shaderSourceCode) {
	var shader = this.gl.createShader(type);

	this.gl.shaderSource(shader, shaderSourceCode);
	this.gl.compileShader(shader);

	if (!this.gl.getShaderParameter(shader, this.gl.COMPILE_STATUS)) {
		alert("Could not compile shader: "+this.gl.getShaderInfoLog(shader));
		return null;
	}
	return shader;
};


Shader.prototype.initShaderProgram = function(vertexShader, fragmentShader) {	
	var gl = this.gl;

	// Create shader program.
	var shaderProgram = gl.createProgram();
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

	this.shaderProgram = shaderProgram;
};


//Shader.prototype.cbLoadShaders = function(shaderSourceCode) {
////Init vertex shader.
//var vertexShader = this.initShader(this.gl.VERTEX_SHADER, shaderSourceCode[0]);
////Init fragment shader.
//var fragmentShader = this.initShader(this.gl.FRAGMENT_SHADER, shaderSourceCode[1]);

//this.initShaderProgram(vertexShader, fragmentShader);
//};


Shader.prototype.loadShaders = function(vertexShader, fragmentShader) {
	var gl = this.gl;
	
	// Load source code and initialize vertex an fragment shader.
	var vertexShaderSourceCode = getShaderSourceCode(vertexShader);
	// Insert file load and keep compatibility, too!
	if(vertexShaderSourceCode==null) {
		//vertexShaderSourceCode = syncLoadFile(vertexShader, "text/plain");
		vertexShaderSourceCode = loadShaderFile(vertexShader);
	}
	vertexShader = this.initShader(gl.VERTEX_SHADER, vertexShaderSourceCode);

	var fragmentShaderSourceCode = getShaderSourceCode(fragmentShader);
	// Insert file load and keep compatibility, too!
	if(fragmentShaderSourceCode==null) {
		//fragmentShaderSourceCode = syncLoadFile(fragmentShader, "text/plain");
		fragmentShaderSourceCode = loadShaderFile(fragmentShader);
	}
	fragmentShader = this.initShader(gl.FRAGMENT_SHADER, fragmentShaderSourceCode);

	this.initShaderProgram(vertexShader, fragmentShader);

	/*
		var obj = this;
		this.callbackAfterShadesLoaded = callback;

		//	Load source code for both, vertex an fragment shader.
		loadFilesViaXMLHttpRequest(['../../shader/vertex.shader', '../../shader/fragment.shader'], 
				function(shaderSourceCode){
			obj.cbLoadShaders(shaderSourceCode);
		}, 
		function (url) { // Error callback.
			alert('Failed to download "' + url + '"');} );
	 */

	//	// Load source code from HTML tag and initialize vertex an fragment shader.
	//	var vertexShaderSourceCode = getShaderSourceCode("shader-vs");
	//	vertexShader = initShader(gl, gl.VERTEX_SHADER, vertexShaderSourceCode);
	//	var fragmentShaderSourceCode = getShaderSourceCode("shader-fs");
	//	fragmentShader = initShader(gl, gl.FRAGMENT_SHADER, fragmentShaderSourceCode);
};


/*
 * Load shader source code from file/url and return content.
 */
/*
Shader.prototype.load = function(url) {
	request = new XMLHttpRequest();
//	try { request = new XMLHttpRequest(); }
//	catch(e) { 
//		alert("Could not create XMLHttpRequest"); 
//		return null;
//	}
	// Do not open asynchronously, thus wait for the response.
	request.open("GET", url, false); 
	request.send(null);
	//alert("...back: "+request);
	// Check if we got HTTP status 200 (OK)
	if (request.status == 200) {
		return request.responseText;
	} else { // Failed
		alert("Could not load shader file: "+url); 
		return null;
	}
};
*/

function loadShaderFile(url) {
	request = new XMLHttpRequest();
//	try { request = new XMLHttpRequest(); }
//	catch(e) { 
//		alert("Could not create XMLHttpRequest"); 
//		return null;
//	}
	// Do not open asynchronously, thus wait for the response.
	request.open("GET", url, false); 
	request.send(null);
	//alert("...back: "+request);
	// Check if we got HTTP status 200 (OK)
	if (request.status == 200) {
		return request.responseText;
	} else { // Failed
		alert("Could not load shader file: "+url); 
		return null;
	}
};




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


