document.getElementById ("beginJourney").onclick = function () {
	drawMap()
	drawMapDetail()
	drawActions()

	resetMapEventListener ()
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

function drawMapDetail () {
	var buffer = ""

	buffer = "<div class='legend'>"
	buffer += "<h3>Terrain details:</h3>"
	buffer += "<ul id='mapDetail'>"
	buffer += "<li>Terrain: </li>"
	buffer += "</ul></div>"

	document.getElementById("container").innerHTML += buffer
}

function drawActions () {
	var buffer = ""

	buffer = "<div id='actions'>"
	buffer += "<h3>Actions:</h3>"
	buffer += "</div>"

	document.getElementById("container").innerHTML += buffer
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
		var buffer = ""
		buffer += "<li>Type: " + tileType + "</li>"
		if (building !== "") buffer += "<li>Building: " + building + "</li>"
		if (worker !== "") buffer += "<li>Unit: " + worker + "</li>"

		document.getElementById("mapDetail").innerHTML = buffer

		resetMapEventListener ();
	}
}

function deselectAll () {
	var tds = document.getElementsByTagName("td")

	for (var i = 0; i < tds.length; i++) {
		if (tds[i].className.indexOf("selected"))
			tds[i].className = tds[i].className.replace ("selected", "")
	}
}

function resetMapEventListener () {
	document.getElementById("map").onmouseover = function (e) {
		showTileData (e.target)
	}
	document.getElementById("map").onclick = function (e) {
		deselectAll()
		e.target.className += " selected"
		var unitType = ""

		if (e.target.className.indexOf ("worker") >= 0) {
			unitType = "Worker"
		}
		var buffer = "<h3>Actions: " + unitType + "</h3>"

		if (unitType === "Worker") {
			buffer += "Goto"
		}

		document.getElementById ("actions").innerHTML = buffer
	}
}
