BGE.namespace("Node.PerspectiveCamera");
/**
 * Simple perspective campera 
 * 
 * @param verticalFieldOfView
 * @param aspectratio
 * @returns {PerspectiveCamera}
 */
BGE.Node.PerspectiveCamera = function(verticalFieldOfView, aspectratio, nearClipPlane, farClipPlane)
{
	this.cameraFlag = true;
	this.verticalFieldOfView = verticalFieldOfView;
	this.aspectratio = aspectratio;
	this.nearClipPlane = nearClipPlane;
	this.farClipPlane = farClipPlane;

	this.draw = function(time) { 
		var fov = this.verticalFieldOfView;
		var ar = this.aspectratio;
		var nc = this.nearClipPlane;
		var fc = this.farClipPlane;
		mat4.perspective(fov, ar, nc, fc, this.pMatrix.top);
	};
};
BGE.Node.PerspectiveCamera.prototype = new BGE.Node;

BGE.namespace("Node.PositionCamera");
/**
 * @param verticalFieldOfView
 * @param aspectratio
 * @param nearClipPlane
 * @param farClipPlane
 * @returns {PositionCamera}
 */
BGE.Node.PositionCamera = function(verticalFieldOfView, aspectratio, nearClipPlane, farClipPlane)
{
	this.cameraFlag = true;
	this.verticalFieldOfView = verticalFieldOfView;
	this.aspectratio = aspectratio;
	this.nearClipPlane = nearClipPlane;
	this.farClipPlane = farClipPlane;

	this.position = [0,0,0];
	this.yrotation = 0.0; // <---
	this.xrotation = 0.0; // <---
	this.speedF = 0; // <---
	this.speedS = 0; // <---

	this.maxSpeed = 1.0;
	this.smoothArrayF = new Array(8);
	this.smoothArrayS = new Array(8);
	for(var i=0;i<8;i++) {
		this.smoothArrayF[i] = 0.0;
		this.smoothArrayS[i] = 0.0;
	}

	this.smoothIndex = 0;


	this.draw = function(time) {
        var pMatrix=this.pMatrix;
		var fov = this.verticalFieldOfView;
        var ar  = this.aspectratio;
        var nc  = this.nearClipPlane;
        var fc  = this.farClipPlane;
        var pos = this.position;
        var yrt = this.yrotation;
        var xrt = this.xrotation;
        var ind = this.smoothIndex;
        var arrF = this.smoothArrayF;
        var arrS = this.smoothArrayS;

		ind++;
        if(ind>=8) ind = 0;
        arrF[ind] = this.speedF;
        arrS[ind] = this.speedS;
        this.smoothIndex = ind;
        var i = 0;

        // get smoothed speeds
        var vF = 0.0;
        var vS = 0.0;
        for(i=0;i<8;i++) {
            vF += arrF[i];
            vS += arrS[i];
        }
        vF/=8.0;
        vS/=8.0;

        // get velocity vector
        var cosx = Math.cos(xrt);
        var xv =  -Math.sin(yrt) * cosx;
        var yv =                  Math.sin(xrt);
        var zv = Math.cos(yrt) * cosx;

        // forward backward
        if(vF != 0.0) {
            pos[0] += vF *  xv;
            pos[1] += vF *  yv;
            pos[2] += vF *  zv;
        }

        // shift left right
        if(vS != 0.0) {
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
BGE.Node.PositionCamera.prototype = new BGE.Node;


