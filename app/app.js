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
	this.aspectRatio;

	// Loop parameter and variables.
	this.framerate = 30.0;	
	this.intervalTimer = null;	
	this.startTime = 0.0; 
	this.timerHandle = null;

	this.init = function() {
		with (this) {
			this.canvas = document.getElementById("canvas");
			this.canvas.width = width;
			this.canvas.height = height;
			this.aspectRatio = canvas.width / canvas.height;

			// DEBUG
			// --------------------------------------------
			this.lastTime = 0.0;
			this.debug = document.createElement("div");
			this.canvas.parentNode.appendChild(this.debug);
			// --------------------------------------------

			this.gl = initGL(canvas);

			// Create Shader
			// ("shader-vs", "shader-fs"); // Shader form HTML tag.
			this.shader = new Shader().init(this.gl, "../../shader/simple.vertex", "../../shader/white.fragment");
	
			// Create and start scene.
			this.scene = new MyScene().init(gl, canvas, aspectRatio, shader);

			// Create event manager with objects
			this.eventManager = new MyEventManager().init( this );
			
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

	
	this.startLoop = function() {
		with(this){			
			// Start interval
			var startDate = new Date();
			this.startTime = startDate.getTime()/1000.0;
			var self = this;
			this.timerHandle = window.setInterval( function(){self.update();}, (1000.0/this.framerate));
		}
	};
	
	/**
	 * Called by window interval handler
	 */
	this.update = function() {

		// Calculate time
		var newDate = new Date();
		var time = (newDate.getTime() / 1000.0) - this.startTime;

		this.scene.drawSceneGraph(time);

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
	
};

/**
 * Public entry point for the application.
 */
App.prototype.start = function() {
	this.init();
	this.startLoop();
};



////////////////////dependent imports ////////////////////

import("myApp.js");
