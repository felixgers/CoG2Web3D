dojo.ready(function () {
   //call this app module and

   dojo.registerModulePath("BGE.App", "../app/app");
   dojo.require("BGE.App");
    var viewerApp,
        node = BGE.Node,
        Group = node.Group,
        Rotation = node.Rotate,
        Translation=node.Translation,
        glObjects,
        gl,
        aspectRatio,
        firstScene,
        sceneGraph,
        camera,
        i,
        modelManager = BGE.ModelManager;

    viewerApp = new BGE.App();
    viewerApp.init("../../shader/color.vertex", "../../shader/color.fragment", dojo.byId("canvas"));

    //get access to webgl-context
    gl = viewerApp.getGL();
    aspectRatio = viewerApp.getAspectRatio();

    //add some GL options
    gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
    gl.blendFunc(gl.SRC_COLOR, gl.ONE_MINUS_CONSTANT_COLOR);
    gl.enable(gl.BLEND);
    gl.enable(gl.LINE_SMOOTH);



    //create and init scene
    firstScene = new BGE.Scene();
    firstScene.init(gl, viewerApp.getCanvas(), aspectRatio, viewerApp.getShader());

    //build scenegraph and set at scene
    sceneGraph = new Group();

    //create camera
    camera = new BGE.Camera.PositionCamera(45.0, 1, 1, 1000);
    sceneGraph.addChild(camera); // <------- Camera

    //add node for rotation in scene
    //sceneGraph.addChild(new Rotation(0, 0.5, 0));
    sceneGraph.addChild(new Translation(0, 0, -20));


    //init modelManager
    modelManager.init(gl, sceneGraph);
    glObjects = modelManager.loadJsonFile('../example/modelle/example.json');

    //iterate glObjects
    for (i = 0; i < glObjects.length; i++) {
        sceneGraph.addChild(glObjects[i].shape);
    }

    //add sceneGraph to scene
    firstScene.setSceneGraph(sceneGraph);

    //set scene to app
    viewerApp.setScene(firstScene);

    //start app
    viewerApp.start();
});
