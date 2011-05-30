/**
 * Main entry point and event loop.
 * Initas WebGL object gl. 
 * Init animation of rendering.
 * Init user interaction, event handling.
 * No WebGL commands here.
 */

//This is the entry point for the web application
function webGLStart() {
	var main = new Main();
	// initialize canvas and gl.
	main.init();
	// start main render, animation and event loop.
	main.tick();
}

function Main() {
	// Varibles.
	this.canvas = document.getElementById("canvas");
	
	this.resize = function() {
		// Use (almost) all the window for the canvas.
		var border = 0;
		this.canvas.width = window.innerWidth-border;
		this.canvas.height = window.innerHeight-border;
		window.addEventListener('resize', this.resize, false);
	};  

	this.initGL = function() {
		try {
			var gl = this.canvas.getContext("experimental-webgl");
			gl.viewport(0, 0, this.canvas.width, this.canvas.height);
		} catch(e) {
		}
		if (!gl) {
			alert("No gl context: Could not initialise WebGL.");
		}
		return gl;
	};

	this.init = function() {
		
		this.resize(); // Resize canvas according to window size.

		var gl = this.initGL();
		gl.clearColor(0.0, 0.0, 0.0, 1.0);
		gl.enable(gl.DEPTH_TEST);

		// Matrices object contains model-view and perspective matrixes.
		var matrices = new Matrices();
		// Initialize shader object with shader program, vertex an fragment shader.
		var shader = new Shader(gl, "shader-vs", "shader-fs");
		// Initialize buffer object with vertex buffers.
		var buffer = new Buffer(gl);
		buffer.init01();	
		buffer.init02();
		// The scene object does the drawing.
		var scene = new Scene(this.canvas, gl, matrices, shader, buffer);
		// Do thing that should happen only once.
		scene.init();

		// Initialize event handling.
		var eventHandler = new EventHandler(this.canvas);
		eventHandler.init();

		// Store in canvas what we need in tick.
		this.canvas.scene = scene;
		this.canvas.eventHandler = eventHandler;
	};

//	Render and event loop.
	this.tick = function() {
		document.write("this.canvas:"+ this.canvas);
		// Start timer.
		//window.requestAnimationFrame;
		requestAnimFrame(this.tick);
		//eventHandler.handleEvents();
		this.canvas.scene.draw();
	};	
}
