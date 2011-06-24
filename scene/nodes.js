/**
 *
 * Basic nodes for scene graph.
 * 
 */


/**
 * Base node
 * @returns {Node}
 */
function Node() {
	this.gl;
	this.pMatrix;
	this.mvMatrix;
	this.shaderProgram;

	this.cameraFlag = false;
	this.rootFlag = false;
	this.groupFlag = false;

	this.init = function(gl, pMatrix, mvMatrix, shaderProgram){
		this.gl = gl;
		this.pMatrix = pMatrix;
		this.mvMatrix = mvMatrix;
		this.shaderProgram = shaderProgram;
	};	

	this.draw = function(time) {};
}


/**
 * 
 * @returns {Group}
 */
function Group() {
	this.groupFlag = true;
	this.children = new Array();
	this.addChild = function(child) {
		this.children.push(child);
	};
	this.superInit = this.init;
	this.init = function(gl, pMatrix, mvMatrix, shaderProgram){
		this.superInit(gl, pMatrix, mvMatrix, shaderProgram);

		for(var i=0; i<this.children.length; i++) {
			this.children[i].init(gl, pMatrix, mvMatrix, shaderProgram);
		}
	};	

	this.draw = function(time) { 
		with(this) {
			// Preserve the current transformation.
			// Not for the perspective, assuming it does not change.
			mvMatrix.push();

			for(var i=0; i<children.length; i++) {
				this.children[i].draw(time);
			}
			// Go back up in transformation hierarchy.
			mvMatrix.pop();
		}
	};
}
Group.prototype = new Node;


/**
 * Translation node. 
 * @param x
 * @param y
 * @param z
 * @returns {Translation}
 */
function Translation(x, y, z) {
	this.trans = new Array(x,y,z);
	this.draw = function(time) {
		this.mvMatrix.translate(this.trans);
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
	this.draw = function(time) { 
		this.mvMatrix.scale(this.scale);
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
	this.draw = function(time) {
		this.mvMatrix.rotateY(Math.PI * this.speed * time);
	};
}
RotorY.prototype = new Node;

/**
 * Shape base class
 * @param gl
 * @returns {Shape}
 */
function Shape() {
	this.buffer = null;
	this.itemSize = 0;
	this.numItems = 0;
	this.tesselationMode = 0;

	this.draw = function(time) { 
		with(this) {
			gl.bindBuffer(gl.ARRAY_BUFFER, this.buffer);	
			gl.vertexAttribPointer(shaderProgram.vertexPositionAttribute, this.itemSize, gl.FLOAT, false, 0, 0);
			// Push the modified matrices into the the shader program,
			// at the correct position, that we stored.
			gl.uniformMatrix4fv(shaderProgram.pMatrixUniform, false, pMatrix.top);
			gl.uniformMatrix4fv(shaderProgram.mvMatrixUniform, false, mvMatrix.top);

			gl.drawArrays(this.tesselationMode, 0, this.numItems);
		}
	};
}
Shape.prototype = new Node;


////////////////////dependent imports ////////////////////

importScript("../../scene/basicShapeNodes.js");

