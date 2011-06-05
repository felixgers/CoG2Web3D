// First import all required js modules
// Therefore the html document must add the script util/import.js before
import("../../util/event.js");
import("../../util/glMatrix.js");
import("../../util/matrices.js");
import("../../util/shader.js");

import("../../scene/scene.js");
import("../../scene/nodes.js");

import("event.js"); // MySpecializedEventManager
import("nodes.js"); // RotorXMutableSpeed and PositionCamera


/**
 * The only global variable.
 * (If we do not want any globals at all, please help solving this problem.)
 */
var scene = null;


/**
 * Start the and lazily create the scene
 */
function startScene() 
{
	if(scene == null) {
		scene = initScene();
	}
	// Start running the scene
	scene.start();
}

/**
 * The actual scene creation
 * @returns {Scene}
 */
function initScene()
{
	var canvas = document.getElementById("canvas");
	canvas.width = 500;
	canvas.height = 500;
	
	var framerate = 30.0;
	var acceleration = 0.1;
	var aspectRatio = canvas.width / canvas.height; 
	var verticalViewAngle = 45.0;
	
	
	var gl = initGL(canvas);

	// Build scene graph
	
	// Create some special Nodes
	var sceneGraph = new Group();
	var speedRotor = new RotorXMutableSpeed(0.5);
	var camera = new PositionCamera(verticalViewAngle, 1.0, 1, 1000);
	
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
	sceneGraph.addChild(camera);  // <------- Camera
	sceneGraph.addChild(g1);
	sceneGraph.addChild(g2);


	// Create event manager with objects
	var eventManager = new MySpecializedEventManager(canvas, camera, speedRotor, acceleration);
	
	// Create scene
	var localScene = new Scene(gl, sceneGraph, canvas, framerate);
	
	return localScene;
}


/**
 * Stop the scene, which means stop the time running.
 */
function stopScene()
{
	if(scene != null) {
		scene.stop();
	}
}
