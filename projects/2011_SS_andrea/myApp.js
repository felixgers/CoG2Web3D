import("../../models/Model.js");
import("../../util/jquery.js");
import("json2.js");

import("myEvents.js");
import("myNodes.js");
import("myScene.js");


function MyApp(){};
MyApp.prototype = new App();

MyApp.prototype.getShader = function() {
	return new Shader().init(this.gl, "../../shader/color.vertex", "../../shader/color.fragment");
};

/**
 * Override MyScene
 */
MyApp.prototype.getScene = function() {
	return new Scene().init(this.gl, this.canvas, this.aspectRatio, this.shader);
};

MyApp.prototype.buildSceneGraph = function() {

	// Create some special Nodes.
	var sceneGraph = new Group();
	speedRotor = new RotorXMutableSpeed(0.5);
	var camera = new PositionCamera(this.verticalViewAngle, this.aspectRatio , 1, 1000);

	// Create 1st group with triangle.
	var g2 = new Group();
	g2.addChild(new Translation(-1.5, -1.5, -8.0));
	g2.addChild(new RotorY(0.5));
	var cubeYellow=new Model('cubeYellow.json',this.gl,this.shader);
	g2.addChild(cubeYellow);

	// Create 2st group with rectangle.
	var g1 = new Group();
	g1.addChild(new Translation(1.5, 1.5, -10.0));
	g1.addChild(new RotorY(0.5));
	var monkey=new Model('monkey.json',this.gl,this.shader);
	g1.addChild(monkey);
	
	// Create 3rd group with box.
	var g3 = new Group();
	g3.addChild(new Translation(-3, -3, -5.0));
	g3.addChild(new RotorY(0.5));
	//g3.addChild(new Box(2.0, 2.0));
	//alert(this.shader);
	var cube=new Model('cube.json',this.gl,this.shader);
	g3.addChild(cube);

	// Add all nodes to scene graph.
	sceneGraph.addChild(camera); // <------- Camera
	sceneGraph.addChild(g3);
	sceneGraph.addChild(g1);
	sceneGraph.addChild(g2);
	
	
	return sceneGraph;
};
