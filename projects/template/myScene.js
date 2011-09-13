
BGE.namespace("MyScene");
BGE.MyScene=function(){};
BGE.MyScene.prototype = new BGE.Scene;


/**
 * Override buildSceneGraph
 */
BGE.MyScene.prototype.buildSceneGraph = function() {
	 //declaring dependencies
    var node = BGE.Node;
    var group = node.Group;
    var shape = BGE.Shape;
    var translation = node.Translation;
    var rotation = node.Rotate;
    

	// Create some special Nodes.
	var sceneGraph = new group();
	var camera = new node.PositionCamera(this.verticalViewAngle, this.aspectRatio , 1, 1000);
	
	// Add these objects as properties,
	// so that the event manager can access them.
	this.camera = camera;
	// Create 1st group with triangle.
	var g2 = new group();
	g2.addChild(new translation(-1.5, -1.5, -8.0));
	g2.addChild(new rotation(0,1.0,0));
	g2.addChild(new shape.Triangle(2.0, 2.0));

	// Create 3rd group with box.
	var g3 = new group();
	g3.addChild(new translation(0, 0, -8.0));
	g3.addChild(new rotation(0.07,0.03,0.05));
    var box=new shape.ColoredShape.Box(2.0,2.0,2.0);
	g3.addChild(box);


	// Add all nodes to scene graph.
	sceneGraph.addChild(camera); // <------- Camera
	sceneGraph.addChild(g2);
	sceneGraph.addChild(g3);

	return sceneGraph;
};


BGE.MyScene.prototype.update = function(time) {
};


BGE.MyScene.prototype.handleMouseEvent = function(e) {
};

BGE.MyScene.prototype.__handleKeyDown = function(e) {
	switch (e.keycode) {
	case 107: // +
		if(up)
		this.speedRotor.speed += this.acceleration;
		break;

	case 109: // -
		this.speedRotor.speed -= this.acceleration;
		break;
	}
};

BGE.MyScene.prototype.handleKeyUp = function(e) {
};

