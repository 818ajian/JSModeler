/**
* Class: VertInfo
* Description:
*	Contains adjacency information for a body vertex. Contains arrays
*	with indices of connected edge and polygon info.
*/
JSM.VertInfo = function ()
{
	this.edges = [];
	this.pgons = [];
};

/**
* Class: EdgeInfo
* Description:
*	Contains adjacency information for a body edge. Contains indices
*	of connected vertex and polygon info.
*/
JSM.EdgeInfo = function ()
{
	this.vert1 = -1;
	this.vert2 = -1;
	this.pgon1 = -1;
	this.pgon2 = -1;
};

/**
* Class: PolyEdgeInfo
* Description:
*	Contains adjacency information for a body polygon edge. Contains an index
*	of an existing edge, and a flag which defines its direction.
*/
JSM.PolyEdgeInfo = function ()
{
	this.index = -1;
	this.reverse = false;
};

/**
* Class: PgonInfo
* Description:
*	Contains adjacency information for a body polygon. Contains arrays
*	with indices of connected vertex and poly edge info.
*/
JSM.PgonInfo = function ()
{
	this.verts = [];
	this.pedges = [];
};

/**
* Class: AdjacencyInfo
* Description:
*	Contains adjacency information for a body. Contains arrays
*	with vertex, edge and polygon info.
*/
JSM.AdjacencyInfo = function ()
{
	this.verts = [];
	this.edges = [];
	this.pgons = [];
};

/**
* Function: GetPolyEdgeStartVertex
* Description: Returns the start vertex index of a polygon edge.
* Parameters:
*	polyEdge {PolyEdgeInfo} the polygon edge info
*	adjacencyInfo {AdjacencyInfo} the adjacency info
* Returns:
*	{integer} the result
*/
JSM.GetPolyEdgeStartVertex = function (polyEdge, adjacencyInfo)
{
	if (!polyEdge.reverse) {
		return adjacencyInfo.edges[polyEdge.index].vert1;
	} else {
		return adjacencyInfo.edges[polyEdge.index].vert2;
	}
};

/**
* Function: GetPolyEdgeEndVertex
* Description: Returns the end vertex index of a polygon edge.
* Parameters:
*	polyEdge {PolyEdgeInfo} the polygon edge info
*	adjacencyInfo {AdjacencyInfo} the adjacency info
* Returns:
*	{integer} the result
*/
JSM.GetPolyEdgeEndVertex = function (polyEdge, adjacencyInfo)
{
	if (!polyEdge.reverse) {
		return adjacencyInfo.edges[polyEdge.index].vert2;
	} else {
		return adjacencyInfo.edges[polyEdge.index].vert1;
	}
};

/**
* Function: GetAnotherPgonOfEdge
* Description: Returns the polygon index which is next to the current polygon along an edge.
* Parameters:
*	edge {EdgeInfo} the edge info
*	currentPgon {integer} the current polygon index
* Returns:
*	{integer} the result
*/
JSM.GetAnotherPgonOfEdge = function (edge, currentPgon)
{
	if (edge.pgon1 != -1 && edge.pgon1 != currentPgon) {
		return edge.pgon1;
	} else if (edge.pgon2 != -1 && edge.pgon2 != currentPgon) {
		return edge.pgon2;
	}
	return -1;
};

/**
* Function: CalculateBodyVertexToPolygon
* Description:
*	Calculates an array which contains array of the connected polygon
*	indices for all vertex indices in the body. The result is an
*	array of array of polygon indices.
* Parameters:
*	body {Body} the body
* Returns:
*	{integer[*][*]} the result
*/
JSM.CalculateBodyVertexToPolygon = function (body)
{
	var result = [];
	
	var i, j;
	for (i = 0; i < body.VertexCount (); i++) {
		result.push ([]);
	}
	
	var polygon;
	for (i = 0; i < body.PolygonCount (); i++) {
		polygon = body.GetPolygon (i);
		for (j = 0; j < polygon.VertexIndexCount (); j++) {
			result[polygon.GetVertexIndex (j)].push (i);
		}
	}
	
	return result;
};

/**
* Function: CalculateAdjacencyInfo
* Description: Calculates the adjacency info for a body.
* Parameters:
*	body {Body} the body
* Returns:
*	{AdjacencyInfo} the result
*/
JSM.CalculateAdjacencyInfo = function (body)
{
	function AddEdge (from, to, polygon)
	{
		var pedge = new JSM.PolyEdgeInfo ();
	
		var i, edge;
		for (i = 0; i < adjacencyInfo.edges.length; i++) {
			edge = adjacencyInfo.edges[i];
			if (edge.vert1 === from && edge.vert2 === to) {
				pedge.index = i;
				pedge.reverse = false;
			} else if (edge.vert1 === to && edge.vert2 === from) {
				pedge.index = i;
				pedge.reverse = true;
			}
		}

		if (pedge.index === -1) {
			var newEdge = new JSM.EdgeInfo ();
			newEdge.vert1 = from;
			newEdge.vert2 = to;
			newEdge.pgon1 = polygon;
			newEdge.pgon2 = -1;
			adjacencyInfo.edges.push (newEdge);
			
			pedge.index = adjacencyInfo.edges.length - 1;
			pedge.reverse = false;
		} else {
			var currEdge = adjacencyInfo.edges[pedge.index];
			if (currEdge.pgon1 === -1) {
				currEdge.pgon1 = polygon;
			} else if (currEdge.pgon1 !== polygon && currEdge.pgon2 === -1) {
				currEdge.pgon2 = polygon;
			}
		}
		
		return pedge;
	}

	var adjacencyInfo = new JSM.AdjacencyInfo ();
	
	var i, j;

	var vert, pgon;
	for (i = 0; i < body.VertexCount (); i++) {
		vert = new JSM.VertInfo ();
		adjacencyInfo.verts.push (vert);
	}
	
	var polygon, count, curr, next, pedge;
	for (i = 0; i < body.PolygonCount (); i++) {
		polygon = body.GetPolygon (i);
		pgon = new JSM.PgonInfo ();
		
		count = polygon.VertexIndexCount ();
		for (j = 0; j < count; j++) {
			curr = polygon.GetVertexIndex (j);
			next = polygon.GetVertexIndex (j < count - 1 ? j + 1 : 0);

			pedge = AddEdge (curr, next, i);
			
			pgon.verts.push (curr);
			pgon.pedges.push (pedge);
			
			adjacencyInfo.verts[curr].edges.push (pedge.index);
			adjacencyInfo.verts[curr].pgons.push (i);
		}
		adjacencyInfo.pgons.push (pgon);
	}
	
	return adjacencyInfo;
};

/**
* Function: IsSolidBody
* Description:
*	Returns if a given body is solid. It means that every
*	edges of the body has two polygon neighbours.
* Parameters:
*	body {Body} the body
* Returns:
*	{boolean} the result
*/
JSM.IsSolidBody = function (body)
{
	var adjacencyInfo = JSM.CalculateAdjacencyInfo (body);
	var i, edge;
	for (i = 0; i < adjacencyInfo.edges.length; i++) {
		edge = adjacencyInfo.edges[i];
		if (edge.pgon1 === -1 || edge.pgon2 === -1) {
			return false;
		}
	}
	return true;
};

/**
* Function: CheckSolidBody
* Description:
*	Returns if a given body solid body is correct. It means that every
*	edges of the body has two polygon neighbours, and there are no edge
*	in the body which appears twice with the same direction.
* Parameters:
*	body {Body} the body
* Returns:
*	{boolean} the result
*/
JSM.CheckSolidBody = function (body)
{
	var adjacencyInfo = JSM.CalculateAdjacencyInfo (body);
	var i, j, edge, pedge, found, pgon1, pgon2, pgon1Reverse, pgon2Reverse;
	for (i = 0; i < adjacencyInfo.edges.length; i++) {
		edge = adjacencyInfo.edges[i];
		if (edge.pgon1 === -1 || edge.pgon2 === -1) {
			return false;
		}
		
		pgon1 = adjacencyInfo.pgons[edge.pgon1];
		found = false;
		for (j = 0; j < pgon1.pedges.length; j++) {
			pedge = pgon1.pedges[j];
			if (pedge.index == i) {
				pgon1Reverse = pedge.reverse;
				found = true;
				break;
			}
		}
		if (!found) {
			return false;
		}
		
		pgon2 = adjacencyInfo.pgons[edge.pgon2];
		found = false;
		for (j = 0; j < pgon2.pedges.length; j++) {
			pedge = pgon2.pedges[j];
			if (pedge.index == i) {
				pgon2Reverse = pedge.reverse;
				found = true;
				break;
			}
		}
		if (!found) {
			return false;
		}
		
		if (pgon1Reverse == pgon2Reverse) {
			return false;
		}
	}
	return true;
};

/**
* Function: TraversePgonsAlongEdges
* Description:
*	Traverses polygons along edges. The given callback function called on every
*	found polygon. The return value of the callback means if the traverse should
*	continue along the edges of the current polygon.
* Parameters:
*	pgonIndex {integer} the polygon index to start from
*	adjacencyInfo {AdjacencyInfo} the adjacency info
*	onPgonFound {function} the callback
* Returns:
*	{boolean} the result
*/
JSM.TraversePgonsAlongEdges = function (pgonIndex, adjacencyInfo, onPgonFound)
{
	function AddNeighboursToStack (pgonIndex, adjacencyInfo, pgonStack)
	{
		var pgon = adjacencyInfo.pgons[pgonIndex];
		var i, edge, anotherPgon;
		for (i = 0; i < pgon.pedges.length; i++) {
			edge = adjacencyInfo.edges[pgon.pedges[i].index];
			anotherPgon = JSM.GetAnotherPgonOfEdge (edge, pgonIndex);
			if (anotherPgon != -1) {
				pgonStack.push (anotherPgon);
			}
		}
	}

	var pgonIsProcessed = {};
	var pgonStack = [pgonIndex];
	var currentPgonIndex;
	while (pgonStack.length > 0) {
		currentPgonIndex = pgonStack.pop ();
		if (pgonIsProcessed[currentPgonIndex]) {
			continue;
		}
		
		pgonIsProcessed[currentPgonIndex] = true;
		if (onPgonFound (currentPgonIndex)) {
			AddNeighboursToStack (currentPgonIndex, adjacencyInfo, pgonStack);
		}
	}
};
