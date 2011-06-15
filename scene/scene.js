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
	this.matrices;
	this.shader;
	this.sceneGraph;
	this.camera = null;	// will be set automatically given the scenegraph.

	// Viewing parameter.
	this.aspectRatio;
	this.verticalViewAngle = 45.0;

	this.init = function(gl, canvas, aspectRatio, shader) {
		this.gl = gl;
		this.canvas = canvas;
		this.aspectRatio = aspectRatio;
		this.shader = shader;
		
		this.matrices = new Matrices();
		
		// Set the scene graph
		this.sceneGraph = this.buildSceneGraph();

		this.camera = this.recursiveSceneHasCamera(this.sceneGraph);
		if(!this.camera) {
			alert("The scene graph has no camera node.\nUsing default perspective.");
		}
		
		this.InitGL();

		return this;
	};

	/**
	 * Start the scene, scene time.
	 */
	this.InitGL = function() {
		with(this){
			gl.clearColor(0.0, 0.0, 0.0, 1.0);
			gl.enable(gl.DEPTH_TEST);

			// Draw once first.
			sceneGraph.init(gl, matrices.pMatrix, matrices.mvMatrix, shader.shaderProgram);
			drawSceneGraph(0.0);
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

		if(!this.camera) {		
			mat4.perspective(45.0, this.aspectratio, 1, 100, pMatrix);
		}
		sceneGraph.draw(time);
	};

	/**
	 * This method checks if the scene graph has a camera node attached.
	 */
	this.recursiveSceneHasCamera = function(node) {
		if(node.groupFlag) {
			var children = node.children;
			for(var i=0; i<children.length; i++) {
				node = this.recursiveSceneHasCamera(children[i]);
				if(node) {
					return node;
				}
			}
		} else if (node.cameraFlag) {
			return node;
		}
		return null;
	};
}

/**
 * Override this method to create a scene graph.
 * @returns {Group}
 */
Scene.prototype.buildSceneGraph = function() {
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
