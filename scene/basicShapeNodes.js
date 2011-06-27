/**
 * 
 * @param width
 * @param height
 * @returns {Triangle}
 */
function Triangle(width, height)
{
	// Remember the bound super functions.
	this.superInit = this.init;
	this.init = function(gl, pMatrix, mvMatrix, shaderProgram){
		this.superInit(gl, pMatrix, mvMatrix, shaderProgram);
		// Create buffer for triangle vertex positions.
		this.buffer = gl.createBuffer();
		gl.bindBuffer(gl.ARRAY_BUFFER, this.buffer);
		var w = width/2.0;
		var h = height/2.0;
		var vertices = [
		                0.0,  h,  0.0,
		                -w, -h,  0.0,
		                w, -h,  0.0
		                ];
		gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);
		this.itemSize = 3;
		this.numItems = 3;
		this.tesselationMode = gl.TRIANGLES;
	};
}
Triangle.prototype = new Shape;


/**
 * 
 * @param width
 * @param height
 * @returns {Rectangle}
 */
function Rectangle(width, height) {
	// Remember the bound super functions.
	this.superInit = this.init;
	this.init = function(gl, pMatrix, mvMatrix, shaderProgram){
		this.superInit(gl, pMatrix, mvMatrix, shaderProgram);
		// Create buffer for square vertex positions.
		this.buffer = gl.createBuffer();
		gl.bindBuffer(gl.ARRAY_BUFFER, this.buffer);
		var w = width/2.0;
		var h = height/2.0;
		var vertices = [
		                w,  h,  0.0,
		                -w,  h,  0.0,
		                w, -h,  0.0,
		                -w, -h,  0.0
		                ];
		gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);
		this.itemSize = 3;
		this.numItems = 4;
		this.tesselationMode = gl.TRIANGLE_STRIP;
	};
}
Rectangle.prototype = new Shape;



/**
 * 
 * @param width
 * @param height
 * @returns {Triangle}
 */
function Box(width, height, depth)
{
	this.superInit = this.init;
	this.init = function(gl, pMatrix, mvMatrix, shaderProgram){
		this.superInit(gl, pMatrix, mvMatrix, shaderProgram);
		// Create buffer for triangle vertex positions.
		this.buffer = gl.createBuffer();
		gl.bindBuffer(gl.ARRAY_BUFFER, this.buffer);

		var w = width/2.0;
		var h = height/2.0;
		var d = depth/2.0;
		// Build the box from triangles.
		// First the corners of Box are specified.
		// Then Corners are used for triangle vertices.
		var corner = new Array;
		for(var i=1;i>=-1;i-=2){
			var iw = i*w; // x
			for(var j=1;j>=-1;j-=2){
				var jh = j*h; // y
				for(var k=1;k>=-1;k-=2){
					var kd= k*d; // z
					corner.push(iw,jh,kd);	
				} 	
			} 
		}
		// Build buffer data for triangles.
		 var vertices = new Array;

		// Corners of the rolled up box.
		var cornerList = [3,4,2,1,3,2,7,3,1,5,7,1,5,1,2,6,5,2,6,2,4,4,8,6,8,4,3,7,8,3,5,8,7,6,5,7];
		for(var i=0; i<cornerList.length;i++){
			var c=cornerList[i];
		 	var start = (c-1) * 3;
		 	var end = start + 3;
		 	var vertex = corner.slice(start, end);
		 	vertices.concat(vertex);
	 	}

		gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);
		this.itemSize = 3;
		this.numItems = 3;
		this.tesselationMode = gl.TRIANGLES;
	};
}
Box.prototype = new Shape;

////////////////////dependent imports ////////////////////

importScript("../../scene/cameraNodes.js");

