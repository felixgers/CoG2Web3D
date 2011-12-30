dojo.registerModulePath("BGE.ModelManager", "../tools/models/modelManager");
dojo.require("BGE.ModelManager");

dojo.provide("BGE.ObjectCreator");
BGE.ObjectCreator = (function () {

    "use strict";

    
    var gl,
        sceneGraph,
        modelManager = BGE.ModelManager,
        init = function (p_gl) {
            gl = p_gl;
        },
        createObject = function () {
            var node = BGE.Node,
                Group = node.Group,
                shape = BGE.Shape,
                obj = {
                    shape: new Group(),
                    rotation: new node.Rotate(0, 0, 0),
                    scalation: new node.Scale(1, 1, 1),
                    translation: new node.Translation(0, 0, 0)
                };


            obj.shape.addChild(obj.translation);
            obj.shape.addChild(obj.rotation);
            obj.shape.addChild(obj.scalation);
            obj.translate = function (point) {
                obj.translation.translate(point.x, point.y, point.z);
            };

            obj.rotate = function (point) {
                obj.rotation.rotate(point.x, point.y, point.z);
            };

            obj.scale = function (point) {
                obj.scalation.scale(point.x, point.y, point.z);
            };

            return obj;
        };

    return {
        init: init,
        createObject: createObject
    };


}());