var beginJourneyButton = document.getElementById ("beginJourney")

beginJourneyButton.focus()

beginJourneyButton.onclick = function () {
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

			td.setAttribute ("data-tile-type", getNewSquare())
			if (x == i && y == j) {
				td.setAttribute ("data-building", "shack")
				td.setAttribute ("data-unit", "worker")
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

		tileType = tileData.getAttribute ("data-tile-type")
		building = tileData.getAttribute ("data-building")
		worker = tileData.getAttribute ("data-unit")

		updateMapInfo (tileType, building, worker)
	}
}

function deselectAll () {
	var tds = document.getElementsByTagName("td")
	for (var i = 0; i < tds.length; i++) {
		if (tds[i].className.indexOf("selected"))
			tds[i].className = tds[i].className.replace ("selected", "")
	}

	document.getElementsByTagName("table")[0].removeAttribute("data-action")
	document.getElementById("actions").innerHTML = "<h3>Actions: </h3>"
}

function resetMapEventListener () {
	document.getElementById("map").onmouseover = function (e) {
		showTileData (e.target)
	}
	document.getElementById("map").onmouseout = function (e) {
		var tds = document.getElementsByTagName("td")
		var foundSelected = false

		for (var i = 0; i < tds.length; i++) {
			if (tds[i].className.indexOf("selected") >= 0) {
				updateMapInfo (tds[i].getAttribute("data-tile-type"), tds[i].getAttribute("data-building"), tds[i].getAttribute("data-unit"))
				foundSelected = true
			}
		}

		if (!foundSelected) {
			updateMapInfo(null,null,null)
		}
	}
	document.getElementById("map").onclick = function (e) {
		var currentAction = document.getElementById("map").getAttribute("data-action")
		if (currentAction === "goto") {
			var tds = document.getElementsByTagName("td")

			for (var i = 0; i < tds.length; i++) {
				if (tds[i].className.indexOf ("selected") >= 0) {
					e.target.setAttribute ("data-unit", tds[i].getAttribute("data-unit"))
					tds[i].removeAttribute("data-unit")
				}
			}

			deselectAll()
			document.getElementById("map").removeAttribute("data-action")
		} else if (currentAction === "fetchWood") {
			if (e.target.getAttribute("data-tile-type") === "forest") {
				var tds = document.getElementsByTagName("td")
				var target

				for (var i = 0; i < tds.length; i++) {
					if (tds[i].className.indexOf ("selected") >= 0) {
						target = tds[i]
					}
				}
				target.setAttribute ("data-require-wood", target.getAttribute("data-require-wood") - 1)

				if (target.getAttribute("data-require-wood") == 0) {
					target.setAttribute("data-building", target.getAttribute("data-building").substring(1))
				}
			}

			deselectAll()
		} else {
			deselectAll()
			e.target.className += " selected"
			var unitType = ""

			unitType = e.target.getAttribute("data-unit")
			var buffer = "<h3>Actions: " + unitType + "</h3>"

			buffer += "<ul>"
			if (unitType === "worker") {
				buffer += "<li><a onclick='document.getElementsByTagName(\"table\")[0].setAttribute(\"data-action\", \"goto\")'>Goto<a>"
				if (e.target.getAttribute("data-building") === null)
					buffer += "<li><a onclick='buildCabin()'>Build Cabin<a>"
				if (e.target.getAttribute("data-building") !== null && e.target.getAttribute("data-building").indexOf("_") === 0)
					buffer += "<li><a onclick='fetchWood()'>Fetch Wood<a>"

			}
			buffer += "</ul>"

			document.getElementById ("actions").innerHTML = buffer
		}
	}
}

function buildCabin () {
	var tds = document.getElementsByTagName("td")

	for (var i = 0; i < tds.length; i++) {
		if (tds[i].className.indexOf ("selected") >= 0) {
			if (tds[i].getAttribute("data-building") === null) {
				tds[i].setAttribute("data-building", "_cabin")
				tds[i].setAttribute("data-require-wood", "2")
			} else {
				alert ("A building already exists")
			}
		}
	}

	deselectAll()
}

function fetchWood () {
	document.getElementById("map").setAttribute("data-action", "fetchWood")
}

function updateMapInfo (tileType, buildingType, unitType) {
	var buffer = ""
	if (tileType !== null)     buffer += "<li>Type: " + tileType + "</li>"
	if (buildingType !== null) buffer += "<li>Building: " + buildingType + "</li>"
	if (unitType !== null)     buffer += "<li>Unit: " + unitType + "</li>"

	document.getElementById("mapDetail").innerHTML = buffer

	resetMapEventListener ()
}
