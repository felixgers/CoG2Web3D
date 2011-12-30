dojo.ready(function () {
   //call this app module and

   dojo.registerModulePath("BGE.App", "../app/app");
   dojo.require("BGE.App");
    var viewerApp,
        cube,
        myModel,
        test = new BGE.Node.Group();

    viewerApp = new BGE.App();
    viewerApp.init("../../shader/color.vertex", "../../shader/color.fragment");

    //show coordinates for development
    viewerApp.add("coordinateSystem");

    //create child per app and translate,rotate,scale it
    //cube=viewerApp.add("cube");
    // create and add child
    viewerApp.add("triangle");
       

    //simply add childs
    /*
    viewerApp.add("triangle");
    viewerApp.add("monkey");
    */

    //app starten
    viewerApp.start();
});
