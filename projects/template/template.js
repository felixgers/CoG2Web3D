// Import modules

function startScene() {

	var verticalFieldOfView = 45;
	var framerate = 30.0;
	var canvas = document.getElementById("canvas");
	canvas.width = 500;
	canvas.height = 500;
	
	var gl = initGL(canvas);

	// Build scene graph
	var sceneGraph = new Group();
	
	var sep1 = new Separator();
	var sep2 = new Separator();

	sep2.addChild(new Translation(-1.5, -1.5, -8.0));
	sep2.addChild(new RotorY(1.0));
	sep2.addChild(new Triangle(gl, 2.0, 2.0));
	
	sep1.addChild(new Translation(1.5, 1.5, -8.0));
	sep1.addChild(new Rectangle(gl, 1.0, 1.0));
	
	sceneGraph.addChild(sep1);
	sceneGraph.addChild(sep2);
	
	
	// Create scene
	var scene = new Scene(gl, sceneGraph, canvas, verticalFieldOfView, framerate);
	
	
	// Start running the scene
	scene.start();
}

