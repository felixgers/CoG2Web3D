import("myEvents.js");
import("myNodes.js");
import("myScene.js");

function MyApp(){};
MyApp.prototype = new App;

/**
 * Override getShader
 */
MyApp.prototype.getShader = function() {
	return new Shader().init(this.gl, "../../shader/simple.vertex", "../../shader/white.fragment");
};

/**
 * Override MyScene
 */
MyApp.prototype.getScene = function() {
	return new MyScene().init(this.gl, this.canvas, this.aspectRatio, this.shader);
};

/**
 * Override getEventManager
 */
MyApp.prototype.getEventManager = function() {
	return new MyEventManager().init(this);
};

