import("myEvents.js");
import("myNodes.js");
import("myScene.js");

function MyApp(){};
MyApp.prototype = new App;

/**
 * Override Shader
 */
MyApp.prototype.createShader = function() {
	return new Shader().init(this.gl, "../../shader/color.vertex", "../../shader/color.fragment");
};


/**
 * Override Scene
 */
MyApp.prototype.createScene = function() {
	return new MyScene().init(this.gl, this.canvas, this.aspectRatio, this.shader);
};