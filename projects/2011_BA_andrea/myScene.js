importScript("../../models/Model.js");
importScript("../../util/jquery.js");

importScript("json2.js");

function MyScene(){
	var sceneGraph;
}
MyScene.prototype = new Scene;

MyScene.prototype.setGLOptions=function(){
	this.gl.blendFunc(this.gl.SRC_ALPHA, this.gl.ONE_MINUS_SRC_ALPHA);

	this.gl.blendFunc( this.gl.SRC_COLOR, this.gl.ONE_MINUS_CONSTANT_COLOR );
	this.gl.enable(this.gl.BLEND);
	this.gl.enable(this.gl.LINE_SMOOTH);
};

MyScene.prototype.addNewModel = function (modelData){
	
	var monkey=new Model(this.gl,this.shader);
	monkey.loadJsonDirect(modelData);
	var g2 = new Group();
	/*
	if(monkey.hasAnimations){
		monkey.animation.setMatrices(this.matrices);
		g2.addChild(monkey.animation);
	}
	*/
	g2.addChild(new Translation(0, 3, -20.0));
	g2.addChild(new RotorY(0.5));
	g2.addChild(monkey);

	this.sceneGraph.addChild(g2);
	this.sceneGraph.reload();
}


MyScene.prototype.buildSceneGraph = function() {

	this.setGLOptions();

	// Create some special Nodes.
	this.sceneGraph = new MyGroup();
	var camera = new PositionCamera(this.verticalViewAngle, this.aspectRatio , 1, 1000);

	var g1 = new Group();
	var monkey=new Model(this.gl,this.shader);
	monkey.loadJsonFile('models/colorCube.json');
	if(monkey.hasAnimations){
		monkey.animation.setMatrices(this.matrices);
		g1.addChild(monkey.animation);
	}
	g1.addChild(new Translation(0, 2, -20.0));
	g1.addChild(new RotorY(0.5));
	g1.addChild(monkey);

	

	// Add all nodes to scene graph.
	this.sceneGraph.addChild(camera); // <------- Camera

	this.sceneGraph.addChild(g1);
	
	return this.sceneGraph;
};

function MyGroup() {
	this.groupFlag = true;
	this.children = new Array();
	this.addChild = function(child) {
		this.children.push(child);
	};
	this.gl;
	this.pMatrix;
	this.mvMatrix;
	this.shaderProgram;
	
	this.superInit = this.init;
	this.init = function(gl, pMatrix, mvMatrix, shaderProgram){
		this.superInit(gl, pMatrix, mvMatrix, shaderProgram);
		this.gl=gl;
		this.pMatrix=pMatrix;
		this.mvMatrix=mvMatrix;
		this.shaderProgram=shaderProgram;
		
		for(var i=0; i<this.children.length; i++) {
			this.children[i].init(gl, pMatrix, mvMatrix, shaderProgram);
		}
	};	
	
	MyGroup.prototype.reload=function(){
		for(var i=0; i<this.children.length; i++) {
			this.children[i].init(this.gl, this.pMatrix, this.mvMatrix, this.shaderProgram);
		}
	}

	this.draw = function(time) { 
		with(this) {
			// Preserve the current transformation.
			// Not for the perspective, assuming it does not change.
			mvMatrix.push();

			for(var i=0; i<children.length; i++) {
				this.children[i].draw(time);
			}
			// Go back up in transformation hierarchy.
			mvMatrix.pop();
		}
	};
}
MyGroup.prototype = new Node;
