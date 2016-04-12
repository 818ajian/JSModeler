JSM.ReadObjFile = function (stringBuffer, callbacks)
{
	function OnNewMaterial (name)
	{
		if (callbacks.onNewMaterial !== undefined && callbacks.onNewMaterial !== null) {
			callbacks.onNewMaterial (name);
		}
	}

	function OnMaterialComponent (name, red, green, blue)
	{
		if (callbacks.onMaterialComponent !== undefined && callbacks.onMaterialComponent !== null) {
			callbacks.onMaterialComponent (name, red, green, blue);
		}
	}

	function OnMaterialParameter (name, value)
	{
		if (callbacks.onMaterialParameter !== undefined && callbacks.onMaterialParameter !== null) {
			callbacks.onMaterialParameter (name, value);
		}
	}

	function OnMaterialTexture (textureName)
	{
		if (callbacks.onMaterialTexture !== undefined && callbacks.onMaterialTexture !== null) {
			callbacks.onMaterialTexture (textureName);
		}
	}
	
	function OnUseMaterial (name)
	{
		if (callbacks.onUseMaterial !== undefined && callbacks.onUseMaterial !== null) {
			callbacks.onUseMaterial (name);
		}
	}

	function OnMesh (meshName)
	{
		if (callbacks.onMesh !== undefined && callbacks.onMesh !== null) {
			callbacks.onMesh (meshName);
		}
	}
	
	function OnVertex (x, y, z)
	{
		if (callbacks.onVertex !== undefined && callbacks.onVertex !== null) {
			callbacks.onVertex (x, y, z);
		}
	}

	function OnNormal (x, y, z)
	{
		if (callbacks.onNormal !== undefined && callbacks.onNormal !== null) {
			callbacks.onNormal (x, y, z);
		}
	}

	function OnTexCoord (x, y)
	{
		if (callbacks.onTexCoord !== undefined && callbacks.onTexCoord !== null) {
			callbacks.onTexCoord (x, y);
		}
	}

	function OnFace (vertices, normals, uvs)
	{
		if (callbacks.onFace !== undefined && callbacks.onFace !== null) {
			callbacks.onFace (vertices, normals, uvs);
		}
	}

	function OnFileRequested (fileName)
	{
		if (callbacks.onFileRequested !== undefined && callbacks.onFileRequested !== null) {
			return callbacks.onFileRequested (fileName);
		}
		return null;
	}

	function ProcessLine (line, objectCounter)
	{
		function GetIndex (index, count)
		{
			if (index > 0) {
				return index - 1;
			} else {
				return count + index;
			}
		}

		function GetFileName (line, keyword)
		{
			var fileNameIndex = line.indexOf (keyword) + keyword.length;
			var fileName = line.substr (fileNameIndex, line.length - fileNameIndex);
			return fileName.trim ();
		}
	
		if (line.length === 0) {
			return;
		}
		
		if (line[0] == '#') {
			return;
		}

		var lineParts = line.split (/\s+/);
		if (lineParts.length === 0 || lineParts[0][0] == '#') {
			return;
		}

		var i, fileName;
		if (lineParts[0] == 'g') {
			if (lineParts.length < 2) {
				return;
			}
			var meshName = '';
			for (i = 1; i < lineParts.length; i++) {
				meshName += lineParts[i];
				if (i < lineParts.length - 1) {
					meshName += ' ';
				}
			}
			OnMesh (meshName);
		} else if (lineParts[0] == 'v') {
			if (lineParts.length < 4) {
				return;
			}
			objectCounter.vertexCount += 1;
			OnVertex (parseFloat (lineParts[1]), parseFloat (lineParts[2]), parseFloat (lineParts[3]));
		} else if (lineParts[0] == 'vn') {
			if (lineParts.length < 4) {
				return;
			}
			objectCounter.normalCount += 1;
			OnNormal (parseFloat (lineParts[1]), parseFloat (lineParts[2]), parseFloat (lineParts[3]));
		} else if (lineParts[0] == 'vt') {
			if (lineParts.length < 3) {
				return;
			}
			objectCounter.uvCount += 1;
			OnTexCoord (parseFloat (lineParts[1]), parseFloat (lineParts[2]));
		} else if (lineParts[0] == 'f') {
			if (lineParts.length < 4) {
				return;
			}
			
			var vertices = [];
			var normals = [];
			var uvs = [];
			
			var partSplitted;
			for (i = 1; i < lineParts.length; i++) {
				partSplitted = lineParts[i].split ('/');
				vertices.push (GetIndex (parseInt (partSplitted[0], 10), objectCounter.vertexCount));
				if (partSplitted.length > 1 && partSplitted[1].length > 0) {
					uvs.push (GetIndex (parseInt (partSplitted[1], 10), objectCounter.uvCount));
				}
				if (partSplitted.length > 2 && partSplitted[2].length > 0) {
					normals.push (GetIndex (parseInt (partSplitted[2], 10), objectCounter.normalCount));
				}
			}
			OnFace (vertices, normals, uvs);
		} else if (lineParts[0] == 'usemtl') {
			if (lineParts.length < 2) {
				return;
			}
			
			OnUseMaterial (lineParts[1]);
		} else if (lineParts[0] == 'newmtl') {
			if (lineParts.length < 2) {
				return;
			}
			
			OnNewMaterial (lineParts[1]);
		} else if (lineParts[0] == 'Ka' || lineParts[0] == 'Kd' || lineParts[0] == 'Ks') {
			if (lineParts.length < 4) {
				return;
			}
			
			OnMaterialComponent (lineParts[0], parseFloat (lineParts[1]), parseFloat (lineParts[2]), parseFloat (lineParts[3]));
		} else if (lineParts[0] == 'Ns' || lineParts[0] == 'Tr' || lineParts[0] == 'd') {
			if (lineParts.length < 2) {
				return;
			}
			
			OnMaterialParameter (lineParts[0], lineParts[1]);
		} else if (lineParts[0] == 'map_Kd') {
			if (lineParts.length < 2) {
				return;
			}
			
			fileName = GetFileName (line, 'map_Kd');
			OnMaterialTexture (fileName);
		} else if (lineParts[0] == 'mtllib') {
			if (lineParts.length < 2) {
				return;
			}

			fileName = GetFileName (line, 'mtllib');
			var fileStringBuffer = OnFileRequested (fileName.trim ());
			if (fileStringBuffer === null) {
				return;
			}
			ProcessFile (fileStringBuffer);
		}
	}
	
	function ProcessFile (stringBuffer, objectCounter)
	{
		var lines = stringBuffer.split ('\n');
		var i, line;
		for (i = 0; i < lines.length; i++) {
			line = lines[i].trim ();
			ProcessLine (line, objectCounter);
		}
	}
	
	if (callbacks === undefined || callbacks === null) {
		callbacks = {};
	}

	var objectCounter = {
		vertexCount : 0,
		normalCount : 0,
		uvCount : 0
	};

	ProcessFile (stringBuffer, objectCounter);
};

JSM.ConvertObjToJsonData = function (stringBuffer, callbacks)
{
	function OnFileRequested (fileName)
	{
		if (callbacks.onFileRequested !== undefined && callbacks.onFileRequested !== null) {
			return callbacks.onFileRequested (fileName);
		}
		return null;
	}

	function FinalizeBodyVertices (triangleModel, globalVertices, globalNormals, globalUVs)
	{
		function GetLocalIndex (body, globalArray, globalIndex, globalToLocal, mode)
		{
			if (globalIndex === undefined) {
				return undefined;
			}
		
			var result = globalToLocal[globalIndex];
			if (result !== undefined) {
				return result;
			}
			if (globalIndex < 0 || globalIndex >= globalArray.length) {
				return undefined;
			}
			
			var coordinate = globalArray[globalIndex];
			if (mode === 0) {
				result = body.AddVertex (coordinate.x, coordinate.y, coordinate.z);
			} else if (mode === 1) {
				result = body.AddNormal (coordinate.x, coordinate.y, coordinate.z);
			} else if (mode === 2) {
				result = body.AddUV (coordinate.x, coordinate.y);
			}
			globalToLocal[globalIndex] = result;
			return result;
		}
	
		var i, j, body, triangle;
		var globalToLocalVertices, globalToLocalNormals, globalToLocalUVs;
		for (i = 0; i < triangleModel.BodyCount (); i++) {
			body = triangleModel.GetBody (i);
			globalToLocalVertices = {};
			globalToLocalNormals = {};
			globalToLocalUVs = {};
			for (j = 0; j < body.TriangleCount (); j++) {
				triangle = body.GetTriangle (j);
				triangle.v0 = GetLocalIndex (body, globalVertices, triangle.v0, globalToLocalVertices, 0);
				triangle.v1 = GetLocalIndex (body, globalVertices, triangle.v1, globalToLocalVertices, 0);
				triangle.v2 = GetLocalIndex (body, globalVertices, triangle.v2, globalToLocalVertices, 0);
				triangle.n0 = GetLocalIndex (body, globalNormals, triangle.n0, globalToLocalNormals, 1);
				triangle.n1 = GetLocalIndex (body, globalNormals, triangle.n1, globalToLocalNormals, 1);
				triangle.n2 = GetLocalIndex (body, globalNormals, triangle.n2, globalToLocalNormals, 1);
				triangle.u0 = GetLocalIndex (body, globalUVs, triangle.u0, globalToLocalUVs, 2);
				triangle.u1 = GetLocalIndex (body, globalUVs, triangle.u1, globalToLocalUVs, 2);
				triangle.u2 = GetLocalIndex (body, globalUVs, triangle.u2, globalToLocalUVs, 2);
			}
		}
	}
	
	if (callbacks === undefined || callbacks === null) {
		callbacks = {};
	}

	var triangleModel = new JSM.TriangleModel ();
	var index = triangleModel.AddBody (new JSM.TriangleBody ('Default'));
	var currentBody = triangleModel.GetBody (index);
	
	var materialNameToIndex = {};
	var currentMaterial = null;
	var currentMaterialIndex = null;
	
	var globalVertices = [];
	var globalNormals = [];
	var globalUVs = [];
	
	JSM.ReadObjFile (stringBuffer, {
		onNewMaterial : function (name) {
			var index = triangleModel.AddMaterial ({
				name : name
			});
			currentMaterial = triangleModel.GetMaterial (index);
			materialNameToIndex[name] = index;
		},
		onMaterialComponent : function (name, red, green, blue) {
			if (currentMaterial === null) {
				return;
			}
			if (name == 'Ka') {
				currentMaterial.ambient = [red, green, blue];
			} else if (name == 'Kd') {
				currentMaterial.diffuse = [red, green, blue];
			} else if (name == 'Ks') {
				currentMaterial.specular = [red, green, blue];
			}
		},
		onMaterialParameter : function (name, value) {
			if (currentMaterial === null) {
				return;
			}
			if (name == 'Ns') {
				currentMaterial.shininess = 0.0;
				if (JSM.IsPositive (value)) {
					currentMaterial.shininess = (Math.log2 (parseFloat (value)) - 1) / 10.0;
				}
			} else if (name == 'Tr' || name == 'd') {
				currentMaterial.opacity = parseFloat (value);
			}			
		},
		onMaterialTexture : function (textureName) {
			if (currentMaterial === null) {
				return;
			}

			var textureBuffer = OnFileRequested (textureName);
			if (textureBuffer === null) {
				return;
			}
			
			var blob = new window.Blob ([textureBuffer]);
			var blobURL = window.URL.createObjectURL (blob);
			currentMaterial.texture = blobURL;
		},
		onUseMaterial : function (name) {
			var materialIndex = materialNameToIndex[name];
			if (materialIndex !== undefined) {
				currentMaterialIndex = materialIndex;
			}
		},
		onMesh : function (meshName) {
			var index = triangleModel.AddBody (new JSM.TriangleBody (meshName));
			currentBody = triangleModel.GetBody (index);
		},
		onVertex : function (x, y, z) {
			globalVertices.push (new JSM.Coord (x, y, z));
		},
		onNormal : function (x, y, z) {
			globalNormals.push (new JSM.Coord (x, y, z));
		},
		onTexCoord : function (x, y) {
			globalUVs.push (new JSM.Coord2D (x, y));
		},
		onFace : function (vertices, normals, uvs) {
			var i, triangle, triangleIndex;
			var hasNormals = (normals.length == vertices.length);
			var hasUVs = (uvs.length == vertices.length);
			var count = vertices.length;
			for (i = 0; i < count - 2; i++) {
				triangleIndex = currentBody.AddTriangle (vertices[0], vertices[(i + 1) % count], vertices[(i + 2) % count]);
				triangle = currentBody.GetTriangle (triangleIndex);
				if (hasNormals) {
					triangle.n0 = normals[0];
					triangle.n1 = normals[(i + 1) % count];
					triangle.n2 = normals[(i + 2) % count];
				}
				if (hasUVs) {
					triangle.u0 = uvs[0];
					triangle.u1 = uvs[(i + 1) % count];
					triangle.u2 = uvs[(i + 2) % count];
				}
				if (currentMaterialIndex !== null) {
					triangle.mat = currentMaterialIndex;
				}
			}
		},
		onFileRequested : OnFileRequested
	});

	FinalizeBodyVertices (triangleModel, globalVertices, globalNormals, globalUVs);
	triangleModel.Finalize ();
	
	var jsonData = JSM.ConvertTriangleModelToJsonData (triangleModel);
	return jsonData;
};
