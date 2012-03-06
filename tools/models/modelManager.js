dojo.registerModulePath("BGE.ObjectCreator", "../scene/objectCreator");
dojo.require("BGE.ObjectCreator");
dojo.provide("BGE.ModelManager");
BGE.ModelManager = (function () {

    "use strict";

    var gl,
        sceneGraph,
        JSONData,
        objectCreator = BGE.ObjectCreator,
        objects,


        init = function (p_gl, p_sceneGraph) {
            gl = p_gl;
            sceneGraph = p_sceneGraph;
            objectCreator.init(gl);
        },
        setTransitions = function (p_data, o) {
            var translate,
                scale;

            if (p_data.mesh.transitions.translate !== undefined) {

                translate = p_data.mesh.transitions.translate;
                console.debug("translateX: " + translate.x);
                console.debug("translateY: " + translate.y);
                console.debug("translateZ: " + translate.z);

                o.translate({x: translate.x, y: translate.y, z: translate.z});

            }

            if (p_data.mesh.transitions.scale !== undefined) {

                scale = p_data.mesh.transitions.scale;
                console.debug("scaleX: " + scale.x);
                console.debug("scaleY: " + scale.y);
                console.debug("scaleZ: " + scale.z);

                o.scale({x: scale.x, y: scale.y, z: scale.z});
            }
        },
        loadData = function () {
            var model,
                o,
                mesh,
                i,
                objects = [];

            for (i = 0; i < JSONData.meshes.length; i++) {
                model = new BGE.Model(gl);
                mesh = JSONData.meshes[i];
                model.setData(mesh);
                model.loadData();
                o = objectCreator.createObject();
                setTransitions(mesh, o);
                o.shape.addChild(model);
                objects.push(o);
            }

            return objects;
        },
        load = function (url) {

            var localFileSys,
                request;

            try {
                request = new XMLHttpRequest();
            } catch (e) {
                console.error("Could not create XMLHttpRequest");
                return;
            }

            // Check whether document is located in local file system.
            localFileSys = document.URL.match(/^file:\/\/.*?$/);

            // Do not open asynchronously, thus wait for the response.
            request.open("GET", url, false);
            request.overrideMimeType("text/plain");
            request.send(null);

            // Check if we got HTTP status 200 (OK) or in local file system status 0
            if ((localFileSys && request.status === 0) || request.status === 200) {
                JSONData = JSON.parse(request.responseText);
                return loadData();
            } else { // Failed
                console.error("Could not load model file: " + url);
            }
        },
        loadJsonFile = function (filename) {
	        return load(filename);
        },

        loadJsonDirect = function (jsonData) {
            JSONData = JSON.parse(jsonData);
            return loadData();
        },

        addJSONModelByName = function (name) {
            return loadJsonFile('../../tools/models/' + name + '.json');
        },
        triangle = function () {
            var tri = objectCreator.createObject();
            objects = [];
            tri.shape.addChild(new BGE.Shape.Triangle(1.0, 1.0));
            objects.push(tri);

            return objects;
        },
        coordinateSystem = function () {
            var system = new objectCreator.createObject(),
                group = new BGE.Node.Group(),
                xAxisStart = {x: 0, y: 0, z: 0},
                xAxisEnd = {x: 3, y: 0, z: 0},
                yAxisStart = {x: 0, y: 0, z: 0},
                yAxisEnd = {x: 0, y: 3, z: 0},

                zAxisStart = {x: 0, y: 0, z: 0},
                zAxisEnd = {x: 0, y: 0, z: 3};

            objects = [];
            system.translate({x: -1, y: -1, z: -5});
            system.shape.addChild(new BGE.Shape.Line(xAxisStart, xAxisEnd));
            system.shape.addChild(new BGE.Shape.Line(yAxisStart, yAxisEnd));
            system.shape.addChild(new BGE.Shape.Line(zAxisStart, zAxisEnd));
            objects.push(system);
            return objects;
        };

    return {
        init: init,
        loadJsonFile: loadJsonFile,
        loadJsonDirect: loadJsonDirect,
        coordinateSystem: coordinateSystem,
        triangle: triangle,
        addJSONModelByName: addJSONModelByName
    };
}());