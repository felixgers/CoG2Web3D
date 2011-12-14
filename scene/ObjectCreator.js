dojo.registerModulePath("BGE.Model","../tools/models/model");
dojo.require("BGE.Model");
dojo.provide("BGE.ObjectCreator");
BGE.ObjectCreator = (function() {
    //schritt1 object erzeugen
    //schritt2 hinzufúegen
    //schritt3 init

    //weiter mit rotation scale
    //weitere objekte
    
    var node,
        group,
        shape,
        obj,
        gl,
        setGL = function(_gl){
           gl=_gl;
        },
        createObject = function() {
            node = BGE.Node;
            group = node.Group;
            shape = BGE.Shape;


             obj = {
                shape:new group(),
                rotation:new node.Rotate(0,0,0),
                scalation:new node.Scale(1,1,1),
                translation:new node.Translation(-1,-1,-5)
             };


            obj.shape.addChild(obj.translation);
            obj.shape.addChild(obj.rotation);
            obj.shape.addChild(obj.scalation);
            obj.translate=function(point){
                    point.x=point.x + -1;
                    point.y=point.y + -1;
                    point.z=point.z + -5;
                    obj.translation.translate(point.x,point.y,point.z);
             };

             obj.rotate=function(point){
                   obj.rotation.rotate(point.x,point.y,point.z);
             };

             obj.scale=function(point){
                   obj.scalation.scale(point.x,point.y,point.z);
             };

             return obj;
        },
        addJSONModel = function(name){
             var o = new createObject(),
                 myModel=new BGE.Model(gl);
                 myModel.loadJsonFile('../../tools/models/' + name + '.json');
                 o.shape.addChild(myModel);
                 return o;
        },
        triangle=function(){
            var tri = new createObject();
            tri.shape.addChild(new BGE.Shape.Triangle(1.0,1.0));
            return tri;
        },
        coordinateSystem=function(){
            var system=new createObject(),
                xAxisStart={x:0,y:0,z:0},
                xAxisEnd={x:3,y:0,z:0},

                yAxisStart={x:0,y:0,z:0},
                yAxisEnd={x:0,y:3,z:0},

                zAxisStart={x:0,y:0,z:0},
                zAxisEnd={x:0,y:0,z:3};

            system.translate({x:0,y:0,z:0});
            system.shape.addChild(new BGE.Shape.Line(xAxisStart,xAxisEnd));
            system.shape.addChild(new BGE.Shape.Line(yAxisStart,yAxisEnd));
            system.shape.addChild(new BGE.Shape.Line(zAxisStart,zAxisEnd));

            return system;
        };

        return{
            setGL:setGL,
            triangle:triangle,
            coordinateSystem:coordinateSystem,
            addJSONModel:addJSONModel
        }


}());