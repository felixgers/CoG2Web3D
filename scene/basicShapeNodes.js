/**
 * 
 * @param gl
 * @param width
 * @param height
 * @returns {Triangle}
 */
function Triangle(width, height)
{
	var gl = this.gl;
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
}
Triangle.prototype = new Shape;


/**
 * 
 * @param gl
 * @param width
 * @param height
 * @returns {Rectangle}
 */
function Rectangle(width, height) {
	var gl = this.gl;
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
}
Rectangle.prototype = new Shape;



/**
 * 
 * @param gl
 * @param width
 * @param height
 * @returns {Triangle}
 */
function Box(width, height)
{
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
}
Box.prototype = new Shape;


