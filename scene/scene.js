/**
 * 
 * @param canvas
 * @returns
 */
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

/**
 * Scene
 * 
 * @param gl
 * @param sceneGraph
 * @param canvas
 * @param framerate
 * @returns {Scene}
 */
function Scene(gl, sceneGraph, canvas, framerate, shader) 
{
	var obj = this;
	// Variables used in the draw method.
	this.gl = gl;
	this.canvas = canvas;
	this.sceneGraph = sceneGraph;
	this.framerate = framerate;
	this.shader = shader;
	
	this.matrices = new Matrices();

	//this.shader = new Shader(gl);
	
//	if(shader!= null) {
//		this.shader = shader;
//	} else {
//		// For compatibility reasons try to load shaders old style
//		this.shader = new Shader(gl, "shader-vs", "shader-fs");
//	}
	
	this.intervalTimer = null;
	
	this.startTime = 0.0; 
	this.timerHandle = null;
	this.sceneHasCamera = false; // will be set automatically


	
	// DEBUG
	// --------------------------------------------
	this.lastTime = 0.0;
	this.debug = document.createElement("div");
	canvas.parentNode.appendChild(this.debug);
	// --------------------------------------------
	
	
	/**
	 * Start the scene, scene time.
	 */
	this.start = function() {
	
		this.sceneHasCamera = this.recursiveSceneHasCamera(this.sceneGraph);
		if(!this.sceneHasCamera)
			alert("The scene graph has no camera node.\nUsing default perspective.");
		
		var gl = this.gl;
		gl.clearColor(0.0, 0.0, 0.0, 1.0);
		gl.enable(gl.DEPTH_TEST);
		
		// Draw once first.
		this.drawSceneGraph(0.0);
		
		// Start interval
		var startDate = new Date();
		this.startTime = startDate.getTime()/1000.0;
		var scene = this;
		this.timerHandle = window.setInterval( function(){scene.update();}, (1000.0/this.framerate));
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
			var aspectratio = this.canvas.width / this.canvas.height; 			
			mat4.perspective(45.0, aspectratio, 1, 100, pMatrix);
		}
		sceneGraph.draw(gl, pMatrix, mvMatrix, time, this.shader.shaderProgram);
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
