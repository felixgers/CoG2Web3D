/**
 *
 * Basic nodes for scene graph.
 * 
 */


/**
 * 
 * @returns {Node}
 */
function Node() {
	this.draw = function(gl, pMatrix, mvMatrix, time) {};
}

/**
 * 
 * @returns {Group}
 */
function Group() {
	this.children = new Array();
	this.addChild = function(child) {
		this.children.push(child);
	};
	
	this.draw = function(gl, pMatrix, mvMatrix, time) {
		var children = this.children;
		for(var i=0; i<children.length; i++) {
			children[i].draw(gl, pMatrix, mvMatrix, time);
		}
	};
}
Group.prototype = new Node;


/**
 * Separator. Group node which separates all transforms.  
 * @returns {Separator}
 */
function Separator() {
	this.children = new Array();
	
	this.draw = function(gl, pMatrix, mvMatrix, time) {
		var tempPMatrix = new glMatrixArrayType(16);
		var tempMvMatrix = new glMatrixArrayType(16);
		
		// Store values in temp matrices.
		mat4.set(pMatrix, tempPMatrix);
		mat4.set(mvMatrix, tempMvMatrix);
		var children = this.children;
		for(var i=0; i<children.length; i++) {
			children[i].draw(gl, pMatrix, mvMatrix, time);
		}
		
		// Restore values to matrices.
		mat4.set(tempPMatrix, pMatrix);
		mat4.set(tempMvMatrix, mvMatrix);
	};
}
Separator.prototype = new Group;


/**
 * Translation node. 
 * @param x
 * @param y
 * @param z
 * @returns {Translation}
 */
function Translation(x, y, z) {
	this.trans = new Array(x,y,z);
	this.draw = function(gl, pMatrix, mvMatrix, time) {
		mat4.translate(mvMatrix, this.trans); // Translate.
	};
}
Translation.prototype = new Node;

/**
 * Scale node 
 * @param x
 * @param y
 * @param z
 * @returns {Scale}
 */
function Scale(x, y, z) {
	this.scale = new Array(x,y,z);
	this.draw = function(gl, pMatrix, mvMatrix, time) {
		mat4.scale(mvMatrix, this.scale);
	};
}
Scale.prototype = new Node();


/**
 * Y Rotation rotor
 * animates a y rotation
 * @param speed as frequency (rotations per second)
 */
function RotorY(speed) { 
	this.speed = speed;
	this.draw = function(gl, pMatrix, mvMatrix, time) {
		mat4.rotateY(mvMatrix, Math.PI * this.speed * time);
	};
}


/**
 * Shape base class
 * @param gl
 * @returns {Shape}
 */
function Shape() {
	this.buffer = null;
	this.itemSize = 0;
	this.numItems = 0;
	this.beginMode = 0;

	this.draw = function(gl, pMatrix, mvMatrix, time) {
		gl.bindBuffer(gl.ARRAY_BUFFER, this.buffer);		
		gl.vertexAttribPointer(shaderProgram.vertexPositionAttribute, this.itemSize, gl.FLOAT, false, 0, 0);

		// Push the modified matrices into the the shader program,
		// at the correct position, that we stored.
		gl.uniformMatrix4fv(shaderProgram.pMatrixUniform, false, pMatrix);
		gl.uniformMatrix4fv(shaderProgram.mvMatrixUniform, false, mvMatrix);
		
		gl.drawArrays(this.beginMode, 0, this.numItems);
	};
}
Shape.prototype = new Node;


/**
 * 
 * @param gl
 * @param width
 * @param height
 * @returns {Rectangle}
 */
function Rectangle(gl, width, height) {
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
	this.beginMode = gl.TRIANGLE_STRIP;
}
Rectangle.prototype = new Shape;


/**
 * 
 * @param gl
 * @param width
 * @param height
 * @returns {Triangle}
 */
function Triangle(gl, width, height)
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
	this.beginMode = gl.TRIANGLES;
}
Triangle.prototype = new Shape;


