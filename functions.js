startNewWorldOrderHomesteader ()

function startNewWorldOrderHomesteader () {
	var buffer = ""
	buffer += "<p>Welcome new comer,</p>"
	buffer += "<p>you come to this land from a far away place to settle, cultivate, and dominate.  You live in a small prospector shack that barely protects you from the wild and you will not survive the winter unless you build a home.  Secure water, food and fire to build a small house and start your homestead. Find resources, make tools and items to trade.</p>"
	buffer += "<button id=\"beginJourney\">Begin your journey</button>"
	document.getElementById ("scroll").innerHTML = buffer

	var beginJourneyButton = document.getElementById ("beginJourney")
	beginJourneyButton.focus()

	beginJourneyButton.onclick = function () {
		drawMap()
		drawMapDetail()
		drawActions()

		resetMapEventListener ()
	}
}

function getNewSquare () {
	var tileTypes = [{
			"type":"land",
			"probability": "80"
	},{
			"type":"water",
			"probability": "10"
	},{
			"type":"wood",
			"probability": "10"
	}]

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
	var tableRows    = 25
	var tableColumns = 25

	var table = document.createElement("table")
	table.id = "map"

	for (var i = 0; i <= tableRows; i++) {
		var tr = document.createElement("tr")
		for (var j = 0; j <= tableColumns; j++) {
			var td = document.createElement("td")

			td.setAttribute ("data-tile-type", getNewSquare())

			tr.appendChild (td)
		}
		table.appendChild(tr)
	}


	// clear old screen
	document.getElementById("container").removeChild (document.getElementById("scroll"))

	// load new screen
	document.getElementById("container").appendChild (table)

	// make sure we start on land
	var tds = document.getElementsByTagName("td")
	var startIndex
	do {
		startIndex = Math.floor(Math.random() * tableRows * tableColumns)
	} while (tds[startIndex].getAttribute("data-tile-type") !== "land")

	tds[startIndex].setAttribute("data-unit", "worker")
	tds[startIndex].setAttribute("data-building", "shack")
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

		updateMapInfo (tileData)
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
				updateMapInfo (tds[i])
				foundSelected = true
			}
		}

		if (!foundSelected) {
			updateMapInfo(null)
		}
	}
	document.getElementById("map").onclick = function (e) {
		var currentAction = document.getElementById("map").getAttribute("data-action")
		if (currentAction === "goto") {
			var tds = document.getElementsByTagName("td")

			for (var i = 0; i < tds.length; i++) {
				if (tds[i].className.indexOf ("selected") >= 0) {
					if (tds[i] !== e.target) {
						e.target.setAttribute ("data-unit", tds[i].getAttribute("data-unit"))
						tds[i].removeAttribute("data-unit")
					}
				}
			}

			document.getElementById("map").removeAttribute("data-action")

			deselectAll()
		} else if (currentAction === "fetchWood") {
			fetch (e, "wood")

			deselectAll()
		} else if (currentAction === "fetchWater") {
			fetch (e, "water")

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
				if (e.target.getAttribute("data-building") === null) {
					buffer += "<li><a onclick='buildCabin()'>Build Cabin<a>"
					buffer += "<li><a onclick='buildFarm()'>Build Farm<a>"
				}
				if (e.target.getAttribute("data-require-wood") !== null && e.target.getAttribute("data-require-wood") !== null)
					buffer += "<li><a onclick='fetchWood()'>Fetch Wood<a>"
				if (e.target.getAttribute("data-require-water") !== null && e.target.getAttribute("data-require-water") !== null)
					buffer += "<li><a onclick='fetchWater()'>Fetch Water<a>"

			}
			buffer += "</ul>"

			document.getElementById ("actions").innerHTML = buffer
		}
	}
}

function fetch (e, item) {
	if (e.target.getAttribute("data-tile-type") === item) {
		var domAttributeName = "data-require-" + item
		var tds = document.getElementsByTagName("td")
		var target

		for (var i = 0; i < tds.length; i++) {
			if (tds[i].className.indexOf ("selected") >= 0) {
				target = tds[i]
			}
		}
		target.setAttribute (domAttributeName, target.getAttribute(domAttributeName) - 1)

		if (target.getAttribute(domAttributeName) == 0) {
			target.removeAttribute(domAttributeName)
			isBuildingDone(target)
		}
	}
}

function isBuildingDone (target) {
	for (var i = 0; i < target.attributes.length; i++) {
		if (target.attributes[i].nodeName.indexOf("require") >= 0) {
			return false
		}
		
	}

	// if you get to this line the building is finished
	target.setAttribute("data-building", target.getAttribute("data-building").substring(1))
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

function buildFarm () {
	var tds = document.getElementsByTagName("td")

	for (var i = 0; i < tds.length; i++) {
		if (tds[i].className.indexOf ("selected") >= 0) {
			if (tds[i].getAttribute("data-building") === null) {
				tds[i].setAttribute("data-building", "_farm")
				tds[i].setAttribute("data-require-wood", "1")
				tds[i].setAttribute("data-require-water", "2")
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

function fetchWater () {
	document.getElementById("map").setAttribute("data-action", "fetchWater")
}

function updateMapInfo (data) {
	var tileType = data.getAttribute("data-tile-type")
	var buildingType = data.getAttribute("data-building")
	var unitType = data.getAttribute("data-unit")

	var buffer = ""
	if (tileType !== null)     buffer += "<li>Type: " + tileType + "</li>"
	if (buildingType !== null) {
		buffer += "<li>Building: "
		buffer += buildingType.indexOf("_") === 0 ? buildingType.substring(1) + " (in progress)" : buildingType
		if (buildingType.indexOf("_") === 0) {
			buffer += "<ul>"
			for (var i = 0; i < data.attributes.length; i++) {
				if (data.attributes[i].nodeName.indexOf("require") >= 0) {
					buffer += "<li>"+data.attributes[i].nodeName.split("-")[data.attributes[i].nodeName.split("-").length - 1] + ":" + data.attributes[i].nodeValue + "</li>"
				}
			}
			buffer += "</ul>"
		}
		buffer += "</li>"
	}
	if (unitType !== null)     buffer += "<li>Unit: " + unitType + "</li>"

	document.getElementById("mapDetail").innerHTML = buffer

	resetMapEventListener ()
}
