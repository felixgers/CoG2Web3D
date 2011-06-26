function Model(filename,gl,shader){
  this.vertices;
  this.colors;
  this.vertexPositionBuffer;
  this.vertexNormalBuffer;
  this.vertexTextureCoordBuffer=null;
  this.vertexIndexBuffer;
  this.texture;
  this.colorBuffer;
  this.gl=gl;
  this.loaded=false; 
  this.hasAnimations=false;  
  
  this.animation;
  
   $.ajaxSetup({'beforeSend': function(xhr){
		if (xhr.overrideMimeType)
			xhr.overrideMimeType("text/json");
		}
	}); 		
  
   Model.prototype.setTexture=function(texture){
   		this.texture=texture;
   }
   
   Model.prototype.init=function(gl, pMatrix, mvMatrix, shaderProgram){
		this.gl=gl;
		this.shaderProgram=shaderProgram;
		this.pMatrix=pMatrix;
		this.mvMatrix=mvMatrix;
   }

   Model.prototype.loadData=function(){
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
					
   }
   
   Model.prototype.loadNewModel=function(){
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

			if(data.animation!=null){
				this.animation=new Animation(this.gl,this.shade);
				this.animation.load(data);
				this.hasAnimations=true;
			}
			
			this.loaded=true;
					
   }
   
    Model.prototype.draw = function(time){			
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
				  
					gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.vertexIndexBuffer);
					
					
					
					gl.uniformMatrix4fv(shaderProgram.pMatrixUniform, false, pMatrix.top);
			        gl.uniformMatrix4fv(shaderProgram.mvMatrixUniform, false, mvMatrix.top);
					
					gl.drawElements(gl.TRIANGLES,vertexIndexBuffer.numItems, gl.UNSIGNED_SHORT, 0);
				}	
			}	

		}
   
   
   
   
	Model.prototype.load=function(url,model) {
		 var that=model;
		
		 try { var request = new XMLHttpRequest(); }
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
			that.data=JSON.parse(request.responseText);
			that.loadData();
		 } else { // Failed
			 alert("Could not load model file: "+url); 
		 }
	};
   
	/*
	Model.prototype.load=function(filename,model){
	     var that=model;
		$.getJSON(filename, function(data) {
		//alert($('.result').html(data));
		//$('.result').html(data);
		that.data=data;
		that.loadData();
	 })
	 .success(function() { alert("second success"); })
	 .error(function() { alert("error"); })
	 .complete(function() { alert("complete"); });;
	}
	*/
	
	this.load(filename,this);
	
}

Animation = function(){
    this.gl;
	this.shaderProgram;
	this.pMatrix;
	this.mvMatrix;
	this.matrices;
	this.shaderProgram;
	this.currentFrame=0;
	this.position=[0,0,0];
	this.keyFrames=[0,1,2,3,4,5,6,7,8];
	
    this.locationX={
		"key":null,
		"value":null
		}
	this.locationY={
		"key":null,
		"value":null
		}
	this.locationZ={
		"key":null,
		"value":null
		}
	
	Animation.prototype.setMatrices=function(matrices){
		this.matrices=matrices;
	}
	
	
	Animation.prototype.load=function(data){
		this.locationX.key=data.animation.locationX.key;
		this.locationX.value=data.animation.locationX.value;
		
		this.locationY.key=data.animation.locationY.value;
		this.locationY.value=data.animation.locationY.value;
		
		this.locationZ.key=data.animation.locationZ.value;
		this.locationZ.value=data.animation.locationZ.value;
	}
	
	Animation.prototype.init=function(gl, pMatrix, mvMatrix, shaderProgram){
		this.gl=gl;
		this.shaderProgram=shaderProgram;
		this.pMatrix=pMatrix;
		this.mvMatrix=mvMatrix;
   }
	
	this.draw=function(time){
		if(this.currentFrame<this.keyFrames.length){
			this.currentFrame=this.keyFrames[this.currentFrame]  + 1;
		}else{
			this.currentFrame=0;
		}
		this.position[1]=this.locationY.value[this.currentFrame];
		
		//this.matrices.mvPushMatrix();
		var tempPMatrix = new glMatrixArrayType(16);
		var tempMvMatrix = new glMatrixArrayType(16);

		// Store values in temp matrices.
		//mat4.set(this.pMatrix, tempPMatrix);
		//mat4.set(this.mvMatrix, tempMvMatrix);
		
		mat4.translate(this.mvMatrix,this.position);
		
		//mat4.set(tempPMatrix,this.pMatrix);
		//mat4.set(tempMvMatrix,this.mvMatrix);
		//this.matrices.mvPopMatrix();
		//this.setMatrixUniforms();
		
		
	}
	
	this.setMatrixUniforms = function() {
		var pMatrix = this.matrices.pMatrix;
		var mvMatrix = this.matrices.mvMatrix;
		
		this.gl.uniformMatrix4fv(this.shaderProgram.pMatrixUniform, false, pMatrix);
		this.gl.uniformMatrix4fv(this.shaderProgram.mvMatrixUniform, false, mvMatrix);
	}
} 
