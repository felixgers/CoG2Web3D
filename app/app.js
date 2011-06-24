/**
 * main application
 * 
 * @returns {App}
 */
function App() {
	var self = this;
	// HTML Id of the Canvas in case there is more than one.
	this.canvasId; 
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
	this.vetexShaderName = "../../shader/simple.vertex";
	this.fragmentShaderName = "../../shader/white.fragment";

	// Loop parameter and variables.
	this.framerate = 30.0;	
	this.verticalViewAngle = 45.0;
	this.intervalTimer = null;	
	this.startTime = 0.0; 
	this.timerHandle = null;

	this.init = function(canvasId) {
		with (this) {
			this.canvasId = canvasId;
			var canvas = document.getElementById(canvasId);
			this.canvas = canvas;
			canvas.width = width;
			canvas.height = height;
			this.aspectRatio = width / height;

			// DEBUG
			// --------------------------------------------
			this.lastTime = 0.0;
			this.debug = document.createElement("div");
			this.canvas.parentNode.appendChild(this.debug);
			// --------------------------------------------

			this.gl = initGL(canvas);

			// Create Shader
			// ("shader-vs", "shader-fs"); // Shader form HTML tag.

			this.shader = this.getShader();

			// Create and start scene.
			this.scene = this.getScene();

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
			// Check if loop is already running.
			if(this.timerHandle){ return; }
			// Start interval
			var startDate = new Date();
			this.startTime = startDate.getTime()/1000.0;
			var self = this;
			this.timerHandle = window.setInterval( function(){self.update();}, (1000.0/this.framerate));
		}
	};

	/**
	 * Stop scene time
	 */
	this.stopLoop = function() {
		if(this.timerHandle){
			window.clearInterval(this.timerHandle);
			this.timerHandle = null;
		}
	};	

	/**
	 * Main loop.
	 * Called by window interval handler
	 */
	this.update = function() {

		// Calculate time
		var newDate = new Date();
		var time = (newDate.getTime() / 1000.0) - this.startTime;

		this.scene.draw(time);

		// DEBUG
		// --------------------------------------------
		this.debug.innerHTML = Math.round(10/(time-this.lastTime))/10.0+" fps";
		this.lastTime = time;
		// --------------------------------------------
	};

};


/**
 * Public entry point for the application.
 */
App.prototype.start = function(canvasId) {
	this.init(canvasId);
	this.startLoop();
};


/**
 * Override this method to apply another shader program
 * or simply override the variables used within the method in the MyApp class.
 * @returns {Shader}
 */
App.prototype.getShader = function() {
	return new Shader().init(this.gl, this.vetexShaderName, this.fragmentShaderName );
};


/**
 * Override this method to apply another scene for the application
 * or simply override the MyScene class.
 * @returns {Scene}
 */
App.prototype.getScene = function() {
	return new MyScene().init(this.gl, this.canvas, this.aspectRatio, this.shader);
};

////////////////////dependent imports ////////////////////

importScript("myApp.js");

