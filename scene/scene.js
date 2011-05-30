// Global vars 
var startTime = 0.0; 
var sceneTime = 0.0;
var updateListeners = new Array();
var timerHandle = null;

/**
 * Scene
 */
function Scene(gl, sceneGraph, canvas, verticalFieldOfView, framerate) 
{
	// Variables used in the draw method.
	this.gl = gl;
	this.canvas = canvas;
	this.sceneGraph = sceneGraph;
	this.framerate = framerate;
	this.verticalFieldOfView = verticalFieldOfView;
	
	this.matrices = new Matrices();
	this.shader = new Shader(gl, "shader-vs", "shader-fs");
	this.intervalTimer = null;
	
	
	/**
	 * Draw scene graph
	 */
	this.drawSceneGraph = function(time) {
		this.update(time);
	};
	
	
	/**
	 * Implement listener function which is draw();
	 */
	this.update = function(time) {
		// Some shortcuts for variables.
		var gl = this.gl;
		var pMatrix = this.matrices.pMatrix;
		var mvMatrix = this.matrices.mvMatrix;
		var shaderProgramm = this.shader.shaderProgram;
		var vertexShader = this.shader.vertexShader;
		var fragmentShader = this.shader.fragmentShader;
		var sceneGraph = this.sceneGraph;

		// Clear canvas an z-buffer.
		gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
		mat4.identity(mvMatrix); // Set to identity.
		
		sceneGraph.draw(gl, pMatrix, mvMatrix, time);
	};
	
	
	/**
	 * Start the scene
	 */
	this.start = function() {
		
		// get Aspect ratio
		var aspectratio = this.canvas.width / this.canvas.height; // 4/3
		mat4.perspective(this.verticalFieldOfView, aspectratio, 1, 100, this.matrices.pMatrix);
		
		var gl = this.gl; 
		gl.clearColor(0.0, 0.0, 0.0, 1.0);
		gl.enable(gl.DEPTH_TEST);
		
		var matrices = this.matrices;
		var shader = this.shader;
		
		// Draw once first.
		this.drawSceneGraph(0.0);
		
		// Add self to updater
		startUpdates(this, this.framerate);
		
	};
}


function initGL(canvas) {
	try {
		var gl = canvas.getContext("experimental-webgl");
		gl.viewport(0, 0, canvas.width, canvas.height);
	} catch(e) {
	}
	if (!gl) {
		alert("No gl context: Could not initialise WebGL.");
	}
	return gl;
}


function startUpdates(listener, framerate) {
	updateListeners.push(listener);
	var startDate = new Date();
	startTime = startDate.getTime()/1000.0;
	timerHandle = window.setInterval(tick, (1000.0/framerate));
}


function tick() {
	var newDate = new Date();
	var newTime = newDate.getTime();
	sceneTime = newTime/1000.0 - startTime;
	for(var i=0; i<updateListeners.length; i++) {
		updateListeners[i].update(sceneTime);
	}
};
