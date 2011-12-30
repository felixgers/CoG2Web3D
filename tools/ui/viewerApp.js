dojo.registerModulePath("BGE.App", "../app/app");
dojo.require("BGE.App");
dojo.provide("BGE.ViewerApp");
dojo.registerModulePath("BGE.UploadHandler", "../tools/ui/uploadHandler");
dojo.require("BGE.UploadHandler");
dojo.registerModulePath("BGE.ModelManager", "../tools/models/modelManager");
dojo.require("BGE.ModelManager");
dojo.registerModulePath("BGE.ColladaParser", "../tools/parser/parser");
dojo.require("BGE.ColladaParser");
BGE.ViewerApp = (function () {
    "use strict";
       //app instance erzeugen
    var vertexShaderName = "../../shader/color.vertex",
        fragmentShaderName = "../../shader/color.fragment",
        viewerApp,
        testApp,
        firstScene,
        sceneGraph,
        gl,
        aspectRatio,
        myUploadHandler = BGE.UploadHandler,
        modelManager = BGE.ModelManager,
        setGLOptions = function () {
            gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
            gl.blendFunc(gl.SRC_COLOR, gl.ONE_MINUS_CONSTANT_COLOR);
            gl.enable(gl.BLEND);
            gl.enable(gl.LINE_SMOOTH);
        },
        buildSceneGraph = function () {
            //declaring dependencies
            var node = BGE.Node,
                model = BGE.Model,
                Group = node.Group,
                translation = node.Translation,
                rotation = node.Rotate,
                sceneGraph,
                camera,
                objects,
                i;

            setGLOptions();

            // Create some special Nodes.
            sceneGraph = new Group();
            camera = new BGE.Camera.PositionCamera(45.0, 1, 1, 1000);
            sceneGraph.addChild(camera); // <------- Camera
            modelManager.init(gl, sceneGraph);
            objects = modelManager.loadJsonFile('../models/cube.json');
            for (i = 0; i < objects.length; i++) {
                objects[i].rotate({x: 0, y: 0.5, z: 0});
                objects[i].translate({x: 0, y: 0, z: -7});
                sceneGraph.addChild(objects[i].shape);
            }
            return sceneGraph;
        },
        init = function (p_canvas) {
            viewerApp = new BGE.App();
            viewerApp.init(vertexShaderName, fragmentShaderName, p_canvas);
            viewerApp.setCanvasSize('500', '500');
            gl = viewerApp.getGL();
            aspectRatio = viewerApp.getAspectRatio();
            //scene erzeugen
            firstScene = new BGE.Scene();
            //scene initialisieren
            firstScene.init(gl, viewerApp.getCanvas(), aspectRatio, viewerApp.getShader());
            sceneGraph = buildSceneGraph();
            firstScene.setSceneGraph(sceneGraph);
            //scene an app zuweisen
            viewerApp.setScene(firstScene);
            //app starten
            viewerApp.start();
        },
        setCanvasClear = function () {
            firstScene.clear();
            viewerApp.clear();
        },
        parseXML = function (p_data) {
            var json,
                parser;


            if (p_data !== null && p_data.length !== 0) {
                parser = BGE.ColladaParser;
                json = parser.parseCollada(p_data);
                return json;
            }
        },
        addNewModel = function (json) {
            //declaring dependencies
            var newModel,
                objects,
                i;

            objects = modelManager.loadJsonDirect(json);
            for (i = 0; i < objects.length; i++) {
                objects[i].rotate({x: 0, y: 0.5, z: 0});
                objects[i].translate({x: 0, y: 0, z: -7});
                sceneGraph.addChild(objects[i].shape);
            }
            sceneGraph.reload();
        };

       //revealing public API
    return {
        init: init,
        setCanvasClear: setCanvasClear,
        parseXML: parseXML,
        addNewModel: addNewModel,
        checkFileUploadAvailable: myUploadHandler.checkFileUploadAvailable,
        handleUpload: myUploadHandler.handleUpload,
        handleDragOver: myUploadHandler.handleDragOver,
        handleDrop: myUploadHandler.handleDrop
    };
}());




