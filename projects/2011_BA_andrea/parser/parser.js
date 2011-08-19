var ColladaParser=function(){

	this.vertices;
	this.textures;
	this.indicies;
	this.normals;
	//for finale values of material
	this.material=new Array();
	//all values of material
	this.knownMaterial=new Array();	
	
	this.parser = new DOMImplementation();
	this.objDom;
	
	this.selectSemanticNode=function(geometryNode,value){
		node = geometryNode.item(0).selectNodeSet("//polylist/input[@semantic=" + value + "]");
		if(node.item(0)==null){
			node=geometryNode.item(0).selectNodeSet("//triangles/input[@semantic=" + value + "]");
		}
		return node;
	}
	
	this.createMaterial=function(geometryNode){
		var materialName;
		var materialCount;
		var node = geometryNode.item(0).selectNodeSet("//polylist[@material]");
		if(node.item(0)==null){
			node=geometryNode.item(0).selectNodeSet("//triangles[@material]");
		}
		if(node.item(0)!=null){
		
			materialName=node.item(0).getAttributes().getNamedItem("material").getNodeValue();
			materialCount=node.item(0).getAttributes().getNamedItem("count").getNodeValue();
			
			//search in materialarray for MaterialName
			if(materialName!=null){
				var m;
				var materialArray;
				for(var i=0;i<this.knownMaterial.length;i++){
					m=this.knownMaterial[i];
					if(materialName.indexOf(m.name)!=-1){
						materialArray=m.value;
					}
				}
				if(materialArray!=null){
					for(var i=0;i<=materialCount;i++){
						this.material=this.material.concat(materialArray);
					}
				}
			}
		}
		return null;
	}
	
	this.getOffset=function(node){
		return node.item(0).getAttributes().getNamedItem("offset").getNodeValue();
	}
	
	this.getSourceId=function(node){
	    var normalId=node.item(0).getAttributes().getNamedItem("source").getNodeValue();
		return this.substringSign(normalId,'#');
	}
	
	this.getRealVertexId=function(geometryNode,vertexId){
		//getting node vertices
		node=geometryNode.item(0).selectNodeSet("//vertices[@id=" + vertexId + "]");
		node=node.item(0).getFirstChild();
		//read id of position-array
		vertexId=node.getAttributes().getNamedItem("source").getNodeValue();
		//remove '#'
		return this.substringSign(vertexId,'#');
	}
	this.getId=function(node,attributeName){
		var id=node.item(0).getAttributes().getNamedItem(attributeName).getNodeValue();
		return this.substringSign(id,'#');
	}
	
	this.getValueOfSource=function(node,source){
		source=this.substringSign(source,"#");
		tempNode=node.selectNodeSet("//float_array[@id=" + source + "]");
		var value=tempNode.item(0).getFirstChild().getNodeValue();
		//replace whitespaces with 
		value=value.split(' ');
		return value;
	}
	
	this.parseGeometryData=function(docRoot,instanceGeometryNode,materials){
		var meshId=this.getId(instanceGeometryNode,"url");
		//search in library_geometry
		
		
		var geometryNode=docRoot.selectNodeSet("//library_geometries/geometry[@id=" + meshId +"]/mesh");
		if(geometryNode.item(0)!=null){
			
			var allOffsets=new Array();
			
			//read Material
			if(this.knownMaterial!=null){
				this.createMaterial(geometryNode);
			}
			//step 1 read VERTEX ******************************************************************************
			var node=this.selectSemanticNode(geometryNode,"VERTEX");
			var vertexOffset=this.getOffset(node);
			allOffsets.push(vertexOffset);		
			var vertexId=this.getRealVertexId(geometryNode,this.getSourceId(node));		
			
			//step 2 read NORMALS *******************************************************************************
			node=this.selectSemanticNode(geometryNode,"NORMAL");
			var normalOffset=this.getOffset(node);
			allOffsets.push(normalOffset);
			var normalId=this.getSourceId(node);
		
			//step 2 read TEXCOORD *******************************************************************************
			node=this.selectSemanticNode(geometryNode,"TEXCOORD");
			if(node.item(0)!=null){
				var textureOffset=this.getOffset(node);
				allOffsets.push(textureOffset);
				var textureId=this.getSourceId(node);
			}	
		
			//step 3 read sources *******************************************************************************
			
			var sources=geometryNode.item(0).selectNodeSet("//source");
			for(i=0;i<sources.length;i++){
				node=sources.item(i);	
				var sourceId=this.readAccessor(node);
				var nodeId=node.getAttributes().getNamedItem("id").getNodeValue();
				
				if(nodeId==vertexId){
					//node with vertices found
					vertices=this.getValueOfSource(node,sourceId);
				}else if (nodeId==normalId){
					//read normals
					normals=this.getValueOfSource(node,sourceId);
				}else if (nodeId==textureId){
					//read textures
					textures=this.getValueOfSource(node,sourceId);				
				}else{
					alert("unknown source found");
				}			
			}
			
			//step 4 read indicies *****************************************************************************
			var vertexIndicies;
			var normalsIndicies;
			
			//read polylist node p
			node= geometryNode.item(0).selectNodeSet("//polylist/p");
			if(node.item(0)==null){
				node= geometryNode.item(0).selectNodeSet("//triangles/p");
			}
			var indicies=node.item(0).getFirstChild().getNodeValue();
		
			//replace whitespaces with 
			indicies=indicies.split(' ');
			allOffsets.sort(this.numSort);
			
			//iterate thr. indicies
			var offset=allOffsets[0];
			var vertexSortedArray=new Array();
			var normalsSortedArray=new Array();
			var textureSortedArray=new Array();
			var indiciesForWeb=new Array();
			//nimmt den aktuellen Wert des IndiciesArrays auf
			var indicieValue=0;
			do{
				indicieValue=indicies[0];
				if(offset==vertexOffset){
					//get vertexentry for this indicies				
					//vertexSortedArray.push(vertices[indicieValue]);
					indiciesForWeb.push(indicieValue);
				}else if (offset==normalOffset){
					normalsSortedArray.push(normals[indicieValue]);
				}else if (offset==textureOffset){
					textureSortedArray.push(textures[indicieValue]);
				}else{
					alert("unknown offset");
				}
				
				//set next offset
				if(offset==allOffsets.length-1){
					offset=allOffsets[0];
				}else{
					offset++;
				}
				
				//remove first indicies-part
				indicies.shift();
			}while(indicies.length>0);
			
			//for(var i=0;i<=vertexSortedArray.length;i++){
				//indiciesForWeb.push(i);
			//}
			
			this.vertices=vertices;
			this.textures=textureSortedArray;
			this.indicies=indiciesForWeb;
			this.normals=normalsSortedArray;
		}
	}
	
	this.readAccessor=function(node){
		//read accessor
		node=node.selectNodeSet("//technique_common/accessor");
		return node.item(0).getAttributes().getNamedItem("source").getNodeValue();
	}
	
	this.parseCollada=function(data){
	    
		//create xmldocument 
		var domDoc = this.parser.loadXML(data);		
		//getting rootnode
		var docRoot = domDoc.getDocumentElement();
		
		var scenechilds=this.parseSceneInformations(docRoot);
		var geometryNode;
		var materialNode;
		for(var i=0;i<scenechilds.getLength();i++){
		    //search for geometry informations
			geometryNode=scenechilds.item(i);
			geometryNode=geometryNode.selectNodeSet("//instance_geometry");			
			if(geometryNode.item(0)!=null){				
				//has node material
				materialNode=geometryNode.item(0).selectNodeSet("//bind_material/technique_common/instance_material");
				if(materialNode.item(0)!=null){
					this.parseMaterialData(docRoot,materialNode);
				}
				
				//instance_geometry
				this.parseGeometryData(docRoot,geometryNode);
			}
		}
		
		//TODO abfangen, wenn animation null ist!!
		//this.parseAnimations(docRoot);
		
		return this.createJSON();
	}
	
	this.parseAnimations = function(docRoot){
		var animationsNode = docRoot.selectNodeSet("//library_animations");
		var animationChilds = animationsNode.item(0).getChildNodes();
		var animationSingleNode;
		
		for(var i=0;i<animationChilds.getLength();i++){
		    //search for geometry informations
			animationSingleNode=animationChilds.item(i);
			this.parseSingleAnimationNode(animationSingleNode);
		}
	}
	
	this.parseSingleAnimationNode=function(animationSingleNode){
	
		var channelNode=animationSingleNode.selectNodeSet("//channel").item(0);
		if(channelNode!=null){
			var target = channelNode.getAttributes().getNamedItem("target").getNodeValue();	
			var posi=target.indexOf("/");	
			if(posi!=-1){
				target=target.slice(posi + 1);
			}
			var samplerId = channelNode.getAttributes().getNamedItem("source").getNodeValue();
			samplerId = this.substringSign(samplerId,'#');
			var samplerNode = animationSingleNode.selectNodeSet("//sampler[@id=" + samplerId + "]").item(0);
			if(samplerNode!=null){
				key=this.parseAnimationSource(samplerNode,animationSingleNode,"INPUT");
				value=this.parseAnimationSource(samplerNode,animationSingleNode,"OUTPUT");
			}
		}
		
		switch(target){
			case ("location.X") : {
				scene.animation.locationX.value = value;
				scene.animation.locationX.key =key;
			};break;
			case ("location.Y") : {
				scene.animation.locationY.value = value;
				scene.animation.locationY.key =key;
			};break;
			case ("location.Z") : {
				scene.animation.locationZ.value = value;
				scene.animation.locationZ.key =key;
			};break;
			
			case ("rotationX.ANGLE") : {
				scene.animation.rotationXAngle.value = value;
				scene.animation.rotationXAngle.key =key;
			};break;
			case ("rotationY.ANGLE") : {
				scene.animation.rotationYAngle.value = value;
				scene.animation.rotationYAngle.key =key;
			};break;
			case ("rotationZ.ANGLE") : {
				scene.animation.rotationZAngle.value = value;
				scene.animation.rotationZAngle.key =key;
			};break;
			
			case ("scale.X") : {
				scene.animation.scaleX.value = value;
				scene.animation.scaleX.key =key;
			};break;
			case ("scale.Y") : {
				scene.animation.scaleY.value = value;
				scene.animation.scaleY.key =key;
			};break;
			case ("scale.Z") : {
				scene.animation.scaleZ.value = value;
				scene.animation.scaleZ.key =key;
			};break;
		}	
		
		
	}
	
	this.parseAnimationSource=function(samplerNode,animationSingleNode,semanticName){
		var inputNode = samplerNode.selectNodeSet("//input[@semantic=" + semanticName + "]"); 
		var inputSourceName = inputNode.item(0).getAttributes().getNamedItem("source").getNodeValue();
		inputSourceName = this.substringSign(inputSourceName,'#');
				
		var sourceNode=animationSingleNode.selectNodeSet("//source[@id=" + inputSourceName + "]").item(0);
				
		var sourceId=this.readAccessor(sourceNode);
		return this.getValueOfSource(sourceNode,sourceId);
	}
	
	
	this.parseMaterialData=function(docRoot,instanceMaterialNode){
	
		var materials={name:"",value:""};
		var materialId=this.getId(instanceMaterialNode,"target");
		var materialName=this.getId(instanceMaterialNode,"symbol");
		var materialEffectsId;
		var materialNode=docRoot.selectNodeSet("//library_materials/material[@id=" + materialId +"]/instance_effect");
		if(materialNode.item(0)!=null){
			materialEffectsId=this.getId(materialNode,"url");
			materialNode=docRoot.selectNodeSet("//library_effects/effect[@id=" + materialEffectsId + "]");
			if(materialNode.item(0)!=null){
				materialNode=materialNode.item(0).selectNodeSet("//profile_COMMON/technique[@sid=common]/phong/diffuse/color");
				if(materialNode.item(0)!=null){
					materials.name=materialName;
					materials.value=materialNode.item(0).getFirstChild().getNodeValue().split(' ');
					this.knownMaterial.push(materials);
				}
			}
		}
			
	}
	
	this.parseSceneInformations=function(docRoot){
		//es wird nur eine scene unterstuetzt
		var sceneNode = docRoot.selectNodeSet("//scene/instance_visual_scene");
		var sceneId = sceneNode.item(0).getAttributes().getNamedItem("url").getNodeValue();
		sceneId=this.substringSign(sceneId,'#');
		sceneNode = docRoot.selectNodeSet("//library_visual_scenes/visual_scene[@id=" + sceneId + "]");
		sceneChilds=sceneNode.item(0).getChildNodes();
		return sceneChilds;
	}
	
	var scene={
			"animation":{
				"locationX":{
					"key":null,
					"value":null
				},
				"locationY":{
					"key":null,
					"value":null
				},
				"locationZ":{
					"key":null,
					"value":null
				},
				"rotationXAngle":{
					"key":null,
					"value":null
				},
				"rotationYAngle":{
					"key":null,
					"value":null
				},
				"rotationZAngle":{
					"key":null,
					"value":null
				},
				"scaleX":{
					"key":null,
					"value":null
				},
				"scaleY":{
					"key":null,
					"value":null
				},
				"scaleZ":{
					"key":null,
					"value":null
				}
			},
			"mesh":{
				"vert":null,
				"ind":null,
				"tex":null,
				"mat":null,
				"norm":null
			}
		};
	
	this.createJSON=function(){		
			
		if(this.vertices.length>0){
			scene.mesh.vert=this.vertices;
		}
		if(this.textures.length>0){
			//JSObject.cube.t=this.textures;
		}
		if(this.indicies.length>0){
			scene.mesh.ind=this.indicies;
		}
		if(this.normals.length>0){
			scene.mesh.norm=this.normals;
		}
		if(this.material.length>0){
			scene.mesh.mat=this.material;
		}
		
		// Das Objekt zu JSON kodieren
		var jsonCode = JSON.stringify(scene);
		return jsonCode;
	}
	
	this.numSort = function(a,b){
	   return a - b;
	}
	
	this.substringSign = function(str,sign){
		posi=str.indexOf(sign);
		if(posi!= -1){
			return str.substring(posi + 1 ,str.length);
		}
		return str;
	}

	
}
    