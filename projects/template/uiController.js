dojo.ready(function(){
   //call this app module and
   //init with canvas object from HTML page
   var firstScene,
       viewerApp,
       aspectRatio,

    buildSceneGraph = function() {
    //declaring dependencies
    var node = BGE.Node,
        group = node.Group,
        shape = BGE.Shape,
        translation = node.Translation,
        rotation = node.Rotate,
        sceneGraph,
        camera,
        g3,
        myGroup,
        box;

	    // Create some special Nodes.
        sceneGraph = new group();
	    camera = new node.PositionCamera(45.0, 1 , 1, 1000);
	

	    myGroup = new group();
	    myGroup.addChild(new translation(-1.5,-1.5,-8.0));
        myGroup.addChild(new rotation(0,1.0,0));
        myGroup.addChild(new shape.Triangle(1.0, 1.0));
	
	    // Create 3rd group with box.
        g3 = new group();
        g3.addChild(new translation(0, 0, -8.0));
	    g3.addChild(new rotation(0.07,0.5,0.05));
	    g3.addChild(new shape.ColoredShape.Box(2.0,2.0,2.0));

        // Add all nodes to scene graph.
	    sceneGraph.addChild(camera); // <------- Camera
	    sceneGraph.addChild(myGroup);
	    sceneGraph.addChild(g3);

	    return sceneGraph;
    };

     viewerApp=new BGE.App();
     viewerApp.init(dojo.byId("canvas"),"../../shader/color.vertex","../../shader/color.fragment");
     aspectRatio=viewerApp.getAspectRatio();
     //scene erzeugen
     firstScene = BGE.Scene;

     //scene initialisieren
     firstScene.init(viewerApp.getGL(),viewerApp.getCanvas(),viewerApp.getAspectRatio(),viewerApp.getShader());
     firstScene.setSceneGraph(buildSceneGraph());
     //scene an app zuweisen
     viewerApp.setScene(firstScene);
     //app starten
     viewerApp.start();     

 });
