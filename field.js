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
	table.id = "map"

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

			tr.appendChild (td)
		}
		table.appendChild(tr)
	}

	table.onclick = function (e) {
		showTileData (e.target)
	}

	// clear old screen
	document.getElementById("container").removeChild (document.getElementById("scroll"))

	// load new screen
	document.getElementById("container").appendChild (table)

}

function showTileData (tileData) {
	// if a pop up is not open
	if (document.getElementById("popup") === null) {
		var tileClasses = tileData.className

		var tileType = ""
		var worker = ""
		var building = ""

		if (tileClasses.indexOf("water") >= 0) {
			tileType = "water"
		}
		if (tileClasses.indexOf("forest") >= 0) {
			tileType = "forest"
		}
		if (tileClasses.indexOf("land") >= 0) {
			tileType = "land"
		}
		if (tileClasses.indexOf("shack") >= 0) {
			building = "shack"
		}
		if (tileClasses.indexOf("worker") >= 0) {
			worker = "worker"
		}
		var buffer = "<div id='popup'>"
		buffer += "<div id='tileData'><p>Tile Data</p>"
		buffer += "<ul>"
		buffer += "<li>Type: " + tileType + "</li>"
		if (building !== "") buffer += "<li>Building: " + building + "</li>"
		if (worker !== "") buffer += "<li>Worker: " + worker + "</li>"
		buffer += "</ul>"
		buffer += "<button onclick='document.getElementById(\"popup\").parentNode.removeChild(document.getElementById(\"popup\"))'>close</button>"
		buffer += "</div>"
		buffer += "</div>"

		document.getElementById("container").innerHTML += buffer

		document.getElementById("map").onclick = function (e) {
			showTileData (e.target)
		}
	}
}
