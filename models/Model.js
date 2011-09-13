BGE.namespace("Model");
BGE.Model = function(gl,shader){
  this.vertices;
  this.colors;
  this.vertexPositionBuffer;
  this.vertexNormalBuffer;
  this.vertexTextureCoordBuffer=null;
  this.vertexIndexBuffer;
  this.normalBuffer=null;
  this.texture;
  this.colorBuffer=null;
  this.gl=gl;
  this.loaded=false;
  this.hasAnimations=false;
  this.lighting=true;
  this.animation;

   $.ajaxSetup({'beforeSend': function(xhr){
		if (xhr.overrideMimeType)
			xhr.overrideMimeType("text/json");
		}
	});



     this.init=function(gl, pMatrix, mvMatrix, shaderProgram){
        this.gl=gl;
        this.shaderProgram=shaderProgram;
        this.pMatrix=pMatrix;
        this.mvMatrix=mvMatrix;
     }
};

BGE.Model.prototype.draw = function(time){
  with(this){
        if(loaded){
            gl.bindBuffer(gl.ARRAY_BUFFER, vertexPositionBuffer);
            gl.vertexAttribPointer(shaderProgram.vertexPositionAttribute, vertexPositionBuffer.itemSize, gl.FLOAT, false, 0, 0);

            if(vertexTextureCoordBuffer != null){
                //todo texture
            }else if(colorBuffer != null){
                gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);
                gl.vertexAttribPointer(shaderProgram.vertexColorAttribute, colorBuffer.itemSize, gl.FLOAT, false, 0, 0);
            }
            if(this.lighting){

            /*	if(normalBuffer!=null){
                    //beleuchtung funktioniert noch nicht richtig
                    //beschreibung : https://developer.mozilla.org/de/WebGL/Beleuchtung_in_WebGL
                    gl.bindBuffer(gl.ARRAY_BUFFER, normalBuffer);
                    gl.vertexAttribPointer(shaderProgram.vertexNormalAttribute, normalBuffer.itemSize, gl.FLOAT, false, 0, 0);
                    //var normalMatrix = mat4.inverse(mvMatrix);

                    //normalMatrix = mat4.transpose(normalMatrix);
                    var nUniform = gl.getUniformLocation(shaderProgram, "uNormalMatrix");
                    gl.uniformMatrix4fv(nUniform, false, new Float32Array(flatten(normalBuffer)));
                }*/
            }
            gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.vertexIndexBuffer);



            gl.uniformMatrix4fv(shaderProgram.pMatrixUniform, false, pMatrix.top);
            gl.uniformMatrix4fv(shaderProgram.mvMatrixUniform, false, mvMatrix.top);

            gl.drawElements(gl.TRIANGLES,vertexIndexBuffer.numItems, gl.UNSIGNED_SHORT, 0);
        }
    }

};


BGE.Model.prototype.loadJsonFile = function(filename){
		this.load(filename,this);
   };

BGE.Model.prototype.loadJsonDirect = function(jsonData){
		this.data=JSON.parse(jsonData);
	    this.loadData();
};

BGE.Model.prototype.setLighting=function(isLighting){
		this.lighting=isLighting;
};

BGE.Model.prototype.setTexture=function(texture){
   		this.texture=texture;
};

BGE.Model.prototype.loadData=function(){
    //is json loaded
    if(this.data==null)return;
    var data=this.data;
    var gl=this.gl;
    if(data.mesh!=null){
        this.loadNewModel();
        return;
    }
    if(data.cube.t != null){
        this.vertexTextureCoordBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, this.vertexTextureCoordBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(data.cube.t), gl.STATIC_DRAW);
        this.vertexTextureCoordBuffer.itemSize = 2;
        this.vertexTextureCoordBuffer.numItems = data.cube.t.length / 2;
    }
    if(data.cube.m != null){
        this.colorBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, this.colorBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(data.cube.m), gl.STATIC_DRAW);
        this.colorBuffer.itemSize = 4;
        this.colorBuffer.numItems = data.cube.m.length / 2;
    }
    if(data.cube.n != null){
        // Normale fuer Beleuchtung
        this.normalBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, this.normalBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(data.cube.n), gl.STATIC_DRAW);
        this.normalBuffer.itemSize = 3;
        this.normalBuffer.numItems = data.cube.n.length / 3;
    }

    this.vertexPositionBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, this.vertexPositionBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(data.cube.v), gl.STATIC_DRAW);
    this.vertexPositionBuffer.itemSize = 3;
    this.vertexPositionBuffer.numItems = data.cube.v.length / 3;

    this.vertexIndexBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.vertexIndexBuffer);
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(data.cube.i), gl.STATIC_DRAW);
    this.vertexIndexBuffer.itemSize = 1;
    this.vertexIndexBuffer.numItems = data.cube.i.length;

    this.loaded=true;
};

BGE.Model.prototype.loadNewModel=function(){
    //is json loaded
    if(this.data==null)return;
    var data=this.data;
    var gl=this.gl;

    if(data.mesh.tex != null){
        this.vertexTextureCoordBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, this.vertexTextureCoordBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(data.mesh.tex), gl.STATIC_DRAW);
        this.vertexTextureCoordBuffer.itemSize = 2;
        this.vertexTextureCoordBuffer.numItems = data.mesh.tex.length / 2;
    }
    if(data.mesh.mat != null){
        this.colorBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, this.colorBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(data.mesh.mat), gl.STATIC_DRAW);
        this.colorBuffer.itemSize = 4;
        this.colorBuffer.numItems = data.mesh.mat.length / 2;
    }
    if(data.mesh.norm != null){
        // Normale fuer Beleuchtung
        this.normalBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, this.normalBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(data.mesh.norm), gl.STATIC_DRAW);
        this.normalBuffer.itemSize = 3;
        this.normalBuffer.numItems = data.mesh.norm.length / 3;
    }

    this.vertexPositionBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, this.vertexPositionBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(data.mesh.vert), gl.STATIC_DRAW);
    this.vertexPositionBuffer.itemSize = 3;
    this.vertexPositionBuffer.numItems = data.mesh.vert.length / 3;

    this.vertexIndexBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.vertexIndexBuffer);
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(data.mesh.ind), gl.STATIC_DRAW);
    this.vertexIndexBuffer.itemSize = 1;
    this.vertexIndexBuffer.numItems = data.mesh.ind.length;



    this.loaded=true;
};

BGE.Model.prototype.load=function(url,model) {

    var that = model;

    try {
        var request = new XMLHttpRequest();
    }
    catch(e) {
        alert("Could not create XMLHttpRequest");
        return;
    }
    // Check whether document is located in local file system.
    var localFileSys = document.URL.match(/^file:\/\/.*?$/);

    // Do not open asynchronously, thus wait for the response.
    request.open("GET", url, false);
    request.overrideMimeType("text/plain");
    request.send(null);
    // Check if we got HTTP status 200 (OK) or in local file system status 0
    if ((localFileSys && request.status == 0) || request.status == 200) {
        that.data = JSON.parse(request.responseText);
        that.loadData();
    } else { // Failed
        alert("Could not load model file: " + url);
    }
};


