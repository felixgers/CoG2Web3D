dojo.ready(function(){
   //call this app module and
   //init with canvas object from HTML page
   dojo.registerModulePath("BGE.App","../app/app");
   dojo.require("BGE.App");
   var viewerApp,
       tri,
       triangle=new BGE.Node.Group();

       viewerApp=new BGE.App();
       viewerApp.init(dojo.byId("canvas"),"../../shader/color.vertex","../../shader/color.fragment");

       triangle.addChild(new BGE.Node.Translation(1,1,-4.0));
       triangle.addChild(new BGE.Node.Rotate(0,1.0,0));
       triangle.addChild(new BGE.Shape.ColoredShape.Box(1.0, 1.0,1.0));
       //viewerApp.addNode(triangle);
       viewerApp.add("coordinateSystem");
       tri=viewerApp.add("triangle");
       tri.translate({x:1,y:1,z:-5});
       //tri.rotate({x:0,y:0.5,z:0});


       //tri.rotation.rotate(0.07,0.5,0.05);
      //node hinzufuegen



       //app starten
       viewerApp.start();
 });
