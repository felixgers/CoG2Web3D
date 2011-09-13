importScript("../../models/Model.js");
importScript("../../ext/jquery.js");
importScript("json2.js");

function MyScene(){}
MyScene.prototype = new Scene;


MyScene.prototype.buildSceneGraph = function() {


		// Create some special Nodes.
		var sceneGraph = new Group();
		var camera = new PerspectiveCamera(this.verticalViewAngle, this.aspectRatio , 1, 1000);

		
		var g1 = new Group();
		var monkey=new Model(this.gl,this.shader);
        monkey.loadJsonFile('monkey.json');
		if(monkey.hasAnimations){
		    monkey.animation.setMatrices(this.matrices);
			g1.addChild(monkey.animation);
		}
		g1.addChild(new Translation(0, 2, -20.0));
		g1.addChild(new RotorY(0.5));
		//g1.addChild(monkey);
		
		
		// Create 2st group with table.
		var g2 = new Group();
		g2.addChild(new Translation(0, 2, -20.0));
        g2.addChild(new Scale(0.06, 0.06, 0.06));
	    g2.addChild(new RotorY(0.5));
		var test=new Model(this.gl,this.shader);
        test.loadJsonFile('garage.json');
		g2.addChild(test);
		
		
		// Add all nodes to scene graph.
		sceneGraph.addChild(camera); // <------- Camera
		
		sceneGraph.addChild(g1);
		sceneGraph.addChild(g2);
		
		
		
		return sceneGraph;
};
