dojo.provide("BGE.Shape");
/**
 * Shape base class
 * @returns {Shape}
 */
BGE.Shape = function () {

    "use strict";

    // Vertex buffer.
    this.vertexBuffer = null;
    this.tesselationMode = 0;

    //this.ShapeSuperInit = this.init;
    this.init = function (gl, pMatrix, mvMatrix, shaderProgram) {
        this.gl = gl;
        this.pMatrix = pMatrix;
        this.mvMatrix = mvMatrix;
        this.shaderProgram = shaderProgram;
        // Default values for variables.
        this.tesselationMode = gl.TRIANGLES;

        // Create vertex buffer for geometry and bind it.
        this.vertexBuffer = gl.createBuffer();
        this.vertexBuffer.itemSize = 3; // default
        this.vertexBuffer.numItems = 0;
        gl.bindBuffer(gl.ARRAY_BUFFER, this.vertexBuffer);
        // From here on the inheriting classes should fill the bound buffer.
    };

    this.draw = function (time) {
        var gl = this.gl;
        gl.bindBuffer(gl.ARRAY_BUFFER, this.vertexBuffer);
        gl.vertexAttribPointer(this.shaderProgram.vertexPositionAttribute, this.vertexBuffer.itemSize, gl.FLOAT, false, 0, 0);

        // Push the modified matrices into the the shader program,
        // at the correct position, that we stored.
        gl.uniformMatrix4fv(this.shaderProgram.pMatrixUniform, false, this.pMatrix.top);
        gl.uniformMatrix4fv(this.shaderProgram.mvMatrixUniform, false, this.mvMatrix.top);
        gl.drawArrays(this.tesselationMode, 0, this.vertexBuffer.numItems);
    };
};
BGE.Shape.prototype = new BGE.Node();

/**
 * @returns {Shape}
 */
dojo.provide("BGE.Shape.ColoredShape");
BGE.Shape.ColoredShape = function () {

    "use strict";

    // Color buffer.
    this.colorBuffer = null;
    this.colorItemSize = 4; // default rgba
    this.colorNumItems = 0;

    this.superDraw = this.draw;
    this.draw = function (time) {
        // First set the color then call super.

        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.colorBuffer);
        this.gl.vertexAttribPointer(this.shaderProgram.vertexColorAttribute, this.colorItemSize, this.gl.FLOAT, false, 0, 0);

        this.gl.drawArrays(this.tesselationMode, 0, this.vertexBuffer.numItems);
        this.superDraw(time);


    };
};
BGE.Shape.ColoredShape.prototype = new BGE.Shape();


/**
 * 
 * @param width
 * @param height
 * @returns {Triangle}
 */

//dojo.provide("BGE.Shape.Triangle");
BGE.Shape.Triangle = function (width, height) {

    "use strict";

	// Remember the bound super functions.
	this.TriangleSuperInit = this.init;
	this.init = function (gl, pMatrix, mvMatrix, shaderProgram) {
        var w = width / 2.0,
            h = height / 2.0,
            vertices = [
                0.0,  h,  0.0,
                -w, -h,  0.0,
                w, -h,  0.0
            ],
            colors = [
                1.0, 0.0, 0.0, 1.0,
                0.0, 1.0, 0.0, 1.0,
                0.0, 0.0, 1.0, 1.0
            ];
        this.TriangleSuperInit(gl, pMatrix, mvMatrix, shaderProgram);


		// Alternative: new WebGLFloatArray(vertices);
		gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);
		this.vertexBuffer.numItems = vertices.length / this.vertexBuffer.itemSize;
		 // Create color buffer.
	    this.colorBuffer = gl.createBuffer();
	    gl.bindBuffer(gl.ARRAY_BUFFER, this.colorBuffer);
        this.colorNumItems = this.vertexBuffer.numItems;


            
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(colors), gl.STATIC_DRAW);
		//delete init;
	};
};
BGE.Shape.Triangle.prototype = new BGE.Shape.ColoredShape();


/**
 * 
 * @param width
 * @param height
 * @returns {Rectangle}
 */
//dojo.provide("BGE.Shape.Rectangle");
BGE.Shape.Rectangle = function (width, height) {

    "use strict";

    var w = width / 2.0,
        h = height / 2.0,
        vertices = [
            w,  h,  0.0,
            -w,  h,  0.0,
            w, -h,  0.0,
            -w, -h,  0.0
        ];
	 // Remember the bound super functions.
	this.TriangleSuperInit = this.init;
	this.init = function (gl, pMatrix, mvMatrix, shaderProgram) {
		this.TriangleSuperInit(gl, pMatrix, mvMatrix, shaderProgram);


		gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);
		this.vertexBuffer.numItems = vertices.length / this.vertexBuffer.itemSize;
		this.tesselationMode = gl.TRIANGLE_STRIP;


		//delete init;
	};
};
BGE.Shape.Rectangle.prototype = new BGE.Shape();


BGE.Shape.Line = function (begin, end) {

    "use strict";

    var colorBuffer = null,
        // default rgba
        colorItemSize = 4,
        colorNumItems = 0,
        vertexBuffer = null,
        //array for vertices
        vertices,
        //array for colors
        colors,
        tesselationMode = 0,
        gl,
        pMatrix,
        mvMatrix,
        shaderProgram,
        draw = function (time) {
            gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);
            gl.vertexAttribPointer(shaderProgram.vertexColorAttribute, colorItemSize, gl.FLOAT, false, 0, 0);

            gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
            gl.vertexAttribPointer(shaderProgram.vertexPositionAttribute, vertexBuffer.itemSize, gl.FLOAT, false, 0, 0);

            // Push the modified matrices into the the shader program,
            // at the correct position, that we stored.
            gl.uniformMatrix4fv(shaderProgram.pMatrixUniform, false, pMatrix.top);
            gl.uniformMatrix4fv(shaderProgram.mvMatrixUniform, false, mvMatrix.top);
            gl.drawArrays(tesselationMode, 0, vertexBuffer.numItems);
        },
        init = function (p_gl, p_pMatrix, p_mvMatrix, p_shaderProgram) {
            gl = p_gl;
            pMatrix = p_pMatrix;
            mvMatrix = p_mvMatrix;
            shaderProgram = p_shaderProgram;
            // Default values for variables.
            tesselationMode = gl.LINE_LOOP;

            // Create vertex buffer for geometry and bind it.
            vertexBuffer = gl.createBuffer();
            vertexBuffer.itemSize = 3; // default
            vertexBuffer.numItems = 0;
            gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);

            vertices = [
                begin.x, begin.y, begin.z,
                end.x, end.y, end.z
            ];

            gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);
            vertexBuffer.numItems = vertices.length / vertexBuffer.itemSize;

            // Create color buffer.
            colorBuffer = gl.createBuffer();
            gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);

            colorNumItems = vertexBuffer.numItems;

            colors = [
                1.0, 0.0, 0.0, 1.0,
                0.0, 1.0, 0.0, 1.0,
                0.0, 0.0, 1.0, 1.0
            ];
            gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(colors), gl.STATIC_DRAW);
        };
    return {
        init: init,
        draw: draw
    };
};
BGE.Shape.Line.prototype = new BGE.Node();


/**
 *
 * @param width
 * @param height
 * @param depth
 * @returns {ColoredShape}
 */
BGE.Shape.ColoredShape.Box = function (width, height, depth) {

    "use strict";

    var w = width / 2.0,
        h = height / 2.0,
        d = depth / 2.0,
        // Build the box from triangles.
        // First the vertices of Box are specified.
        // Then vertices are used for triangle vertices.
        vertices = []; // Array of arrays with (xyz).

	this.BoxSuperInit = this.init;
	this.init = function (gl, pMatrix, mvMatrix, shaderProgram) {
		this.BoxSuperInit(gl, pMatrix, mvMatrix, shaderProgram);
        var i,
            iw,
            j,
            jh,
            k,
            kd,
            trisVertices,
            verticesIndexList,
            index,
            colors,
            indexColorBase,
            t,
            red,
            green,
            blue;
		for (i = 1; i >= -1; i -= 2) {
		    iw = i * w; //x
			for (j = 1; j >= -1; j -= 2) {
				jh = j * h; // y
				for (k = 1; k >= -1; k -= 2) {
					kd = k * d; // z
					vertices.push([iw, jh, kd]);
				}
			}
		}
		// Build buffer data for triangles.
		trisVertices = [];
		// Indices of the vertices of the triangulated, rolled up box.
		verticesIndexList = [3, 4, 2, 1, 3, 2, 7, 3, 1, 5, 7, 1, 5, 1, 2, 6, 5, 2, 6, 2, 4, 4, 8, 6, 8, 4, 3, 7, 8, 3, 6, 8, 7, 5, 6, 7];
		// Index starts with 0.
		for (index = 0; index < verticesIndexList.length; index + 1) {
			trisVertices = trisVertices.concat(vertices[verticesIndexList[index] - 1]);
		}
		// Initialize the data buffer.
		gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(trisVertices), gl.STATIC_DRAW);
		this.vertexBuffer.numItems = trisVertices.length / this.vertexBuffer.itemSize;

		// Create color buffer.
		this.colorBuffer = gl.createBuffer();
		gl.bindBuffer(gl.ARRAY_BUFFER, this.colorBuffer);
		colors = [];
		// One Color per face.
		for (index = 0; index < trisVertices.length; index += 6) {
		    indexColorBase = 1 + index / 6;
			// Avoid black (and white);f
			if (!(indexColorBase & 7)) { indexColorBase++; }
			for (t = 0; t < 6; t++) { // All points of one triangle get the same color.
				red = indexColorBase & 1;
				green = indexColorBase & 2;
				blue = indexColorBase & 4;
				colors.push(red, green, blue, 1.0);
			}
		}
		gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(colors), gl.STATIC_DRAW);
		this.colorNumItems = this.vertexBuffer.numItems;

		//delete init;
	};
};
BGE.Shape.ColoredShape.Box.prototype = new BGE.Shape.ColoredShape();

