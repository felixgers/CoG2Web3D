dojo.provide("BGE.ColladaParser");
BGE.ColladaParser = (function () {

    "use strict";

	var vertices,
	    textures,
	    indicies,
	    normals,
	    //for finale values of material
	    material,
	    //all values of material
	    knownMaterial,
        //Values of transition
        translateX,
        translateY,
        translateZ,

        scaleX,
        scaleY,
        scaleZ,


        debug = true,
        hasMaterial = false,
        //true if one face is not triangulated
        isNoTriangulated = false,

	    selectSemanticNode = function (geometryNode, value) {
            var myNode;
            myNode = geometryNode.item(0).selectNodeSet("//polylist/input[@semantic=" + value + "]");
            if (myNode.item(0) === null) {
                myNode = geometryNode.item(0).selectNodeSet("//triangles/input[@semantic=" + value + "]");
            }
            return myNode;
	    },
        checkTriangulation = function (node) {
            var myNode,
                vcount,
                i;


            myNode = node.item(0).selectNodeSet("//polylist/vcount");
            if (myNode.item(0) === null) {
                myNode = node.item(0).selectNodeSet("//triangles/vcount");
            }
            if (myNode.item(0)) {
                vcount = myNode.item(0).getFirstChild().getNodeValue();
                if (vcount !== null) {
                    vcount = vcount.split(" ");
                    for (i = 0; i < vcount.length; i++) {
                        //if one of faces is not triangulated, we check no more, one message is enough
                        if (!isNoTriangulated) {
                            if (vcount[i] !== '3') {
                                console.warn("There are faces with no triangulations. Please control your collada file and use the blender function quads to tris.");
                                isNoTriangulated = true;
                            }
                        }
                    }
                }
            } else {
                console.error("No vcount found in collada file");
            }
        },
	    createMaterial = function (geometryNode, indiciesLength) {
            var materialName,
                materialCount,
                tempKnownMaterial,
                materialArray,
                myNode,
                i;

            if (!hasMaterial) {
                tempKnownMaterial = knownMaterial[0];
                for (i = 0; i <= indiciesLength; i++) {
                    material = material.concat(tempKnownMaterial.value);
                }
                return;
            }

		    myNode = geometryNode.item(0).selectNodeSet("//polylist[@material]");
            if (myNode.item(0) === null) {
                myNode = geometryNode.item(0).selectNodeSet("//triangles[@material]");
            }

            if (myNode.item(0) !== null) {

                materialName = myNode.item(0).getAttributes().getNamedItem("material").getNodeValue();
                materialCount = myNode.item(0).getAttributes().getNamedItem("count").getNodeValue();

                //search in materialarray for MaterialName
                if (materialName !== null) {
                    for (i = 0; i < knownMaterial.length; i++) {
                        tempKnownMaterial = knownMaterial[i];
                        if (materialName.indexOf(tempKnownMaterial.name) !== -1) {
                            materialArray = tempKnownMaterial.value;
                        }
                    }

                    if (materialArray !== null) {
                        for (i = 0; i <= materialCount; i++) {
                            material = material.concat(materialArray);
                        }
                    }
                }
            }
            return null;
	    },
	
	    getOffset = function (node) {
            return node.item(0).getAttributes().getNamedItem("offset").getNodeValue().toString();
	    },
        substringSign = function (str, sign) {
            var posi = str.indexOf(sign);
            if (posi !== -1) {
                return str.substring(posi + 1, str.length);
            }
            return str;
        },
	
	    getSourceId = function (node) {
	        var normalId;
            normalId = node.item(0).getAttributes().getNamedItem("source").getNodeValue();
		    return substringSign(normalId, "#");
        },
	
	    getRealVertexId = function (geometryNode, vertexId) {
            var myNode;
		    //getting node vertices
		    myNode = geometryNode.item(0).selectNodeSet("//vertices[@id=" + vertexId + "]");
		    myNode = myNode.item(0).getFirstChild();
		    //read id of position-array
		    vertexId = myNode.getAttributes().getNamedItem("source").getNodeValue();
		    //remove '#'
		    return substringSign(vertexId, '#');
        },

        getId = function (node, attributeName) {
		    var id;
            id = node.item(0).getAttributes().getNamedItem(attributeName).getNodeValue();
		    return substringSign(id, '#');
	    },
	
	    getValueOfSource = function (node, source) {
            var myNode,
                value;

		    source = substringSign(source, "#");
		    myNode = node.selectNodeSet("//float_array[@id=" + source + "]");
		    value = myNode.item(0).getFirstChild().getNodeValue();
		    //replace whitespaces with
		    value = value.split(' ');
		    return value;
	    },

        initArrays = function () {
            vertices = [];
	        textures = [];
	        indicies = [];
	        normals = [];
            material = [];
            knownMaterial = [];
            translateX = [];
            translateY = [];
            translateZ = [];
            scaleX = [];
            scaleY = [];
            scaleZ = [];
        },

        numSort = function (a, b) {
            return a - b;
        },

        readAccessor = function (node) {
            //read accessor
            node = node.selectNodeSet("//technique_common/accessor");
            return node.item(0).getAttributes().getNamedItem("source").getNodeValue();
        },

        getValueOfIndicies = function (geometryNode) {
            var myNode,
                valueOfIndicies;

            myNode = geometryNode.item(0).selectNodeSet("//polylist/p");

            if (myNode.item(0) === null) {
                myNode = geometryNode.item(0).selectNodeSet("//triangles/p");
            }

            valueOfIndicies = myNode.item(0).getFirstChild().getNodeValue();
            //replace whitespaces with
            valueOfIndicies = valueOfIndicies.split(' ');
            return valueOfIndicies;
        },

	    parseGeometryData = function (docRoot, instanceGeometryNode, materials) {
		    var meshId,
                geometryNode,
                allOffsets = [],
                offset,
                vertexOffset,
                vertexId,
                textureOffset,
                normalOffset,
                normalId,
                textureId,
                sources,
                sourceId,
                nodeId,
                texturesTemp,
			    normalsTemp,
                valueOfIndicie,
                indicieValue = 0,
                myNode,
                offsetStr,
                i;

            meshId = getId(instanceGeometryNode, "url");
            console.debug("found meshid: " + meshId);

            //search in library_geometry
            geometryNode = docRoot.selectNodeSet("//library_geometries/geometry[@id=" + meshId + "]/mesh");
            if (geometryNode.item(0) !== null) {

                //step 1 read VERTEX ******************************************************************************
                myNode = selectSemanticNode(geometryNode, "VERTEX");
                vertexOffset = getOffset(myNode);
                allOffsets.push(vertexOffset);
                vertexId = getRealVertexId(geometryNode, getSourceId(myNode));

                checkTriangulation(geometryNode);

                //step 2 read NORMALS *******************************************************************************
                myNode = selectSemanticNode(geometryNode, "NORMAL");
                normalOffset = getOffset(myNode);
                allOffsets.push(normalOffset);
                normalId = getSourceId(myNode);

                //step 2 read TEXCOORD *******************************************************************************
                myNode = selectSemanticNode(geometryNode, "TEXCOORD");
                if (myNode.item(0) !== null) {
                    if (debug) { console.debug("Texture node found"); }
                    textureOffset = getOffset(myNode);
                    allOffsets.push(textureOffset);
                    textureId = getSourceId(myNode);
                } else {
                    console.warn("Texture node was not found.");
                }
                myNode = null;

                allOffsets.sort(numSort);

                //step 3 read sources *******************************************************************************

                sources = geometryNode.item(0).selectNodeSet("//source");
                for (i = 0; i < sources.length; i++) {
                    myNode = sources.item(i);
                    sourceId = readAccessor(myNode);
                    nodeId = myNode.getAttributes().getNamedItem("id").getNodeValue().toString();

                    switch (nodeId) {
                    case vertexId: vertices = getValueOfSource(myNode, sourceId); break;
                    case normalId: normalsTemp = getValueOfSource(myNode, sourceId); break;
                    case textureId: texturesTemp = getValueOfSource(myNode, sourceId); break;
                    default: console.error("unknown source found");
                    }
                }
			
                //step 4 read indicies *****************************************************************************
                //read polylist node p
                valueOfIndicie = getValueOfIndicies(geometryNode);
                //iterate thr. indicies
                offset = allOffsets[0];
                console.debug("found indicies: " + valueOfIndicie);
             
			    do {
                    indicieValue = valueOfIndicie[0];
                    offsetStr = offset.toString();

                    switch (offsetStr) {
                    case vertexOffset: indicies.push(indicieValue); break;
                    case normalOffset: normals.push(normalsTemp[indicieValue]); break;
                    case textureOffset: textures.push(texturesTemp[indicieValue]); break;
                    default: console.error("unknown offset");
                    }

				    //set next offset,
                    //iff offest at position end set offset to first again
                    if (offset === allOffsets.length - 1) {
                        offset = allOffsets[0];
                    } else {
                        offset++;
                    }

				    //remove first indicies-part
				    valueOfIndicie.shift();

			    } while (valueOfIndicie.length > 0);

                //read Material
                if (knownMaterial !== null) {
                    createMaterial(geometryNode, indicies.length);
                }
            }
	    },

        parseSceneInformations = function (docRoot) {
            //es wird nur eine scene unterstuetzt
            var sceneNode,
                sceneChilds,
                sceneId;

            sceneNode = docRoot.selectNodeSet("//scene/instance_visual_scene");
            sceneId = sceneNode.item(0).getAttributes().getNamedItem("url").getNodeValue();

            sceneId = substringSign(sceneId, '#');
            sceneNode = docRoot.selectNodeSet("//library_visual_scenes/visual_scene[@id=" + sceneId + "]");
            sceneChilds = sceneNode.item(0).getChildNodes();

            return sceneChilds;
        },

        parseTransitions = function (p_sceneChildNode) {
            var translationArray,
                scaleArray;

            translationArray = p_sceneChildNode.selectNodeSet("//translate").item(0).getFirstChild().getNodeValue().split(' ');
            if (translationArray !== null) {
                translateX = translationArray[0];
                translateY = translationArray[1];
                translateZ = translationArray[2];
            }

            scaleArray = p_sceneChildNode.selectNodeSet("//scale").item(0).getFirstChild().getNodeValue().split(' ');
            if (scaleArray !== null) {
                scaleX = scaleArray[0];
                scaleY = scaleArray[1];
                scaleZ = scaleArray[2];
            }

        },
        setDefaultMaterial = function () {
            var materials = {name: "", value: ""};
            material.name = "default";
            material.value = [1, 1, 1, 1];
            knownMaterial.push(material);
        },

        parseMaterialData = function (docRoot, instanceMaterialNode) {

            var materials = {name: "", value: ""},
                materialId = getId(instanceMaterialNode, "target"),
                materialName = getId(instanceMaterialNode, "symbol"),
                materialEffectsId,
                materialNode = docRoot.selectNodeSet("//library_materials/material[@id=" + materialId + "]/instance_effect");

            if (materialNode.item(0) !== null) {
                materialEffectsId = getId(materialNode, "url");
                materialNode = docRoot.selectNodeSet("//library_effects/effect[@id=" + materialEffectsId + "]");
                if (materialNode.item(0) !== null) {
                    materialNode = materialNode.item(0).selectNodeSet("//profile_COMMON/technique[@sid=common]/*/diffuse/color");
                    if (materialNode.item(0) !== null) {
                        materials.name = materialName;
                        materials.value = materialNode.item(0).getFirstChild().getNodeValue().split(' ');
                        console.debug("found materials: " + materials);
                        knownMaterial.push(materials);
                    }
                }
            }
        },

        createJSON = function (scene) {
            var mesh = {"mesh":
                {"vert": null,
                    "ind": null,
                    "tex": null,
                    "mat": null,
                    "norm": null,
                    "transitions": { "translate": {x: 0, y: 0, z: 0} ,
                                     "scale": {x: 0, y: 0, z: 0}}
                                    }
                };


            if (vertices.length > 0) {
                mesh.mesh.vert = vertices;
            }
            //if (textures.length > 0) {
                //JSObject.cube.t=this.textures;
            //}
            if (indicies.length > 0) {
                mesh.mesh.ind = indicies;
            }
            if (normals.length > 0) {
                mesh.mesh.norm = normals;
            }
            if (material.length > 0) {
                mesh.mesh.mat = material;
            }
            if (translateX.length > 0) {
                mesh.mesh.transitions.translate.x = translateX;
            }
            if (translateY.length > 0) {
                mesh.mesh.transitions.translate.y = translateY;
            }
            if (translateZ.length > 0) {
                mesh.mesh.transitions.translate.z = translateZ;
            }

            if (translateX.length > 0) {
                mesh.mesh.transitions.scale.x = scaleX;
            }
            if (translateY.length > 0) {
                mesh.mesh.transitions.scale.y = scaleY;
            }
            if (translateZ.length > 0) {
                mesh.mesh.transitions.scale.z = scaleZ;
            }

            scene.meshes.push(mesh);

        },

        parseCollada = function (data) {

		    //create xmldocument
		    var parser = new DOMImplementation(),
                domDoc = parser.loadXML(data),
		        //getting rootnode
		        docRoot = domDoc.getDocumentElement(),
		        scenechilds = parseSceneInformations(docRoot),
		        geometryNode,
                sceneChild,
		        materialNode,
                i,
	            scene = {"meshes": []};

            for (i = 0; i < scenechilds.getLength(); i++) {
                //search for geometry informations
                initArrays();

                sceneChild = scenechilds.item(i);
                geometryNode = sceneChild.selectNodeSet("//instance_geometry");
                if (geometryNode.item(0) !== null) {
                    parseTransitions(sceneChild);
                    //has node material
                    materialNode = geometryNode.item(0).selectNodeSet("//bind_material/technique_common/instance_material");
                    if (materialNode.item(0) !== null) {
                        parseMaterialData(docRoot, materialNode);
                        hasMaterial = true;
                    } else {
                        setDefaultMaterial();
                        hasMaterial = false;
                    }
                    //instance_geometry
                    parseGeometryData(docRoot, geometryNode);
                    createJSON(scene);
                }
            }

            // Das Objekt zu JSON kodieren
		    return JSON.stringify(scene);
	    };

    return {
        parseCollada: parseCollada
    };

	
}());
    