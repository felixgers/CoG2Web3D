


function Model(filename){

  this.vertices;
  this.colors;
  this.vertexPositionBuffer;
  this.vertexNormalBuffer;
  this.vertexTextureCoordBuffer;
  this.vertexIndexBuffer;
  this.texture;
  
  
    
  
   $.ajaxSetup({'beforeSend': function(xhr){
		if (xhr.overrideMimeType)
			xhr.overrideMimeType("text/json");
		}
	}); 		
  
   Model.prototype.setTexture=function(texture){
   		this.texture=texture;
   }
   
   
    Model.prototype.draw = function(gl,pMatrix, mvMatrix){
	    
			//is json loaded
			if(this.data==null)return;
			var data=this.data; 	  
			
			
			this.vertexTextureCoordBuffer = gl.createBuffer();
			gl.bindBuffer(gl.ARRAY_BUFFER, this.vertexTextureCoordBuffer);
			gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(data.cube.t), gl.STATIC_DRAW);
			this.vertexTextureCoordBuffer.itemSize = 2;
			this.vertexTextureCoordBuffer.numItems = data.cube.t.length / 2;
			
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
		
			gl.bindBuffer(gl.ARRAY_BUFFER, this.vertexPositionBuffer);
			gl.vertexAttribPointer(shaderProgram.vertexPositionAttribute, this.vertexPositionBuffer.itemSize, gl.FLOAT, false, 0, 0);
			
			gl.bindBuffer(gl.ARRAY_BUFFER, this.vertexTextureCoordBuffer);
			gl.vertexAttribPointer(shaderProgram.textureCoordAttribute, this.vertexTextureCoordBuffer.itemSize, gl.FLOAT, false, 0, 0);
		  
			gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.vertexIndexBuffer);
			gl.uniformMatrix4fv(shaderProgram.pMatrixUniform, false, pMatrix);
            gl.uniformMatrix4fv(shaderProgram.mvMatrixUniform, false, mvMatrix);
			//mat4.identity(mvMatrix);
			gl.drawElements(gl.TRIANGLES,this.vertexIndexBuffer.numItems, gl.UNSIGNED_SHORT, 0);			
		}
   
   
	Model.prototype.load=function(filename,model){
	     var that=model;
		$.getJSON(filename, function(data) {
		$('.result').html(data);
		that.data=data;
	
	 });
	}
	
	
	
	this.load(filename,this);
	
} 
