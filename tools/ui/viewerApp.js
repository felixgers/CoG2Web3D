BGE.namespace("ViewerApp");
BGE.ViewerApp=(function(){
       //app instance erzeugen
   var vertexShaderName = "../../shader/color.vertex",
       fragmentShaderName = "../../shader/color.fragment",
       viewerApp,
       testApp,
       firstScene,
       sceneGraph,
       gl,
       aspectRatio,

       init=function(_canvas){
          viewerApp=new BGE.App();
          viewerApp.init(_canvas,vertexShaderName,fragmentShaderName);
          gl=viewerApp.getGL();
          aspectRatio=viewerApp.getAspectRatio();
          //scene erzeugen
          firstScene = BGE.Scene;
          //scene initialisieren
          firstScene.init(gl,viewerApp.getCanvas(),aspectRatio,viewerApp.getShader());
          sceneGraph=buildSceneGraph();
          firstScene.setSceneGraph(sceneGraph);
          //scene an app zuweisen
          viewerApp.setScene(firstScene);
          //app starten
          viewerApp.start();
       },
       buildSceneGraph = function() {
            //declaring dependencies
            var node = BGE.Node,
                model = BGE.Model,
                group = node.Group,
                translation = node.Translation,
                rotation = node.Rotate,
                sceneGraph,
                camera,
                myGroup,
                myModel;

                setGLOptions();

                // Create some special Nodes.
                sceneGraph = new group();
                camera = new node.PositionCamera(45.0, 1 , 1, 1000);

                myGroup = new group();

                myModel=new model(gl);
                myModel.loadJsonFile('../models/colorCube.json');

                myGroup.addChild(new translation(0, 2, -20.0));
                myGroup.addChild(new rotation(0,0.5,0));
                myGroup.addChild(myModel);
                // Add all nodes to scene graph.
                sceneGraph.addChild(camera); // <------- Camera
                sceneGraph.addChild(myGroup);

            return sceneGraph;
       },
       setGLOptions = function(){
           gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
	       gl.blendFunc( gl.SRC_COLOR, gl.ONE_MINUS_CONSTANT_COLOR );
	       gl.enable(gl.BLEND);
	       gl.enable(gl.LINE_SMOOTH);
       },
       setCanvasClear=function(){
           firstScene.clear();
           viewerApp.clear();
       },
       parseXML=function(_data){
           var json,
               parser;

           if (_data != null && _data.length != 0) {
             parser = new ColladaParser();
             json = parser.parseCollada(_data);
             return json;
           }
       },
       addNewModel=function(json){
           //declaring dependencies
           var node = BGE.Node,
               translation = node.Translation,
               rotation = node.Rotate,
               newModel,
               myGroup;

               newModel=new BGE.Model(gl);
               newModel.loadJsonDirect(json);
               myGroup = new node.Group();

               myGroup.addChild(new translation(0, 3, -20.0));
               myGroup.addChild(new rotation(0,0.5,0));
               myGroup.addChild(newModel);

               sceneGraph.addChild(myGroup);
               sceneGraph.reload();
        };



       //revealing public API
       return{
           init:init,
           setCanvasClear:setCanvasClear,
           parseXML:parseXML,
           addNewModel:addNewModel
       };
}());



