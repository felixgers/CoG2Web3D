/**
 * main application
 * 
 * @returns {App}
 */
function App() {
	var self = this;
	this.canvas;
	this.aspectRatio;
	this.gl;
	this.shader;
	this.scene;
	this.sceneGraph;
	this.camera;
	this.eventManager;

	// Application parameter.
	this.width = 500;
	this.height = 500;
	this.framerate = 30.0;
	this.verticalViewAngle = 45.0;

	/** 
	 * @param canvas
	 * @returns
	 */
	var initGL = function(canvas) {
		try {
			var gl = canvas.getContext("experimental-webgl");
			gl.viewport(0, 0, canvas.width, canvas.height);
		} catch (e) {
		}
		if (!gl) {
			alert("No gl context: Could not initialise WebGL.");
		}
		return gl;
	};

	this.init = function() {
		with (this) {
			canvas = document.getElementById("canvas");
			canvas.width = width;
			canvas.height = height;
			aspectRatio = canvas.width / canvas.height;

			gl = initGL(canvas);

			buildSceneGraph();

			// Create Shader
			// ("shader-vs", "shader-fs"); // Shader form HTML tag.
			shader = new Shader(gl).init("../../shader/simple.vertex", "../../shader/white.fragment");

			// Create event manager with objects
			eventManager = new MyEventManager( this );
	
			// Create and start scene.
			this.scene = new Scene(gl, canvas, framerate, shader, sceneGraph);
		}
	};
};

/**
 * Public entry point for the application.
 */
App.prototype.start = function() {
	this.init();
	this.scene.start();
};

/**
 * This function is to be overwritten in a child class.
 * @returns {sceneGraph}
 */
App.prototype.buildSceneGraph = function(){
	with (this){
		// Create some special Nodes
		sceneGraph = new Group();
		camera = new PositionCamera(verticalViewAngle, 1.0, 1, 1000);

		// Add all nodes directly (no other groups) to scene graph
		sceneGraph.addChild(camera); // <------- Camera
		sceneGraph.addChild(new Translation( 0, 0, -8.0));
		sceneGraph.addChild(new RotorY(1.0));
		sceneGraph.addChild(new Triangle(2.0, 2.0));
	}
};


////////////////////dependent imports ////////////////////

import("template.js");
