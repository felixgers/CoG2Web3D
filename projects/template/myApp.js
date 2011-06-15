import("myEvents.js");
import("myNodes.js");
import("myScene.js");

function MyApp(){};
MyApp.prototype = new App;

/**
 * Override Shader
 */
MyApp.prototype.createShader = function() {
	return new Shader().init(this.gl, "../../shader/simple.vertex", "../../shader/white.fragment");
};


/**
 * Override Scene
 */
MyApp.prototype.createScene = function() {
	return new MyScene().init(this.gl, this.canvas, this.aspectRatio, this.shader);
};


/**
 * Override EventManager
 */
MyApp.prototype.createEventManager = function() {
	// Create my event manager with objects to control
	// scene.camera, scene.speedRotor <- These properties are created by scene.buildSceneGraph()
	return new MySpecializedEventManager(this.canvas, this.scene.camera, this.scene.speedRotor, 0.05);
};

