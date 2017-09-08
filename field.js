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
	var table = document.createElement("table")

	var x = Math.floor(Math.random() * 25) + 0
	var y = Math.floor(Math.random() * 25) + 0

	for (var i = 0; i <= 25; i++) {
		var tr = document.createElement("tr")
		for (var j = 0; j <= 25; j++) {
			var td = document.createElement("td")

			td.className += " " + getNewSquare()
			if (x == i && y == j) {
				td.className += " " + "shack"
				td.className += " " + "worker"
			}
			td.onclick = function () {
				showTileData (this)
			}

			tr.appendChild (td)
		}
		table.appendChild(tr)
	}

	// clear old screen
	document.getElementById("container").parentNode.replaceChild (document.getElementById("container").cloneNode(false), container)

	// load new screen
	document.getElementById("container").appendChild (table)

}

function showTileData (tileData) {
	var buffer = ""
	buffer += "<div class='tileData'><p>Tile Data</p>"
	buffer += "<ul>"
	buffer += "<li>Type: Forest</li>"
	buffer += "<li>Type: Forest</li>"
	buffer += "</ul>"
	buffer += "</div>"

	document.getElementById("container").innerHTML += buffer
}