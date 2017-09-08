document.getElementById ("beginJourney").onclick = function () {
	drawMap();
}

var tileTypes = [{
		"type":"land",
		"probability": "80"
},{
		"type":"water",
		"probability": "10"
},{
		"type":"forest",
		"probability": "10"
}]
getNewSquare()
function getNewSquare () {
	var probabilityMatrix = new Array ()

	for (var i = 0; i < tileTypes.length; i++) {
		for (var j = 0; j < tileTypes[i].probability; j++) {
			probabilityMatrix.push (tileTypes[i].type)
		}
	}



	return probabilityMatrix[Math.floor(Math.random() * probabilityMatrix.length) + 0]
}

function drawMap () {
	var fieldTable = "<table>"

	var x = Math.floor(Math.random() * 25) + 0  
	var y = Math.floor(Math.random() * 25) + 0  

	for (var i = 0; i <= 25; i++) {
		fieldTable += "<tr>"
		for (var j = 0; j <= 25; j++) {

			fieldTable += "<td class='" + getNewSquare() + "'>"
			fieldTable += x == i && y == j ? "S" : ""
			fieldTable += "</td>"
		}
		fieldTable += "</tr>"
	}

	fieldTable += "</table>"
	document.getElementById("container").innerHTML = fieldTable	
}
