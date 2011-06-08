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

	this.init = function(gl, pMatrix, mvMatrix, shaderProgram){
		this.gl = gl;
		this.pMatrix = pMatrix;
		this.mvMatrix = mvMatrix;
		this.shaderProgram = shaderProgram;

		with(this){
			for(var i=0; i<children.length; i++) {
				children[i].init(gl, pMatrix, mvMatrix, shaderProgram);
			}
		}
	};	

	this.draw = function(time) { 
		with(this) {

			var tempPMatrix = new glMatrixArrayType(16);
			var tempMvMatrix = new glMatrixArrayType(16);

			// Store values in temp matrices.
			mat4.set(pMatrix, tempPMatrix);
			mat4.set(mvMatrix, tempMvMatrix);

			var children = this.children;
			for(var i=0; i<children.length; i++) {
				children[i].draw(time);
			}
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
	this.beginMode = 0;

	this.draw = function(time) { 
		with(this) {

			gl.bindBuffer(gl.ARRAY_BUFFER, this.buffer);	
			gl.vertexAttribPointer(shaderProgram.vertexPositionAttribute, this.itemSize, gl.FLOAT, false, 0, 0);

			// Push the modified matrices into the the shader program,
			// at the correct position, that we stored.
			gl.uniformMatrix4fv(shaderProgram.pMatrixUniform, false, pMatrix);
			gl.uniformMatrix4fv(shaderProgram.mvMatrixUniform, false, mvMatrix);

			gl.drawArrays(this.beginMode, 0, this.numItems);
		}
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



/**
 * Simple perspective campera 
 * 
 * @param verticalFieldOfView
 * @param aspectratio
 * @returns {PerspectiveCamera}
 */
function PerspectiveCamera(verticalFieldOfView, aspectratio, nearClipPlane, farClipPlane)
{
	this.cameraFlag = true;
	this.verticalFieldOfView = verticalFieldOfView;
	this.aspectratio = aspectratio;
	this.nearClipPlane = nearClipPlane;
	this.farClipPlane = farClipPlane;

	this.draw = function(time) { 
		var fov = this.verticalFieldOfView;
		var ar = this.aspectratio;
		var nc = this.nearClipPlane;
		var fc = this.farClipPlane;
		mat4.perspective(fov, ar, nc, fc, this.pMatrix);
	};
}
PerspectiveCamera.prototype = new Node;


/**
 * 

 * @param verticalFieldOfView
 * @param aspectratio
 * @param nearClipPlane
 * @param farClipPlane
 * @returns {PositionCamera}
 */
function PositionCamera(verticalFieldOfView, aspectratio, nearClipPlane, farClipPlane)
{
	this.cameraFlag = true;
	this.verticalFieldOfView = verticalFieldOfView;
	this.aspectratio = aspectratio;
	this.nearClipPlane = nearClipPlane;
	this.farClipPlane = farClipPlane;

	this.position = [0,0,0];
	this.yrotation = 0.0; // <---
	this.xrotation = 0.0; // <---
	this.speedF = 0; // <---
	this.speedS = 0; // <---

	this.maxSpeed = 1.0;
	this.smoothArrayF = new Array(8);
	this.smoothArrayS = new Array(8);
	for(var i=0;i<8;i++) {
		this.smoothArrayF[i] = 0.0;
		this.smoothArrayS[i] = 0.0;
	}

	this.smoothIndex = 0;


	this.draw = function(time) {
		with(this){

			var fov = this.verticalFieldOfView;
			var ar  = this.aspectratio;
			var nc  = this.nearClipPlane;
			var fc  = this.farClipPlane;
			var pos = this.position;
			var yrt = this.yrotation;
			var xrt = this.xrotation;
			var ind = this.smoothIndex;
			var arrF = this.smoothArrayF;
			var arrS = this.smoothArrayS;

			ind++;
			if(ind>=8) ind = 0;
			arrF[ind] = this.speedF;
			arrS[ind] = this.speedS;
			this.smoothIndex = ind;
			var i = 0;

			// get smoothed speeds
			var vF = 0.0;
			var vS = 0.0;
			for(i=0;i<8;i++) {
				vF += arrF[i];
				vS += arrS[i];
			}
			vF/=8.0;
			vS/=8.0;

			// get velocity vector
			var cosx = Math.cos(xrt);
			var xv =  -Math.sin(yrt) * cosx;
			var yv =                  Math.sin(xrt);
			var zv = Math.cos(yrt) * cosx;

			// forward backward
			if(vF != 0.0) {
				pos[0] += vF *  xv;
				pos[1] += vF *  yv;
				pos[2] += vF *  zv;
			}

			// shift left right 
			if(vS != 0.0) {
				// The rest of a cross product with a z-axis
				pos[0] += vS * -zv;   
				pos[2] += vS * xv; 
			}

			mat4.perspective(fov, ar, nc, fc, pMatrix);
			mat4.rotateX(pMatrix, xrt);
			mat4.rotateY(pMatrix, yrt);
			mat4.translate(pMatrix, pos);

			this.position = pos;
		}
	};
};
PositionCamera.prototype = new Node;



/**
 * Specialized scene graph nodes for template scene.
 */

/**
 * An x rotor with variable speed.
 * @param startSpeed
 * @returns {RotorXMutableSpeed}
 */
function RotorXMutableSpeed(startSpeed) 
{ 
	this.speed = startSpeed;    // <-- mutable speed. Change this.
	this.currentRotation = 0.0;
	this.lastTime = 0.0;

	// May be someone can help to optimize this method or get is faster.
	this.draw = function(time) {
		this.currentRotation += (time - this.lastTime) * Math.PI * this.speed;
		mat4.rotateX(this.mvMatrix, this.currentRotation);
		this.lastTime = time;
	};
}
RotorXMutableSpeed.prototype = new Node;


////////////////////dependent imports ////////////////////

import("MyNodes.js"); // MySpecializedEventManager
