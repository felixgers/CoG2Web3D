BGE.namespace("Scene");
/**
 * Scene
 *
 * @param gl
 * @param sceneGraph
 * @param canvas
 * @param framerate
 * @returns {Scene}
 */
BGE.Scene = (function()
{
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

	    init = function(_gl, _canvas, _aspectRatio, _shader) {
		    gl = _gl;
		    canvas = _canvas;
		    aspectRatio = _aspectRatio;
		    shader = _shader;

		    pMatrix = new MatrixStack();
		    mvMatrix = new MatrixStack();

		    // Set the scene graph
		    /*this.sceneGraph = this.buildSceneGraph();

		    //this.camera = this.recursiveSceneHasCamera(this.sceneGraph);
		    if(!this.camera) {
			    alert("The scene graph has no camera node.\nUsing default perspective.");
		    }
		    */

		    //initGL();
	    },

        /**
         * Start the scene, scene time.
         */
        initGL = function() {
            gl.clearColor(0.0, 0.0, 0.0, 1.0);
            gl.enable(gl.DEPTH_TEST);
            sceneGraph.init(gl,pMatrix,mvMatrix,shader.shaderProgram);
        },
        setSceneGraph=function(_sceneGraph){
            sceneGraph=_sceneGraph;
            camera = recursiveSceneHasCamera(sceneGraph);
		    if(!camera) {
			    alert("The scene graph has no camera node.\nUsing default perspective.");
		    }
		    initGL();
        },

        /**
         * This method checks if the scene graph has a camera node attached.
         */
        recursiveSceneHasCamera = function(node) {
            if(node.groupFlag) {
                var children = node.children;
                for(var i=0; i<children.length; i++) {
                    node = recursiveSceneHasCamera(children[i]);
                    if(node) {
                        return node;
                    }
                }
            } else if (node.cameraFlag) {
                return node;
            }
            return null;
        },
        draw = function(time) {
            // Clear canvas an z-buffer.
            gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
            mvMatrix.identity();
            pMatrix.identity();

            // Set some default frustrum.
            if(!camera) {
                pMatrix.perspective(45.0, this.aspectratio, 1, 100);
            }

            update(time);
            sceneGraph.draw(time);
        },
        clear=function(){
	        sceneGraph.clear();
        },
        update = function(time) {
        },
        handleMouseEvent = function(e) {
        },
        handleKeyDown = function(e) {
            switch (e.keycode) {
            case 38: // up arrow
                if(up)
                    camera.speedF = 1.0;
                else
                    this.camera.speedF = 0.0;
                break;

            case 40: // down arrow
                if(up)
                    this.camera.speedF = -1.0;
                else
                    this.camera.speedF = 0.0;
                break;

            case 37: // left arrow
                if(up)
                    this.camera.speedS = -1.0;
                else
                    this.camera.speedS = 0.0;
                break;

            case 39: // right arrow
                if(up)
                    this.camera.speedS = 1.0;
                else
                    this.camera.speedS = 0.0;
                break;

            default:
                break;
            }
        },
        handleKeyUp = function(e) {
        };

        return{
          init:init,
          setSceneGraph:setSceneGraph,
          draw:draw,
          clear:clear
        };
}());







