function parse(data,target){
	var parser=new ColladaParser();
	json=parser.parseCollada(data);
	target.innerHTML=json;
	alert(JSON.parse(json).cube.v);
}




var ColladaParser=function(){
	this.parser = new DOMImplementation();
	
	this.parseCollada=function(data){
		//create xmldocument 
		var domDoc = this.parser.loadXML(data.value);
		//getting rootnode
		var docRoot = domDoc.getDocumentElement();
		var geometryNode=docRoot.selectNodeSet("//library_geometries/geometry/mesh");
		var allOffsets=new Array();
		//step 1 read VERTEX ******************************************************************************
		
		
		
		var node = geometryNode.item(0).selectNodeSet("//polylist/input[@semantic=VERTEX]");
		if(node.item(0)==null){
			node=geometryNode.item(0).selectNodeSet("//triangles/input[@semantic=VERTEX]");
		}
		//read vertexOffset
		var vertexOffset=node.item(0).getAttributes().getNamedItem("offset").getNodeValue();
		allOffsets.push(vertexOffset);
		//read vertices nodename 
		var vertexId=node.item(0).getAttributes().getNamedItem("source").getNodeValue();
		//remove '#'
		vertexId=this.substringSign(vertexId,'#');
		//getting node vertices
		node=geometryNode.item(0).selectNodeSet("//vertices[@id=" + vertexId+ "]");
		node=node.item(0).getFirstChild();
		//read id of position-array
		vertexId=node.getAttributes().getNamedItem("source").getNodeValue();
		//remove '#'
		vertexId=this.substringSign(vertexId,'#');
		
		//step 2 read NORMALS *******************************************************************************
		
		//read normalid
		node = geometryNode.item(0).selectNodeSet("//polylist/input[@semantic=NORMAL]");
		if(node.item(0)==null){
			node=geometryNode.item(0).selectNodeSet("//triangles/input[@semantic=NORMAL]");
		}
		//read normalOffset
		alert(node.item(0).getAttributes());
		var normalOffset=node.item(0).getAttributes().getNamedItem("offset").getNodeValue();
		allOffsets.push(normalOffset);
		var normalId=node.item(0).getAttributes().getNamedItem("source").getNodeValue();
		//remove '#'
		normalId=this.substringSign(normalId,'#');
		
		
		//step 3 read sources *******************************************************************************
		
		var sources=geometryNode.item(0).selectNodeSet("//source");
		for(i=0;i<sources.length;i++){
          node=sources.item(i);
		  
		  nodeId=node.getAttributes().getNamedItem("id").getNodeValue();	
		  //read accessor
			tempNode=node.selectNodeSet("//technique_common/accessor");
			source=tempNode.item(0).getAttributes().getNamedItem("source").getNodeValue();
		  
		  if(nodeId==vertexId){
			  //node with vertices found
			  sourceVerticeName=nodeId;
			  source=this.substringSign(source,"#");
			  tempNode=node.selectNodeSet("//float_array[@id=" + source + "]");
			  vertices=tempNode.item(0).getFirstChild().getNodeValue();
			  
			  //replace whitespaces with 
			  vertices=vertices.split(' ');
			}else if (nodeId==normalId){
			    sourceNormalsName=nodeId;
				//read normals
				//TODO auslagern
				source=this.substringSign(source,"#");
				tempNode=node.selectNodeSet("//float_array[@id=" + source + "]");
				normals=tempNode.item(0).getFirstChild().getNodeValue();
				//replace whitespaces with 
				normals=normals.split(' ');
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
		var indiciesForWeb=new Array();
		
		do{
			
			if(offset==vertexOffset){
				//get vertexentry for this indicies				
				indiciesForWeb.push(indicies[0]);
			}else if (offset==normalOffset){
				//normalsSortedArray.push(normals[indicies[i]]);
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
		
		for(var i=0;i<vertexSortedArray.length;i++){
			indiciesForWeb.push(i);
		}
		alert(indiciesForWeb);
		var JSObject={
			"cube":{
				"v":vertices,
				"t":normals,
				"i":indiciesForWeb,
			}
		};
		
		// Das Objekt zu JSON kodieren
		var jsonCode = JSON.stringify(JSObject);
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
	}

	this.parseGeometry = function(geometryXML){
		alert(geometryXML);
	}
}
    