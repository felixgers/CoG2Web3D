importScript("../../models/Model.js");
importScript("../../util/jquery.js");
importScript("json2.js");

function MyScene(){}
MyScene.prototype = new Scene;

MyScene.prototype.setGLOptions=function(){
//this.gl.blendFunc(this.gl.SRC_ALPHA, this.gl.ONE);

//this.gl.blendFunc( this.gl.FUNC_ADD );
this.gl.blendFunc( this.gl.SRC_COLOR, this.gl.ONE_MINUS_CONSTANT_COLOR );
this.gl.enable(this.gl.BLEND);
this.gl.enable(this.gl.SAMPLE_COVERAGE);
}


MyScene.prototype.buildSceneGraph = function() {

		this.setGLOptions();

		// Create some special Nodes.
		var sceneGraph = new Group();
		var camera = new PerspectiveCamera(this.verticalViewAngle, this.aspectRatio , 1, 1000);

		
		var g1 = new Group();
		var monkey=new Model('monkey.json',this.gl,this.shader);
		if(monkey.hasAnimations){
		    monkey.animation.setMatrices(this.matrices);
			g1.addChild(monkey.animation);
		}
		g1.addChild(new Translation(0, 2, -20.0));
		g1.addChild(new RotorY(0.5));
		g1.addChild(monkey);
		
		
		// Create 2st group with table.
		var g2 = new Group();
		g2.addChild(new Translation(0, -1.5, -5.0));
		g2.addChild(new Rotate(1.8,0,0.4));
		g2.addChild(new Scale(0.03469776,0.05087215,0.6585168));		  
		var table=new Model('table.json',this.gl,this.shader);
		g2.addChild(table);
		
		var g3 = new Group();
		g3.addChild(new Translation(1, -0.5, -5.0));
		g3.addChild(new Rotate(1.2,3,0));
		g3.addChild(new Scale(0.15,0.15,0.15));		  
		var bowl=new Model('bowl.json',this.gl,this.shader);
		g3.addChild(bowl);
		
		
		// Add all nodes to scene graph.
		sceneGraph.addChild(camera); // <------- Camera
		
		sceneGraph.addChild(g1);
		sceneGraph.addChild(g2);
		sceneGraph.addChild(g3);
		
		
		
		return sceneGraph;
};
