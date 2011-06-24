/**
 * 
 * @param width
 * @param height
 * @returns {Triangle}
 */
function Triangle(width, height)
{
	// Remember the bound super functions.
	this.superInit = this.init;
	this.init = function(gl, pMatrix, mvMatrix, shaderProgram){
		this.superInit(gl, pMatrix, mvMatrix, shaderProgram);
		// Create buffer for triangle vertex positions.
		this.buffer = gl.createBuffer();
		gl.bindBuffer(gl.ARRAY_BUFFER, this.buffer);
		var w = width/2.0;
		var h = height/2.0;
		var vertices = [
		                0.0,  h,  0.0,
		                -w, -h,  0.0,
		                w, -h,  0.0
		                ];
		gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);
		this.itemSize = 3;
		this.numItems = 3;
		this.tesselationMode = gl.TRIANGLES;
	};
}
Triangle.prototype = new Shape;


/**
 * 
 * @param width
 * @param height
 * @returns {Rectangle}
 */
function Rectangle(width, height) {
	// Remember the bound super functions.
	var self = this;
	this.superInit = this.init;
	this.init = function(gl, pMatrix, mvMatrix, shaderProgram){
		this.superInit(gl, pMatrix, mvMatrix, shaderProgram);
		// Create buffer for square vertex positions.
		this.buffer = gl.createBuffer();
		gl.bindBuffer(gl.ARRAY_BUFFER, this.buffer);
		var w = width/2.0;
		var h = height/2.0;
		var vertices = [
		                w,  h,  0.0,
		                -w,  h,  0.0,
		                w, -h,  0.0,
		                -w, -h,  0.0
		                ];
		gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);
		this.itemSize = 3;
		this.numItems = 4;
		this.tesselationMode = gl.TRIANGLE_STRIP;
	};
}
Rectangle.prototype = new Shape;



/**
 * 
 * @param width
 * @param height
 * @returns {Triangle}
 */
function Box(width, height, depth)
{
	this.superInit = this.init;
	this.init = function(gl, pMatrix, mvMatrix, shaderProgram){
		this.superInit(gl, pMatrix, mvMatrix, shaderProgram);
		// Create buffer for triangle vertex positions.
		this.buffer = gl.createBuffer();
		gl.bindBuffer(gl.ARRAY_BUFFER, this.buffer);
		var w = width/2.0;
		var h = height/2.0;
		var depth = depth/2.0;
		// Build the box from triangles.
		// First corners of Box are specified.
		// Corners are used for triangle vertices.
		var vertices = new Array;
		vertices.push();
//		                0.0,  h,  0.0,
//		                -w, -h,  0.0,
//		                w, -h,  0.0
//		                ];
		gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);
		this.itemSize = 3;
		this.numItems = 3;
		this.tesselationMode = gl.TRIANGLE_STRIP;
	};
}
Box.prototype = new Shape;

