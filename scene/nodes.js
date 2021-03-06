dojo.provide("BGE.Node");
/**
 * Base node
 * @returns {Node}
 */
BGE.Node = function () {

    "use strict";

	this.gl = null;
	this.pMatrix = null;
	this.mvMatrix = null;
	this.shaderProgram = null;

	this.cameraFlag = false;
    this.rootFlag = false;
	this.groupFlag = false;

	this.init = function (p_gl, p_pMatrix, p_mvMatrix, p_shaderProgram) {
		this.gl = p_gl;
		this.pMatrix = p_pMatrix;
		this.mvMatrix = p_mvMatrix;
		this.shaderProgram = p_shaderProgram;
	};

	this.draw = function (time) {};
};


/**
 * 
 * @returns {Group}
 */
BGE.Node.Group = function () {

    "use strict";

    var i;

	this.groupFlag = true;
	this.children = [];
	this.addChild = function (child) {
		this.children.push(child);
	};
	this.superInit = this.init;
	this.init = function (gl, pMatrix, mvMatrix, shaderProgram) {
		this.superInit(gl, pMatrix, mvMatrix, shaderProgram);

		for (i = 0; i < this.children.length; i++) {
			this.children[i].init(gl, pMatrix, mvMatrix, shaderProgram);
		}
	};


	this.draw = function (time) {
        var i,
            mvMatrix = this.mvMatrix;
		// Preserve the current transformation.
		// Not for the perspective, assuming it does not change.
		mvMatrix.push();

		for (i = 0; i < this.children.length; i++) {
            this.children[i].draw(time);
		}
		// Go back up in transformation hierarchy.
		mvMatrix.pop();
	};
};
BGE.Node.Group.prototype = new BGE.Node();
BGE.Node.Group.prototype.reload = function () {

    "use strict";

    var i;
	for (i = 0; i < this.children.length; i++) {
		this.children[i].init(this.gl, this.pMatrix, this.mvMatrix, this.shaderProgram);
	}
};

BGE.Node.Group.prototype.clear = function () {

    "use strict";

    while (this.children.length > 1) {
        this.children.pop();
    }
};



/**
 * Translation node. 
 * @param x
 * @param y
 * @param z
 * @returns {Translation}
 */
BGE.Node.Translation = function (x, y, z) {

    "use strict";

    this.trans = [x, y, z];
	this.draw = function (time) {
		this.mvMatrix.translate(this.trans);
	};
    this.translate = function (x, y, z) {
        this.trans[0] = x;
        this.trans[1] = y;
        this.trans[2] = z;
    };
};
BGE.Node.Translation.prototype = new BGE.Node();


/**
 * Scale node 
 * @param x
 * @param y
 * @param z
 * @returns {Scale}
 */
BGE.Node.Scale = function (x, y, z) {

    "use strict";

	this.scalation = [x, y, z];
	this.draw = function (time) {
		this.mvMatrix.scale(this.scalation);
	};
    this.scale = function (x, y, z) {
        this.scalation[0] = x;
        this.scalation[1] = y;
        this.scalation[2] = z;
    };
};
BGE.Node.Scale.prototype = new BGE.Node();




/**
 * Rotation rotor
 * @param speed as frequency (rotations per second)
 */
/*
BGE.Node.Rotate = function(xSpeed,ySpeed,zSpeed) {
	xSpeed *= 2.0 * Math.PI;
	ySpeed *= 2.0 * Math.PI;
	zSpeed *= 2.0 * Math.PI;
	this.draw = function(time) {
		this.mvMatrix.rotateX(xSpeed * time);
		this.mvMatrix.rotateY(ySpeed * time);
		this.mvMatrix.rotateZ(zSpeed * time);
	};
    this.rotate=function(xSpeed,ySpeed,zSpeed){
        xSpeed *= 2.0 * Math.PI;
	    ySpeed *= 2.0 * Math.PI;
	    zSpeed *= 2.0 * Math.PI;
        
    }
}
BGE.Node.Rotate.prototype = new BGE.Node;
*/

BGE.Node.Rotate = function (x, y, z) {

    "use strict";

    var xAxis,
        yAxis,
        zAxis,
        reset = function () {
            xAxis = 0;
            yAxis = 0;
            zAxis = 0;
        },

        calculate = function (x, y, z) {
            xAxis = x;
            yAxis = y;
            zAxis = z;
            xAxis *= 1.0 * Math.PI;
	        yAxis *= 1.0 * Math.PI;
	        zAxis *= 1.0 * Math.PI;
        };

    calculate(x, y, z);
	this.draw = function (time) {
        this.mvMatrix.rotateX(xAxis * time);
		this.mvMatrix.rotateY(yAxis * time);
		this.mvMatrix.rotateZ(zAxis * time);
	};
    this.rotate = function (x, y, z) {
        reset();
        calculate(x, y, z);
    };
};
BGE.Node.Rotate.prototype = new BGE.Node();
////////////////////dependent imports ////////////////////

//BGE.importScript("../../scene/basicShapeNodes.dojo");

