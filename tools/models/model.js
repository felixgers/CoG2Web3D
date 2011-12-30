dojo.provide("BGE.Model");
BGE.Model = function (p_gl) {

    "use strict";

    var vertices,
        vertexPositionBuffer,
        normalMatrix,
        vertexTextureCoordBuffer = null,
        vertexIndexBuffer,
        normalBuffer = null,
        texture,
        colorBuffer = null,
        // we need gl before method init() called from scene, therefore we init model with it
        gl = p_gl,
        loaded = false,
        hasAnimations = false,
        lighting = false,
        animation,
        shaderProgram,
        pMatrix,
        mvMatrix,
        data,
        init = function (p_gl, p_pMatrix, p_mvMatrix, p_shaderProgram) {
            shaderProgram = p_shaderProgram;
            pMatrix = p_pMatrix;
            mvMatrix = p_mvMatrix;
        },
        draw = function (time) {

            var nUniform;

            if (loaded) {
                gl.bindBuffer(gl.ARRAY_BUFFER, vertexPositionBuffer);
                gl.vertexAttribPointer(shaderProgram.vertexPositionAttribute, vertexPositionBuffer.itemSize, gl.FLOAT, false, 0, 0);

                //if (vertexTextureCoordBuffer !== null) {
                //todo texture
                //else if (colorBuffer !== null) {
                if (colorBuffer !== null) {
                    gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);
                    gl.vertexAttribPointer(shaderProgram.vertexColorAttribute, colorBuffer.itemSize, gl.FLOAT, false, 0, 0);
                }
                if (lighting) {
                    if (normalBuffer !== null) {
                        //beleuchtung funktioniert noch nicht richtig
                        //beschreibung : https://developer.mozilla.org/de/WebGL/Beleuchtung_in_WebGL
                        gl.bindBuffer(gl.ARRAY_BUFFER, normalBuffer);
                        gl.vertexAttribPointer(shaderProgram.vertexNormalAttribute, normalBuffer.itemSize, gl.FLOAT, false, 0, 0);
                        //var normalMatrix = mat4.inverse(mvMatrix);
        
                        normalMatrix = mvMatrix.inverse(mvMatrix);
                        normalMatrix = normalMatrix.transpose(normalMatrix);
                        nUniform = gl.getUniformLocation(shaderProgram, "uNormalMatrix");
                        gl.uniformMatrix4fv(nUniform, false, new Float32Array(normalMatrix.flatten(normalMatrix)));
                    }
                }
                gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, vertexIndexBuffer);
                gl.uniformMatrix4fv(shaderProgram.pMatrixUniform, false, pMatrix.top);
                gl.uniformMatrix4fv(shaderProgram.mvMatrixUniform, false, mvMatrix.top);
                gl.drawElements(gl.TRIANGLES, vertexIndexBuffer.numItems, gl.UNSIGNED_SHORT, 0);
            }
        },
        setLighting = function (isLighting) {
		    lighting = isLighting;
        },
        setTexture = function (p_texture) {
            texture = p_texture;
        },
        setData = function (p_data) {
            data = p_data;
        },
        loadData = function () {
            //is json loaded
            if (data === null) {
                return;
            }
            if (data.mesh.tex !== null) {
                vertexTextureCoordBuffer = gl.createBuffer();
                gl.bindBuffer(gl.ARRAY_BUFFER, vertexTextureCoordBuffer);
                gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(data.mesh.tex), gl.STATIC_DRAW);
                vertexTextureCoordBuffer.itemSize = 2;
                vertexTextureCoordBuffer.numItems = data.mesh.tex.length / 2;
            }
            if (data.mesh.mat !== null) {
                colorBuffer = gl.createBuffer();
                gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);
                gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(data.mesh.mat), gl.STATIC_DRAW);
                colorBuffer.itemSize = 4;
                colorBuffer.numItems = data.mesh.mat.length / 2;
            }
            if (data.mesh.norm !== null) {
                // Normale fuer Beleuchtung
                normalBuffer = gl.createBuffer();
                gl.bindBuffer(gl.ARRAY_BUFFER, normalBuffer);
                gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(data.mesh.norm), gl.STATIC_DRAW);
                normalBuffer.itemSize = 3;
                normalBuffer.numItems = data.mesh.norm.length / 3;
            }
    
            vertexPositionBuffer = gl.createBuffer();
            gl.bindBuffer(gl.ARRAY_BUFFER, vertexPositionBuffer);
            gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(data.mesh.vert), gl.STATIC_DRAW);
            vertexPositionBuffer.itemSize = 3;
            vertexPositionBuffer.numItems = data.mesh.vert.length / 3;
    
            vertexIndexBuffer = gl.createBuffer();
            gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, vertexIndexBuffer);
            gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(data.mesh.ind), gl.STATIC_DRAW);
            vertexIndexBuffer.itemSize = 1;
            vertexIndexBuffer.numItems =  data.mesh.ind.length;
    
            loaded = true;
        };


    return {
        init: init,
        draw: draw,
        setData: setData,
        loadData: loadData
    };
    
};

