/**
 * main application
 * 
 * @returns {App}
 */
function App() {
	var self = this;
	this.canvas;
	this.gl;
	this.shader;
	this.scene;
	this.eventManager;

	// Application parameter.
	this.width = 500;
	this.height = 500;
	this.aspectRatio;
	this.framerate = 30.0;
	this.aspectRatio;


	this.init = function() {
		with (this) {
			this.canvas = document.getElementById("canvas");
			this.canvas.width = width;
			this.canvas.height = height;
			this.aspectRatio = canvas.width / canvas.height;

			this.gl = initGL(canvas);

			// Create Shader
			// ("shader-vs", "shader-fs"); // Shader form HTML tag.
			this.shader = new Shader().init(this.gl, "../../shader/simple.vertex", "../../shader/white.fragment");
	
			// Create and start scene.
			this.scene = new MyScene().init(gl, canvas, aspectRatio, framerate, shader);

			// Create event manager with objects
			this.eventManager = new MyEventManager().init( app );
		}
	};
	
	/** 
	 * @param canvas
	 * @returns
	 */
	var initGL = function(canvas) {
		try {
			var gl = canvas.getContext("experimental-webgl");
			gl.viewport(0, 0, canvas.width, canvas.height);
		} catch (e) {
			alert("Error initialising WebGL.");
			return null;
		}
		if (!gl) {
			alert("No gl context: Could not initialise WebGL.");
			return null;
		}
		return gl;
	};
};

/**
 * Public entry point for the application.
 */
App.prototype.start = function() {
	this.init();
	this.scene.start();
};



////////////////////dependent imports ////////////////////

import("myApp.js");
