// Import modules

function startScene() {

	var verticalFieldOfView = 45;
	var framerate = 30.0;
	var canvas = document.getElementById("canvas");
	canvas.width = 800;
	canvas.height = 800;
	
	var gl = initGL(canvas);

	// Build scene graph
	var sceneGraph = new Group();
	
	
	
	// Create scene
	var scene = new Scene(gl, sceneGraph, canvas, verticalFieldOfView, framerate);	
	
	var sep1 = new Separator();
	sep1.addChild(new Translation(-2.8, 1, -20));
    sep1.addChild(new RotorY(1.0));	
	var myModel=new Model('cube.json',gl);
	sep1.addChild(myModel);
	
	var sep2 = new Separator();
	sep2.addChild(new Translation(-3, 2, -15));	
	sep2.addChild(new RotateX(30));
	var cone=new Model('cone.json',gl);
	sep2.addChild(cone);
	
	var sep3 = new Separator();
	var cone1=new Model('cube.json',gl);
	sep3.addChild(new Translation(3, 1, -15));
	sep3.addChild(new RotateX(30));
	sep3.addChild(cone1);
	
	var sep4 = new Separator();
	var monkey=new Model('monkey.json',gl);
	sep4.addChild(new Translation(1, 1, -16));
	sep4.addChild(new RotorY(1));
	sep4.addChild(monkey);
	
	var sep5 = new Separator();
	var sphere=new Model('sphere.json',gl);
	sep5.addChild(new Translation(0, 3, -16));
	sep5.addChild(new RotorY(1));
	sep5.addChild(sphere);
	
	
	var sep6 = new Separator();
	var sphere2=new Model('sphere.json',gl);
	sep6.addChild(new Translation(0, 3, -13));
	sep6.addChild(new RotorY(-1));
	sep6.addChild(new Scale(0.5,0.2,0.5));
	sep6.addChild(sphere2);
	
	
	var sep7 = new Separator();
	var cylinder=new Model('cylinder.json',gl);
	sep7.addChild(new Translation(-2, 6, -16));
	sep7.addChild(new RotorY(-1));
	sep7.addChild(new Scale(0.5,0.5,0.5));
	sep7.addChild(cylinder);
	
	sceneGraph.addChild(sep1);	
	sceneGraph.addChild(sep2);	
	sceneGraph.addChild(sep3);
	sceneGraph.addChild(sep4);
	sceneGraph.addChild(sep5);
	sceneGraph.addChild(sep6);
	sceneGraph.addChild(sep7);
	// Start running the scene
	scene.start();
}
/**
 * Y Rotation rotor
 * animates a y rotation
 * @param speed as frequency (rotations per second)
 */
function RotateX(value) { 
	this.value = value;
	this.draw = function(gl, pMatrix, mvMatrix, time) {
		mat4.rotateX(mvMatrix, value);
	};
}
