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
	this.shader;
	this.sceneGraph;
	//this.camera = null; // todo set this

	this.matrices;

	this.sceneHasCamera = false; // will be set automatically // to replace with camera == null

	// Viewing parameter.
	this.aspectRatio;
	this.verticalViewAngle = 45.0;

	this.init = function(gl, canvas, aspectRatio, shader) {
		this.gl = gl;
		this.canvas = canvas;
		this.aspectRatio = aspectRatio;
		this.shader = shader;
		this.matrices = new Matrices();
		return this;
	};


	this.setSceneGraph = function(sceneGraph) {
		this.sceneGraph = sceneGraph;
		this.sceneHasCamera = this.recursiveSceneHasCamera(this.sceneGraph);
		if(!this.sceneHasCamera) {
			alert("The scene graph has no camera node.\nUsing default perspective.");
		}
		this.InitGL();
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

		if(!this.sceneHasCamera) {		
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

