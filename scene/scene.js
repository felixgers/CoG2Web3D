/**
 * Scene
 *
 * @param gl
 * @param sceneGraph
 * @param canvas
 * @param framerate
 * @returns {Scene}
 */

dojo.registerModulePath("BGE.ModelManager", "../tools/models/modelManager");
dojo.require("BGE.ModelManager");

dojo.provide("BGE.Scene");
BGE.Scene = function () {

    "use strict";

	// Variables used in the draw method.
	var gl,
	    canvas,
	    // Projection matrix stack.
	    pMatrix,
	    // Model-View matrix stack.
	    mvMatrix,

	    shader,
	    sceneGraph,
	    camera = null,	// will be set automatically given the scenegraph.

	    // Viewing parameter.
	    aspectRatio,
	    verticalViewAngle = 45.0,
        modelManager = BGE.ModelManager,
        up = false,



	    init = function (p_gl, p_canvas, p_aspectRatio, p_shader) {
		    gl = p_gl;
		    canvas = p_canvas;
		    aspectRatio = p_aspectRatio;
		    shader = p_shader;

		    pMatrix = new MatrixStack();
		    mvMatrix = new MatrixStack();
	    },

        /**
         * Start the scene, scene time.
         */
        initGL = function () {
            gl.clearColor(0.0, 0.0, 0.0, 1.0);
            gl.enable(gl.DEPTH_TEST);
            sceneGraph.init(gl, pMatrix, mvMatrix, shader.shaderProgram);
            modelManager.init(gl, sceneGraph);
        },
        add = function (name) {
            var objects;
            switch (name) {
            case "triangle":
                objects = modelManager.triangle();
                objects[0].translate({x: 0, y: 0, z: -7});
                break;
            case "coordinateSystem":
                objects = modelManager.coordinateSystem();
                break;
            default: 
			    objects = modelManager.addJSONModelByName(name);
                objects[0].translate({x: 0, y: 0, z: -7});
                break;
            }
            sceneGraph.addChild(objects[0].shape);
            sceneGraph.init(gl, pMatrix, mvMatrix, shader.shaderProgram);
            return objects[0];
        },
        addNode = function (group) {
            if (group instanceof BGE.Node.Group) {
                sceneGraph.addChild(group);
                sceneGraph.init(gl, pMatrix, mvMatrix, shader.shaderProgram);
            }
        },
        /**
         * This method checks if the scene graph has a camera node attached.
         */
        recursiveSceneHasCamera = function (node) {
            var i,
                children;

            if (node.groupFlag) {
                children = node.children;
                for (i = 0; i < children.length; i++) {
                    node = recursiveSceneHasCamera(children[i]);
                    if (node) {
                        return node;
                    }
                }
            } else if (node.cameraFlag) {
                return node;
            }
            return null;
        },
        setSceneGraph = function (p_sceneGraph) {
            sceneGraph = p_sceneGraph;
            camera = recursiveSceneHasCamera(sceneGraph);
		    if (!camera) {
			    console.log("The scene graph has no camera node.\nUsing default perspective.");
		    }
		    initGL();
        },
        getSceneGraph = function () {
            return sceneGraph;
        },
        update = function (time) {
        },
        draw = function (time) {
            // Clear canvas an z-buffer.
            gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
            mvMatrix.identity();
            pMatrix.identity();

            // Set some default frustrum.
            if (!camera) {
                pMatrix.perspective(45.0, this.aspectratio, 1, 100);
            }

            update(time);
            sceneGraph.draw(time);
        },
        clear = function () {
	        sceneGraph.clear();
        },
        handleMouseEvent = function (e) {
        },
        handleKeyDown = function (e) {
            switch (e.keycode) {
            case 38: // up arrow
                if (up) {
                    camera.speedF = 1.0;
                } else {
                    this.camera.speedF = 0.0;
                }
                break;

            case 40: // down arrow
                if (up) {
                    this.camera.speedF = -1.0;
                } else {
                    this.camera.speedF = 0.0;
                }
                break;

            case 37: // left arrow
                if (up) {
                    this.camera.speedS = -1.0;
                } else {
                    this.camera.speedS = 0.0;
                }
                break;

            case 39: // right arrow
                if (up) {
                    this.camera.speedS = 1.0;
                } else {
                    this.camera.speedS = 0.0;
                }
                break;

            default:
                break;
            }
        },
        handleKeyUp = function (e) {
        };

    return {
        init: init,
        setSceneGraph: setSceneGraph,
        getSceneGraph: getSceneGraph,
        draw: draw,
        clear: clear,
        add: add,
        addNode: addNode
    };
};







