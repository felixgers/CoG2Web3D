dojo.registerModulePath("BGE.importScript", "../app/import");
dojo.registerModulePath("BGE.Scene", "../scene/scene");
dojo.registerModulePath("BGE.Node", "../scene/nodes");
dojo.registerModulePath("BGE.Camera", "../scene/cameraNodes");
dojo.registerModulePath("BGE.Shape", "../scene/basicShapeNodes");
dojo.registerModulePath("BGE.Shader", "../scene/shader");
dojo.registerModulePath("BGE.Model", "../tools/models/model");

dojo.require("BGE.Scene");
dojo.require("BGE.Node");
dojo.require("BGE.Camera");
dojo.require("BGE.Shape");
dojo.require("BGE.Shader");
dojo.require("BGE.Model");
dojo.require("BGE.importScript");

//load external libraries
BGE.importScript("../../ext/glMatrix.js");
BGE.importScript("../../ext/matrixStack.js");

dojo.provide("BGE.App");
BGE.App = function () {

    "use strict";

    var gl,
        shader,
        scene,
        eventManager,
        width = 500,
        height = 500,
        aspectRatio,
        // Loop parameter and variables.
        framerate = 30.0,
        startTime = 0.0,
        timerHandle = null,
        canvas,
        //default ("shader-vs", "shader-fs"); // Shader form HTML tag.
        vertexShaderName = "../../shader/simple.vertex",
        fragmentShaderName = "../../shader/white.fragment",

        /**
         * @param canvas
         * @returns gl
         */
        initGL = function (canvas) {
            var tempGL;
            try {
                tempGL = canvas.getContext("experimental-webgl");//("webgl");
                tempGL.viewport(0, 0, canvas.width, canvas.height);

            } catch (e) {
                console.error("Error initialising WebGL.");
                return null;
            }
            if (!tempGL) {
                console.error("No gl context: Could not initialise WebGL.");
                return null;
            }
            // Maybe GL corrected the size of the canvas,
            // because the implementation could not satisfy it.
            // Now it is different form the on of the HTMLcanvas.
            //canvas.width = gl.drawingBufferWidth;
            //canvas.height = gl.drawingBufferHeight;
            return tempGL;
        },
        createScene = function () {
            var sceneGraph = new BGE.Node.Group(),
                camera = new BGE.Camera.PositionCamera(45.0, 1, 1, 1000);

            scene = new BGE.Scene();
            scene.init(gl, canvas, aspectRatio, shader);
            sceneGraph.addChild(camera);
            scene.setSceneGraph(sceneGraph);
        },

        init = function (p_vertexShaderName, p_fragmentShaderName, p_canvas) {
            
            // Shader source code.
            if (p_vertexShaderName !== undefined) {
                vertexShaderName = p_vertexShaderName;
            }
            if (p_fragmentShaderName !== undefined) {
                fragmentShaderName = p_fragmentShaderName;
            }
            if ((p_canvas === undefined) || (p_canvas === null)) {
                canvas = document.createElement("canvas");
                document.body.appendChild(canvas);
            } else {
                canvas = p_canvas;
            }

            canvas.width = width;
            canvas.height = height;
            aspectRatio = width / height;
            gl = initGL(canvas);
            // Create Shader
            shader = new BGE.Shader().init(gl, vertexShaderName, fragmentShaderName);
            createScene();
            // Create event manager with objects
            //muss von aussen gesetzt werden
            // this.eventManager = new MyEventManager().init(this);
        },
        setCanvasSize = function (width, height) {
            canvas.width = width;
            canvas.height = height;
        },


        /**
         * Main loop.
         * Called by window interval handler**/
        update = function () {
                   // Calculate time
            var newDate = new Date(),
                time = (newDate.getTime() / 1000.0) - startTime;

            scene.draw(time);
        },
        startLoop = function () {
           // Check if loop is already running.
            if (timerHandle) {
                return;
            }
            // Start interval
            var startDate = new Date();
            startTime = startDate.getTime() / 1000.0;

            timerHandle = window.setInterval(function () {
                update();
            }, (1000.0 / framerate));
        },

        /**
         * Stop scene time
         */
        stopLoop = function () {
            if (timerHandle) {
                window.clearInterval(timerHandle);
                timerHandle = null;
            }
        },


        clear = function () {
            gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
        },

        getGL = function () {
            return gl;
        },
        setScene = function (p_scene) {
            scene = p_scene;
        },
        getShader = function () {
            return shader;
        },
        getAspectRatio = function () {
            return aspectRatio;
        },
        getCanvas = function () {
            return canvas;
        },
        add = function (name) {
            return scene.add(name);
        },
        addNode = function (group) {
            scene.addNode(group);
        }

    //revealing public API
    return {
        init: init,
        getGL: getGL,
        getShader: getShader,
        getAspectRatio: getAspectRatio,
        getCanvas: getCanvas,
        setCanvasSize: setCanvasSize,
        setScene: setScene,
        start: startLoop,
        stop: stopLoop,
        clear: clear,
        add: add,
        addNode: addNode
    };
};



