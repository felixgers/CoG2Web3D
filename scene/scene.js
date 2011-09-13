BGE.namespace("Scene");
/**
 * Scene
 * 
 * @param gl
 * @param sceneGraph
 * @param canvas
 * @param framerate
 * @returns {Scene}
 */
BGE.Scene = function()
{
	// Variables used in the draw method.
	this.gl;
	this.canvas;
	// Projection matrix stack.
	this.pMatrix;
	// Model-View matrix stack.
	this.mvMatrix;

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

		this.pMatrix = new MatrixStack();
		this.mvMatrix = new MatrixStack();

		// Set the scene graph
		this.sceneGraph = this.buildSceneGraph();

		this.camera = this.recursiveSceneHasCamera(this.sceneGraph);
		if(!this.camera) {
			alert("The scene graph has no camera node.\nUsing default perspective.");
		}

		this.initGL();

		return this;
	};

	/**
	 * Start the scene, scene time.
	 */
	this.initGL = function() {
		this.gl.clearColor(0.0, 0.0, 0.0, 1.0);
		this.gl.enable(this.gl.DEPTH_TEST);
		this.sceneGraph.init(this.gl, this.pMatrix, this.mvMatrix, this.shader.shaderProgram);
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
BGE.Scene.prototype.buildSceneGraph = function() {
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



/**
 * Draw animated scene and scene graph.
 */
BGE.Scene.prototype.draw = function(time) {
	var gl=this.gl;
    var mvMatrix=this.mvMatrix;
    var pMatrix=this.pMatrix;
   	// Clear canvas an z-buffer.
	gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
	mvMatrix.identity();
	pMatrix.identity();

    // Set some default frustrum.
	if(!this.camera) {
		pMatrix.perspective(45.0, this.aspectratio, 1, 100);
	}

	this.update(time);
	this.sceneGraph.draw(time);
};

/**
 * Handle animation and interaction in the scene and the scene graph.
 */
BGE.Scene.prototype.update = function(time) {
};


/**
 * Override to handle events.
 * @param event
 */
BGE.Scene.prototype.handleMouseEvent = function(e) {
};

/**
 * Override to handle events.
 * @param event
 */
BGE.Scene.prototype.handleKeyDown = function(e) {
	switch (e.keycode) {
	case 38: // up arrow
		if(up)
			camera.speedF = 1.0;
		else
			this.camera.speedF = 0.0;
		break;

	case 40: // down arrow
		if(up)
			this.camera.speedF = -1.0;
		else
			this.camera.speedF = 0.0;
		break;

	case 37: // left arrow
		if(up)
			this.camera.speedS = -1.0;
		else
			this.camera.speedS = 0.0;
		break;

	case 39: // right arrow
		if(up)
			this.camera.speedS = 1.0;
		else
			this.camera.speedS = 0.0;
		break;

	default:
		break;
	}
};

/**
 * Override to handle events.
 * @param event
 */
BGE.Scene.prototype.handleKeyUp = function(e) {
};


////////////////////dependent imports ////////////////////

BGE.importScript("myScene.js");

