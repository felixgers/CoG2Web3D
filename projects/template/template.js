

function MyApp(){};
MyApp.prototype = new App;


MyApp.prototype.buildSceneGraph = function() {
	with (this) {
		// Create some special Nodes
		sceneGraph = new Group();
		speedRotor = new RotorXMutableSpeed(0.5);
		camera = new PositionCamera(verticalViewAngle, 1.0, 1, 1000);

		// Create 1st group with rectangle
		var g1 = new Group();
		g1.addChild(new Translation(1.5, 1.5, -8.0));
		g1.addChild(speedRotor);
		g1.addChild(new Rectangle(gl, 1.0, 1.0));

		// Create 2st group with triangle
		var g2 = new Group();
		g2.addChild(new Translation(-1.5, -1.5, -8.0));
		g2.addChild(new RotorY(1.0));
		g2.addChild(new Triangle(gl, 2.0, 2.0));

		// Add all nodes to scene graph
		sceneGraph.addChild(camera); // <------- Camera
		sceneGraph.addChild(g1);
		sceneGraph.addChild(g2);
	}
};
