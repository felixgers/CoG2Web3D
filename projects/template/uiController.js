dojo.ready(function () {
   //call this app module and

   dojo.registerModulePath("BGE.App", "../app/app");
   dojo.require("BGE.App");
    var viewerApp,
        cube,
        myModel,
        test = new BGE.Node.Group(),
        glObject;

    viewerApp = new BGE.App();
    viewerApp.init("../../shader/color.vertex", "../../shader/color.fragment");

    //show coordinates for development
    viewerApp.add("coordinateSystem");

    //create child per app and translate,rotate,scale it
    //cube=viewerApp.add("cube");
    // create and add child
    viewerApp.add("triangle");


    glObject=viewerApp.add("cube");
    glObject.translate({x: 1, y: 0, z: -7});
    glObject.rotate({x: 0, y: 1, z: 0});
    glObject.scale({x: 0.5, y: 0.5, z: 0.5});
       

    //simply add childs
    /*
    viewerApp.add("triangle");
    viewerApp.add("monkey");
    */

    //app starten
    viewerApp.start();
});
