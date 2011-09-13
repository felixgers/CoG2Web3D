BGE.namespace("App");
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
            // Create event manager with objects
            //muss von aussen gesetzt werden
            // this.eventManager = new MyEventManager().init(this);
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
        getShader=function(){
            return shader;
        },
        getAspectRatio=function(){
            return aspectRatio;
        },
        getCanvas=function(){
            return canvas;
        },
        getName=function(){
            return name;
        },
        setName=function(_name){
            name=_name;
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
            setName:setName,
            getName:getName
        }
};



