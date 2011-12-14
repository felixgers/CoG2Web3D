dojo.ready(function(){
   //call this app module and

   dojo.registerModulePath("BGE.App","../app/app");
   dojo.require("BGE.App");
   var viewerApp,
       cube,
       group=new BGE.Node.Group();
       viewerApp=new BGE.App();
       viewerApp.init("../../shader/color.vertex","../../shader/color.fragment");

       //show coordinates for development
       viewerApp.add("coordinateSystem");

       //create child per app and translate,rotate,scale it
       cube=viewerApp.add("cube");
       cube.translate({x:1,y:1,z:-5});
       cube.rotate({x:1,y:0.5,z:0});
       cube.scale({x:0.2,y:0.2,z:0.2});


       // create and add child
       /*
       group.addChild(new BGE.Node.Translation(1,1,-4.0));
       group.addChild(new BGE.Node.Rotate(0,1.0,0));
       group.addChild(new BGE.Shape.ColoredShape.Box(1.0, 1.0,1.0));
       viewerApp.addNode(group);
       */

       //simply add childs
       /*
       viewerApp.add("triangle");
       viewerApp.add("monkey");
       */

       //app starten
       viewerApp.start();
 });
