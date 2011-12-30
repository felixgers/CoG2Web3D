dojo.provide("BGE.Camera");
/**
 * Simple perspective campera 
 * 
 * @param verticalFieldOfView
 * @param aspectratio
 * @returns {PerspectiveCamera}
 */
BGE.Camera.PerspectiveCamera = function (verticalFieldOfView, aspectratio, nearClipPlane, farClipPlane) {

    "use strict";

    this.cameraFlag = true;
	this.verticalFieldOfView = verticalFieldOfView;
	this.aspectratio = aspectratio;
	this.nearClipPlane = nearClipPlane;
	this.farClipPlane = farClipPlane;

	this.draw = function (time) {
		var fov = this.verticalFieldOfView,
		    ar = this.aspectratio,
		    nc = this.nearClipPlane,
		    fc = this.farClipPlane;
		mat4.perspective(fov, ar, nc, fc, this.pMatrix.top);
	};
};
BGE.Camera.PerspectiveCamera.prototype = new BGE.Node();

/**
 * @param verticalFieldOfView
 * @param aspectratio
 * @param nearClipPlane
 * @param farClipPlane
 * @returns {PositionCamera}
 */
BGE.Camera.PositionCamera = function (verticalFieldOfView, aspectratio, nearClipPlane, farClipPlane) {

    "use strict";

    var i;

    this.cameraFlag = true;
	this.verticalFieldOfView = verticalFieldOfView;
	this.aspectratio = aspectratio;
	this.nearClipPlane = nearClipPlane;
	this.farClipPlane = farClipPlane;

	this.position = [0, 0, 0];
	this.yrotation = 0.0; // <---
	this.xrotation = 0.0; // <---
	this.speedF = 0; // <---
	this.speedS = 0; // <---

	this.maxSpeed = 1.0;
	this.smoothArrayF = new Array(8);
	this.smoothArrayS = new Array(8);
	for (i = 0; i < 8; i++) {
		this.smoothArrayF[i] = 0.0;
		this.smoothArrayS[i] = 0.0;
	}

	this.smoothIndex = 0;


	this.draw = function (time) {
        var pMatrix = this.pMatrix,
		    fov = this.verticalFieldOfView,
            ar  = this.aspectratio,
            nc  = this.nearClipPlane,
            fc  = this.farClipPlane,
            pos = this.position,
            yrt = this.yrotation,
            xrt = this.xrotation,
            ind = this.smoothIndex,
            arrF = this.smoothArrayF,
            arrS = this.smoothArrayS,
            vF,
            vS,
            i,
            cosx,
            xv,
            yv,
            zv;

		ind++;
        if (ind >= 8) {
            ind = 0;
        }

        arrF[ind] = this.speedF;
        arrS[ind] = this.speedS;
        this.smoothIndex = ind;
        i = 0;

        // get smoothed speeds
        vF = 0.0;
        vS = 0.0;
        for (i = 0; i < 8; i++) {
            vF += arrF[i];
            vS += arrS[i];
        }
        vF /= 8.0;
        vS /= 8.0;

        // get velocity vector
        cosx = Math.cos(xrt);
        xv = -Math.sin(yrt) * cosx;
        yv = Math.sin(xrt);
        zv = Math.cos(yrt) * cosx;

        // forward backward
        if (vF !== 0.0) {
            pos[0] += vF *  xv;
            pos[1] += vF *  yv;
            pos[2] += vF *  zv;
        }

        // shift left right
        if (vS !== 0.0) {
            // The rest of a cross product with a z-axis
            pos[0] += vS * -zv;
            pos[2] += vS * xv;
        }

        mat4.perspective(fov, ar, nc, fc, pMatrix.top);
        mat4.rotateX(pMatrix.top, xrt);
        mat4.rotateY(pMatrix.top, yrt);
        mat4.translate(pMatrix.top, pos);

        this.position = pos;
	};
};
BGE.Camera.PositionCamera.prototype = new BGE.Node();


