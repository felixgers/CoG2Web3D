dojo.provide("BGE.Shader");
/*
 * Load shader source code and initialize shader and shader program.
 * Names for shader can be files/urls or HTML ids.
 */
BGE.Shader = function () {

    "use strict";

	// Public members.
	this.shaderProgram = null;
	// Private members.
	var vertexShaderAttrib;

    /*
    *  Create and compile shader given the source.
    */
    function initShader(gl, type, shaderSourceCode) {
        if (!shaderSourceCode) {
            console.error("Could not find shader source: "  + shaderSourceCode);
        }

        var shader = gl.createShader(type);

        gl.shaderSource(shader, shaderSourceCode);
        gl.compileShader(shader);

        if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
            console.error("Could not compile shader: " + gl.getShaderInfoLog(shader));
            return null;
        }
        return shader;
    }

     /*
     *  Create and initialize shader program given the compiled shader.
     */
    function initShaderProgram(gl, vertexShader, fragmentShader) {
    // Create shader program.
        var shaderProgram = gl.createProgram();
        // Attach shader to shader program.
        gl.attachShader(shaderProgram, vertexShader);
        gl.attachShader(shaderProgram, fragmentShader);

        // setup attributes (optional)
        // Bind custom attributes to their locations.
        //gl.bindAttribLocation(shaderProgram, index,"myAttribute");

        // Link the shader into the shader program.
        gl.linkProgram(shaderProgram);
        // Check shader program.
        if (!gl.getProgramParameter(shaderProgram, gl.LINK_STATUS)) {
            console.error("Could not initialise shader program");
            return null;
        }
        // These are no longer needed, they are in the shader program.
        gl.deleteShader(vertexShader);
        gl.deleteShader(fragmentShader);

        // Use the shader program in the rendering pipeline.
        gl.useProgram(shaderProgram);

        // Setup attributes for vertex shader.
        // glGetAttribLocation: returns index of generic vertex attribute that is bound to that attribute variable.
        // We store the position of the attribute in the shader program into an new object variable.
        shaderProgram.vertexPositionAttribute = gl.getAttribLocation(shaderProgram, "aVertexPosition");
        // Tell WebGL that we will want to provide values for the attribute using an array.
        gl.enableVertexAttribArray(shaderProgram.vertexPositionAttribute);

        shaderProgram.vertexColorAttribute = gl.getAttribLocation(shaderProgram, "aVertexColor");
        gl.enableVertexAttribArray(shaderProgram.vertexColorAttribute);


        // Setup uniforms.
        // Store location of matrices, as specific uniform variable within the linked program.
        shaderProgram.pMatrixUniform = gl.getUniformLocation(shaderProgram, "uPMatrix");
        shaderProgram.mvMatrixUniform = gl.getUniformLocation(shaderProgram, "uMVMatrix");

        return shaderProgram;
    }


    /*
     * Try to load the shader source from an HTML tag
     * with given name as id.
     */
    function getShaderSourceCodeFromHTMLTag(id) {
        var shaderScript,
            str,
            k;

        shaderScript = document.getElementById(id);
        if (!shaderScript) {
            return null;
        }
        str = "";
        k = shaderScript.firstChild;
        while (k) {
            if (k.nodeType === 3) {
                str += k.textContent;
            }
            k = k.nextSibling;
        }
        return str;
    }

    /*
    * Load shader source code from file/url and return content.
    */
    function loadShaderFile(url) {

        var request,
            localFileSys;

        try {
            request = new XMLHttpRequest();
        } catch (e) {
            console.error("Could not create XMLHttpRequest");
            return null;
        }
        // Check whether document is located in local file system.
        localFileSys = document.URL.match(/^file:\/\/.*?$/);

        // Do not open asynchronously, thus wait for the response.
        request.open("GET", url, false);
        request.overrideMimeType("text/plain");
        request.send(null);
        // Check if we got HTTP status 200 (OK) or in local file system status 0
        if ((localFileSys && request.status === 0) || request.status === 200) {
            return request.responseText;
        } else { // Failed
            console.error("Could not load shader file: " + url);
            return null;
        }
    }

	
	/*
	 *  Load shader source code and initialize vertex an fragment shader.
	 * @param gl
	 * @param vertexShaderName
	 * @param fragmentShaderName
	 * @param vertexShaderAttrib :  Array parameter for the vertex shader attributes.
	 * @returns {Shader}
	 */
	this.init = function (gl, vertexShaderName, fragmentShaderName, p_vertexShaderAttrib) {
		
		vertexShaderAttrib = p_vertexShaderAttrib;

        var vertexShaderSourceCode,
            vertexShader,
            fragmentShader,
            fragmentShaderSourceCode;

		vertexShaderSourceCode = getShaderSourceCodeFromHTMLTag(vertexShaderName) || loadShaderFile(vertexShaderName);
	    vertexShader = initShader(gl, gl.VERTEX_SHADER, vertexShaderSourceCode);

		fragmentShaderSourceCode = getShaderSourceCodeFromHTMLTag(fragmentShaderName) || loadShaderFile(fragmentShaderName);
		fragmentShader = initShader(gl, gl.FRAGMENT_SHADER, fragmentShaderSourceCode);

		// Create and initialize the shader program.
		this.shaderProgram = initShaderProgram(gl, vertexShader, fragmentShader);

		// Delete functions the are not used again after execution to free resources.
		//delete initShaderProgram;
		//delete initShader;
		//delete loadShaderFile;
		//delete getShaderSourceCodeFromHTMLTag;
		//delete init;
		
		return this;
	};


};
