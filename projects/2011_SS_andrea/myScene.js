importScript("../../models/Model.js");
importScript("../../ext/jquery.js");
importScript("json2.js");

function MyScene(){}
MyScene.prototype = new Scene;


MyScene.prototype.buildSceneGraph = function() {


		// Create some special Nodes.
		var sceneGraph = new Group();
		var camera = new PerspectiveCamera(this.verticalViewAngle, this.aspectRatio , 1, 1000);

		// Create 2st group with rectangle.
		var g1 = new Group();
		g1.addChild(new Translation(-6, -5, -20.0));
		//g1.addChild(new RotorY(0.5));
		g1.addChild(new Scale(0.03469776,0.05087215,0.6585168));
		  
		  
		var monkey=new Model(this.gl,this.shader);
        monkey.loadJsonFile('test.json');
		g1.addChild(monkey);
		
		var g4 = new Group();
		g4.addChild(new Translation(-6, -5, -80.0));
		var table=new Model(this.gl,this.shader);
        table.loadJsonFile('table.json');
		g4.addChild(table);

		// Add all nodes to scene graph.
		sceneGraph.addChild(camera); // <------- Camera
		
		sceneGraph.addChild(g1);
		//sceneGraph.addChild(g2);
		//sceneGraph.addChild(g3);
		sceneGraph.addChild(g4);
		
		
		return sceneGraph;
};
