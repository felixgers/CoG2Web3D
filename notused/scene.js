/**
 * 
 */

function Scene(canvas, gl, matrices, shader, buffer) {
	// Variables used in the draw method.
	this.canvas = canvas;
	this.gl = gl;
	this.matrices = matrices;
	this.shader = shader;
	this.buffer = buffer;
	// Variables for animation.
	var rotTri = 0;
	var rotSquare = 0;

	// Initialize the scene.
	// Set things that do not change from frame to frame.
	this.init = function() {
		// Initialize perspective, i.e. the projection matrix.
		// document.write(canvas.width+" / "+canvas.height);
		var aspectratio = this.canvas.width / this.canvas.height; // 4/3
		var verticalFieldOfView = 45; // degrees. 
		mat4.perspective(verticalFieldOfView, aspectratio, 1, 100, this.matrices.pMatrix);
	};	

	// Draw and animate the scene.
	this.draw = function() {
		// Some shortcuts for variables.
		var gl = this.gl;
		var matrices = this.matrices;
		var pMatrix = this.matrices.pMatrix;
		var mvMatrix = this.matrices.mvMatrix;
		var buffer = this.buffer;
		var shaderProgramm = this.shader.shaderProgram;
		var vertexShader = this.shader.vertexShader;
		var fragmentShader = this.shader.fragmentShader;

		// Clear canvas an z-buffer.
		gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

		mat4.identity(mvMatrix); // Set to identity.
		mat4.translate(mvMatrix, [-1.5, 0, -7]); // Translate.
		matrices.mvPushMatrix();
		mat4.rotate(mvMatrix, degToRad(this.rotTri), [0, 1, 0]);

		// Pipe the vertex positions as attribute into the vertex shader.
		gl.bindBuffer(gl.ARRAY_BUFFER, buffer.triangleVertexPositionBuffer);		
		gl.vertexAttribPointer(shaderProgram.vertexPositionAttribute, buffer.triangleVertexPositionBuffer.itemSize, gl.FLOAT, false, 0, 0);
		gl.bindBuffer(gl.ARRAY_BUFFER, triangleVertexColorBuffer);
		gl.vertexAttribPointer(shaderProgram.vertexColorAttribute, triangleVertexColorBuffer.itemSize, gl.FLOAT, false, 0, 0);
		this.setMatrixUniforms();
		gl.drawArrays(gl.TRIANGLES, 0, buffer.triangleVertexPositionBuffer.numItems);

		matrices.mvPopMatrix();

		mat4.translate(mvMatrix, [3, 0, 0]); // Translate.
		matrices.mvPushMatrix();
		mat4.rotate(mvMatrix, degToRad(this.rotSquare), [1, 0, 0]);

		gl.bindBuffer(gl.ARRAY_BUFFER, buffer.squareVertexPositionBuffer);
		gl.vertexAttribPointer(shaderProgram.vertexPositionAttribute, buffer.squareVertexPositionBuffer.itemSize, gl.FLOAT, false, 0, 0);
		gl.bindBuffer(gl.ARRAY_BUFFER, squareVertexColorBuffer);
		gl.vertexAttribPointer(shaderProgram.vertexColorAttribute, squareVertexColorBuffer.itemSize, gl.FLOAT, false, 0, 0);
		this.setMatrixUniforms();
		gl.drawArrays(gl.TRIANGLE_STRIP, 0, buffer.squareVertexPositionBuffer.numItems);

		matrices.mvPopMatrix();
	};

	this.animate = function() {
		var timeNow = new Date().getTime();
		if (lastTime != 0) {
			var elapsed = timeNow - lastTime;

			rotTri += (90 * elapsed) / 1000.0;
			rotSquare += (75 * elapsed) / 1000.0;
		}
		lastTime = timeNow;
	};

	this.setMatrixUniforms = function() {
		// This has to called after modifying the model-view or the projection matrix.
		// We push the modified matrix into the shader program.

		// Some shortcuts for variables.
		var gl = this.gl;
		var matrices = this.matrices;
		var pMatrix = this.matrices.pMatrix;
		var mvMatrix = this.matrices.mvMatrix;
		var shaderProgramm = this.shader.shaderProgram;

		// Push the modified matrices into the the shader program,
		// at the correct position, that we stored.
		gl.uniformMatrix4fv(shaderProgram.pMatrixUniform, false, pMatrix);
		gl.uniformMatrix4fv(shaderProgram.mvMatrixUniform, false, mvMatrix);
	};
}