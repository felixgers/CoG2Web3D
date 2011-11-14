dojo.ready(function(){
   //call this app module and
   //init with canvas object from HTML page
   dojo.registerModulePath("BGE.App","../app/app");
   dojo.require("BGE.App");
   var viewerApp,
       node = BGE.Node,
       group = node.Group,
       shape = BGE.Shape,
       translation = node.Translation,
       rotation = node.Rotate,
       triangle = new group(),
       box = new group();

       viewerApp=new BGE.App();
       viewerApp.init(dojo.byId("canvas"),"../../shader/color.vertex","../../shader/color.fragment");

	   triangle.addChild(new translation(-1.5,-1.5,-8.0));
       triangle.addChild(new rotation(0,1.0,0));
       triangle.addChild(new shape.Triangle(1.0, 1.0));
       viewerApp.add(triangle);

	   box.addChild(new translation(0, 0, -8.0));
	   box.addChild(new rotation(0.07,0.5,0.05));
	   box.addChild(new shape.ColoredShape.Box(2.0,2.0,2.0));
       viewerApp.add(box);

       //app starten
       viewerApp.start();
 });
