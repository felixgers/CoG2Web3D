/**
 * Scene
 * 
 * @param gl
 * @param sceneGraph
 * @param canvas
 * @param framerate
 * @returns {Scene}
 */
function Scene() 
{
	// Variables used in the draw method.
	this.gl;
	this.canvas;
	this.framerate;
	this.shader;
	this.sceneGraph;
	//this.camera; // todo set this

	this.matrices;

	this.intervalTimer = null;	
	this.startTime = 0.0; 
	this.timerHandle = null;
	this.sceneHasCamera = false; // will be set automatically

	// Viewing parameter.
	this.aspectRatio;
	this.verticalViewAngle = 45.0;

	this.init = function(gl, canvas, aspectRatio, framerate, shader) {
		this.gl = gl;
		this.canvas = canvas;
		this.aspectRatio = aspectRatio;
		this.framerate = framerate;
		this.shader = shader;

		this.matrices = new Matrices();

		this.sceneGraph = this.buildSceneGraph();
		
		this.sceneHasCamera = this.recursiveSceneHasCamera(this.sceneGraph);
		if(!this.sceneHasCamera) {
			alert("The scene graph has no camera node.\nUsing default perspective.");
		}

		// DEBUG
		// --------------------------------------------
		this.lastTime = 0.0;
		this.debug = document.createElement("div");
		this.canvas.parentNode.appendChild(this.debug);
		// --------------------------------------------

		return this;
	};

	/**
	 * Start the scene, scene time.
	 */
	this.start = function() {
		with(this){
			

			gl.clearColor(0.0, 0.0, 0.0, 1.0);
			gl.enable(gl.DEPTH_TEST);

			// Draw once first.
			this.sceneGraph.init(gl, matrices.pMatrix, matrices.mvMatrix, shader.shaderProgram);
			this.drawSceneGraph(0.0);

			// Start interval
			var startDate = new Date();
			this.startTime = startDate.getTime()/1000.0;
			var scene = this;
			this.timerHandle = window.setInterval( function(){scene.update();}, (1000.0/this.framerate));
		}
	};


	/**
	 * Draw scene graph
	 */
	this.drawSceneGraph = function(time) {

		// Some shortcuts for variables.
		var gl = this.gl;
		var pMatrix = this.matrices.pMatrix;
		var mvMatrix = this.matrices.mvMatrix;
		var sceneGraph = this.sceneGraph;

		// Clear canvas an z-buffer.
		gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
		mat4.identity(mvMatrix); // Set to identity.
		mat4.identity(pMatrix); // Set to identity.

		if(!this.sceneHasCamera) {		
			mat4.perspective(45.0, this.aspectratio, 1, 100, pMatrix);
		}
		sceneGraph.draw(time);
	};


	/**
	 * Called by window interval handler
	 */
	this.update = function() {

		// Calculate time
		var newDate = new Date();
		var time = (newDate.getTime() / 1000.0) - this.startTime;

		this.drawSceneGraph(time);

		// DEBUG
		// --------------------------------------------
		this.debug.innerHTML = Math.round(10/(time-this.lastTime))/10.0+" fps";
		this.lastTime = time;
		// --------------------------------------------
	};


	/**
	 * Stop scene time
	 */
	this.stop = function() {
		window.clearInterval(this.timerHandle);
		this.timerHandle = null;
	};


	/**
	 * This method checks if the scene graph has a camera node attached.
	 */
	this.recursiveSceneHasCamera = function(node) {
		if(node.groupFlag) {
			var children = node.children;
			for(var i=0; i<children.length; i++) {
				if(this.recursiveSceneHasCamera(children[i])) {
					return true;
				}
			}
		} else if (node.cameraFlag) {
			return true;
		}
		return false;
	};
}

/**
 * This function is to be overwritten in a child class.
 * @returns {sceneGraph}
 */
Scene.prototype.buildSceneGraph = function(){

	// Create some special Nodes
	var sceneGraph = new Group();
	var camera = new PositionCamera(this.verticalViewAngle, this.aspectRatio , 1, 1000);
	// Add all nodes directly (no other groups) to scene graph
	sceneGraph.addChild(camera); // <------- Camera
	sceneGraph.addChild(new Translation( 0, 0, -8.0));
	sceneGraph.addChild(new RotorY(1.0));
	sceneGraph.addChild(new Triangle(2.0, 2.0));
	return sceneGraph;
};


////////////////////dependent imports ////////////////////

import("myScene.js");
