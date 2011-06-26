function MyApp(){};
MyApp.prototype = new App;

MyApp.prototype.getScene = function() {
	return new MyScene().init(this.gl, this.canvas, this.aspectRatio, this.shader);
};

MyApp.prototype.getShader = function() {
	return new Shader().init(this.gl, "../../shader/simple.vertex", "../../shader/white.fragment");
};

MyApp.prototype.getEventManager = function() {
	var that = this;
	// Add event listeners to buttons
	document.getElementById("startButton").addEventListener("click", function(e){that.startLoop();}, false);
	document.getElementById("stopButton").addEventListener("click", function(e){that.stopLoop();}, false);
	
	// Return the event manager.
	return new MySpecializedEventManager(this.canvas, this.scene.camera, this.scene.speedRotor, 0.01);
};
