import("../../models/Model.js");
import("../../util/jquery.js");
import("json2.js");

import("myEvents.js");
import("myNodes.js");
import("myScene.js");


function MyApp(){};
MyApp.prototype = new App();

MyApp.prototype.createShader = function() {
	return new Shader().init(this.gl, "../../shader/color.vertex", "../../shader/color.fragment");
};

/**
 * Override MyScene
 */
MyApp.prototype.createScene = function() {
	return new MyScene().init(this.gl, this.canvas, this.aspectRatio, this.shader);
};

