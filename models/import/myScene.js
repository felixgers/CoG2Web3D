importScript("../../models/Model.js");
importScript("../../ext/jquery.js");

importScript("json2.js");


BGE.namespace("MyScene");

BGE.MyScene=function(){
	var sceneGraph;
}
BGE.MyScene.prototype = new BGE.Scene;

BGE.MyScene.prototype.setGLOptions=function(){
	this.gl.blendFunc(this.gl.SRC_ALPHA, this.gl.ONE_MINUS_SRC_ALPHA);

	this.gl.blendFunc( this.gl.SRC_COLOR, this.gl.ONE_MINUS_CONSTANT_COLOR );
	this.gl.enable(this.gl.BLEND);
	this.gl.enable(this.gl.LINE_SMOOTH);
};

BGE.MyScene.prototype.clear=function(){
	this.sceneGraph.clear();
};

BGE.MyScene.prototype.addNewModel = function (modelData){
	//declaring dependencies
    var node = BGE.Node;
    var translation = node.Translation;
    var rotation = node.Rotate;

	var newModel=new BGE.Model(this.gl,this.shader);

	newModel.loadJsonDirect(modelData);
	var g2 = new node.Group();

	g2.addChild(new translation(0, 3, -20.0));
	g2.addChild(new rotation(0,0.5,0));
	g2.addChild(newModel);

	this.sceneGraph.addChild(g2);
	this.sceneGraph.reload();
};


BGE.MyScene.prototype.buildSceneGraph = function() {
    //declaring dependencies
    var node = BGE.Node;
    var model = BGE.Model;
    var group = node.Group;
    var translation = node.Translation;
    var rotation = node.Rotate;

    this.setGLOptions();

	// Create some special Nodes.
	this.sceneGraph = new group();
	var camera = new node.PositionCamera(this.verticalViewAngle, this.aspectRatio , 1, 1000);

	var g1 = new group();
	var myModel=new model(this.gl,this.shader);
	myModel.loadJsonFile('models/colorCube.json');

	g1.addChild(new translation(0, 2, -20.0));
	g1.addChild(new rotation(0,0.5,0));
	g1.addChild(myModel);

	// Add all nodes to scene graph.
	this.sceneGraph.addChild(camera); // <------- Camera

	this.sceneGraph.addChild(g1);
	
	return this.sceneGraph;
};

