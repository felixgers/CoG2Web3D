dojo.registerModulePath("BGE.importScript","../app/import");
dojo.registerModulePath("BGE.Scene","../scene/scene");
dojo.registerModulePath("BGE.Node","../scene/nodes");
dojo.registerModulePath("BGE.Camera","../scene/cameraNodes");
dojo.registerModulePath("BGE.Shape","../scene/basicShapeNodes");
dojo.registerModulePath("BGE.Shader","../scene/shader");
dojo.registerModulePath("BGE.Model","../tools/models/model");

dojo.require("BGE.Scene");
dojo.require("BGE.Node");
dojo.require("BGE.Camera");
dojo.require("BGE.Shape");
dojo.require("BGE.Shader");
dojo.require("BGE.Model");
dojo.require("BGE.importScript");

BGE.importScript("../../ext/glMatrix.js");
BGE.importScript("../../ext/matrixStack.js");

//load external libraries


dojo.provide("BGE.App");
BGE.App = function() {
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
        name,
        canvas,
        //default ("shader-vs", "shader-fs"); // Shader form HTML tag.
        vertexShaderName = "../../shader/simple.vertex",
        fragmentShaderName = "../../shader/white.fragment",

        init = function(_canvas,_vertexShaderName,_fragmentShaderName) {
            // Shader source code.
            if (_vertexShaderName!== undefined) {
                vertexShaderName = _vertexShaderName;
            }
            if (_fragmentShaderName!== undefined) {
                fragmentShaderName = _fragmentShaderName;
            }
  
            canvas=_canvas;
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
        createScene=function(){
            var sceneGraph=new BGE.Node.Group(),
                camera=new BGE.Camera.PositionCamera(45.0, 1 , 1, 1000);

            scene=new BGE.Scene();
            scene.init(gl,canvas,aspectRatio,shader);
            sceneGraph.addChild(camera);
            scene.setSceneGraph(sceneGraph);
        },

        /**
         * @param canvas
         * @returns gl
         */
        initGL = function(canvas) {
            try {
                var gl = canvas.getContext("experimental-webgl");//("webgl");
                gl.viewport(0, 0, canvas.width, canvas.height);

            } catch (e) {
                alert("Error initialising WebGL.");
                return null;
            }
            if (!gl) {
                alert("No gl context: Could not initialise WebGL.");
                return null;
            }
            // Maybe GL corrected the size of the canvas,
            // because the implementation could not satisfy it.
            // Now it is different form the on of the HTMLcanvas.
            //canvas.width = gl.drawingBufferWidth;
            //canvas.height = gl.drawingBufferHeight;
            return gl;
        },

        startLoop = function() {
           // Check if loop is already running.
           if (timerHandle) {
               return;
           }
            // Start interval
            var startDate = new Date();
            startTime = startDate.getTime() / 1000.0;

            timerHandle = window.setInterval(function() {
                update();
            }, (1000.0 / framerate));
        },

        /**
         * Stop scene time
         */
        stopLoop = function() {
            if (timerHandle) {
                window.clearInterval(timerHandle);
                timerHandle = null;
            }
        },

        /**
         * Main loop.
         * Called by window interval handler
         */
        update = function() {
            // Calculate time
            var newDate = new Date();
            var time = (newDate.getTime() / 1000.0) - startTime;
            scene.draw(time);
            // DEBUG
            // --------------------------------------------
            //this.debug.innerHTML = Math.round(10 / (time - this.lastTime)) / 10.0 + " fps";
            //lastTime = time;
            // --------------------------------------------
        },
        clear = function() {
            gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
        },

        getGL = function(){
            return gl;
        },
        setScene = function(_scene){
            scene=_scene;
        },
        add=function(_group){
           scene.add(_group);
        }
        getShader=function(){
            return shader;
        },
        getAspectRatio=function(){
            return aspectRatio;
        },
        getCanvas=function(){
            return canvas;
        };

        //revealing public API
        return {
            init:init,
            getGL:getGL,
            getShader:getShader,
            getAspectRatio:getAspectRatio,
            getCanvas:getCanvas,
            setScene:setScene,
            start:startLoop,
            stop:stopLoop,
            clear:clear,
            add:add
        }
};



