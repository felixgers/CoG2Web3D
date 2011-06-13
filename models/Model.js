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


	$.ajaxSetup({'beforeSend': function(xhr){
		if (xhr.overrideMimeType)
			xhr.overrideMimeType("text/json");
	}
	}); 		

	Model.prototype.setTexture=function(texture){
		this.texture=texture;
	};

	Model.prototype.init=function(gl, pMatrix, mvMatrix, shaderProgram){
		this.gl=gl;
		this.shaderProgram=shaderProgram;
		this.pMatrix=pMatrix;
		this.mvMatrix=mvMatrix;
	};

	Model.prototype.loadData=function(){
		//is json loaded
		if(this.data==null)return;
		var data=this.data; 
		var gl=this.gl;
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
	};

	Model.prototype.draw = function(){			
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
				gl.uniformMatrix4fv(shaderProgram.pMatrixUniform, false, pMatrix);
				gl.uniformMatrix4fv(shaderProgram.mvMatrixUniform, false, mvMatrix);
				gl.drawElements(gl.TRIANGLES,vertexIndexBuffer.numItems, gl.UNSIGNED_SHORT, 0);
			}	
		}	

	};


	Model.prototype.load=function(url,model) {
		var that=model;

		try { var request = new XMLHttpRequest(); }
		catch(e) { 
			alert("Could not create XMLHttpRequest"); 
			return null;
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
			return null;
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
//Model.prototype=new Shape(); 
