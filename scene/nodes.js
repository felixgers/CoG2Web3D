/**
 *
 * Basic nodes for scene graph.
 * 
 */

BGE.namespace("Node");
/**
 * Base node
 * @returns {Node}
 */
BGE.Node=function() {
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

BGE.namespace("Node.Group");
/**
 * 
 * @returns {Group}
 */
BGE.Node.Group = function() {
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
        var mvMatrix=this.mvMatrix;
		// Preserve the current transformation.
		// Not for the perspective, assuming it does not change.
		mvMatrix.push();

		for(var i=0; i<this.children.length; i++) {
		    this.children[i].draw(time);
		}
		// Go back up in transformation hierarchy.
		mvMatrix.pop();
	};
}
BGE.Node.Group.prototype = new BGE.Node;

BGE.Node.Group.prototype.reload=function(){
		for(var i=0; i<this.children.length; i++) {
			this.children[i].init(this.gl, this.pMatrix, this.mvMatrix, this.shaderProgram);
		}
	}

BGE.Node.Group.prototype.clear=function(){
        while(this.children.length>1){
            this.children.pop();
        }

	}
//in file transitions

BGE.namespace("Node.Translation");
/**
 * Translation node. 
 * @param x
 * @param y
 * @param z
 * @returns {Translation}
 */
BGE.Node.Translation = function (x, y, z) {
	this.trans = new Array(x,y,z);
	this.draw = function(time) {
		this.mvMatrix.translate(this.trans);
	};
}
BGE.Node.Translation.prototype = new BGE.Node;


BGE.namespace("Node.Scale");
/**
 * Scale node 
 * @param x
 * @param y
 * @param z
 * @returns {Scale}
 */
BGE.Node.Scale = function(x, y, z) {
	this.scale = new Array(x,y,z);
	this.draw = function(time) { 
		this.mvMatrix.scale(this.scale);
	};
}
BGE.Node.Scale.prototype = new BGE.Node;



BGE.namespace("Node.Rotate");
/**
 * Rotation rotor
 * @param speed as frequency (rotations per second)
 */
BGE.Node.Rotate = function(xSpeed,ySpeed,zSpeed) {
	xSpeed *= 2.0 * Math.PI;
	ySpeed *= 2.0 * Math.PI;
	zSpeed *= 2.0 * Math.PI;
	this.draw = function(time) {
		this.mvMatrix.rotateX(xSpeed * time);
		this.mvMatrix.rotateY(ySpeed * time);
		this.mvMatrix.rotateZ(zSpeed * time);
	};
}
BGE.Node.Rotate.prototype = new BGE.Node;


////////////////////dependent imports ////////////////////

BGE.importScript("../../scene/basicShapeNodes.js");

