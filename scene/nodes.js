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
			var tempPMatrix = new glMatrixArrayType(16);
			var tempMvMatrix = new glMatrixArrayType(16);

			// Store values in temp matrices.
			mat4.set(pMatrix, tempPMatrix);
			mat4.set(mvMatrix, tempMvMatrix);

			for(var i=0; i<children.length; i++) {
				this.children[i].draw(time);
			}
			mat4.set(tempPMatrix, pMatrix);
			mat4.set(tempMvMatrix, mvMatrix);
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
		mat4.translate(this.mvMatrix, this.trans); // Translate.
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
		mat4.scale(this.mvMatrix, this.scale);
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
		mat4.rotateY(this.mvMatrix, Math.PI * this.speed * time);
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
			gl.uniformMatrix4fv(shaderProgram.pMatrixUniform, false, pMatrix);
			gl.uniformMatrix4fv(shaderProgram.mvMatrixUniform, false, mvMatrix);

			gl.drawArrays(this.tesselationMode, 0, this.numItems);
		}
	};
}
Shape.prototype = new Node;


////////////////////dependent imports ////////////////////

import("../../scene/basicShapeNodes.js");
import("../../scene/cameraNodes.js");
import("../../scene/specialNodes.js");
import("MyNodes.js"); // MySpecializedEventManager
