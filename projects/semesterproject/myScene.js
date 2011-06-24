importScript("../../models/Model.js");
importScript("../../util/jquery.js");
importScript("json2.js");

function MyScene(){}
MyScene.prototype = new Scene;


MyScene.prototype.buildSceneGraph = function() {


		// Create some special Nodes.
		var sceneGraph = new Group();
		var camera = new PerspectiveCamera(this.verticalViewAngle, this.aspectRatio , 1, 1000);

		// Create 1st group with triangle.
		/*
		var g2 = new Group();
		g2.addChild(new Translation(1.5, 1.5, -8.0));
		g2.addChild(new RotorY(0.5));
		var cubeYellow=new Model('cubeYellow.json',this.gl,this.shader);
		g2.addChild(cubeYellow);

	
		
		// Create 3rd group with box.
		var g3 = new Group();
		g3.addChild(new Translation(0, 0, -12));
		g3.addChild(new RotorY(0.5));
		
	
		var cube=new Model('jumpingBall.json',this.gl,this.shader);
		if(cube.hasAnimations){
		    cube.animation.setMatrices(this.matrices);
			g3.addChild(cube.animation);
		}
		g3.addChild(cube);
		*/
		
			// Create 2st group with rectangle.
		var g1 = new Group();
		g1.addChild(new Translation(-6, -5, -20.0));
		//g1.addChild(new RotorY(0.5));
		g1.addChild(new Scale(0.03469776,0.05087215,0.6585168));
		  
		  
		var monkey=new Model('test.json',this.gl,this.shader);
		g1.addChild(monkey);
		
		var g4 = new Group();
		g4.addChild(new Translation(-6, -5, -80.0));
		var table=new Model('table.json',this.gl,this.shader);
		g4.addChild(table);

		// Add all nodes to scene graph.
		sceneGraph.addChild(camera); // <------- Camera
		
		sceneGraph.addChild(g1);
		//sceneGraph.addChild(g2);
		//sceneGraph.addChild(g3);
		sceneGraph.addChild(g4);
		
		
		return sceneGraph;
};
