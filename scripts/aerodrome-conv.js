"use strict";

/*
 * TODO list:
 * - add link to jsonlint, with data
 * - combine aerodrome-conv and airspace-conv to same app
 * 
 * http://geojsonlint.com/
 * http://geojson.org/geojson-spec.html
 * 
 * http://jsonlint.com/
 * http://jsonlint.com/?reformat=compress
 * http://jsonlint.com/?json=%7B%22hello%22%3A%20%22world%22%7D
 */

/*
GEN 1.2 - 2
1.6 Suomeen saapuminen ja Suomesta lähteminen
1.6.1 Rajan yli lentäminen
1.6.1.1 Suomen valtion ilmatilaan saapuvan ilma-aluksen
tulee noudattaa tarkoin lentosuunnitelmassa esitettyä lentoreittiä
sekä säätää lentonsa siten, että rajan yli lentäminen
tapahtuu mahdollisimman lähellä laskettua ylitysaikaa. Jos
lento tapahtuu AIP:n ENR 3:ssa annettujen ATS-reittien ulkopuolella,
on lentoreitti suunniteltava siten, että se noudattaa
suorinta mahdollista lentosuuntaa maarajan tai aluemeren
ulkorajan ylityskohdasta lentosuunnitelmassa ilmoitettuun
laskupaikkaan tai liittymiskohtaan ATS-reitillä (ks. AIP, ENR
1.10, lentosuunnitelman sisältö).

1.6.1.3 Kun kysymyksessä on Suomen/Ruotsin tai Suomen/Norjan
välisen rajan yli lentäminen, suositellaan julkaistujen
ATS-reittien tai seuraavien koordinaattipisteiden
käyttämistä:




ENR 1.10, lentosuunnitelman sisältö).

*/


var outputJson ="";

var outputStr="";

function output_log(str)
{
	outputStr += str + "<br>";
	document.getElementById("output_log").innerHTML=outputStr;
}


function output(str) {
	outputJson += str;
	output_log( str );
}


// Airspace specific functions
function outputStart() {
	output('{');
	output('	"type": "FeatureCollection",');
	output('	"features": [');
}

function outputEnd() {
	output('	]');
	output('}');
}

function outputAirspace(name, bottom, top, coordinates, isLastAirspace) {
	output('		{');
	output('			"type": "Feature",');
	output('			"properties": {');
	output('				"name": "' + name + '",');
	output('				"top": "' + top + '",');
	output('				"bottom": "' + bottom + '"');
	output('			},');
	output('			"geometry": {');
	output('				"type": "Polygon",');
	output('				"coordinates": [');

	output('					[ ');
	for (var i=0; i<coordinates.length; i+=2) {
		var possibleComma = "";
		if (i<coordinates.length-2) {
			possibleComma = ",";
		}
		output('[' + DMS_to_Decimal(coordinates[i+1]) + ', ' + DMS_to_Decimal(coordinates[i]) + ']' + possibleComma);
	}

	output('					]');
	output('				]');
	output('			}');
	if (isLastAirspace == 0) {
		output('		},'); // Comma must be at the end of the airspace data...
	}
	else {
		output('		}'); // ... But not at the end of the last item.
	}
}


// Aerodrome specific functions
function outputStartAD() {
	output('{');
	output('	"created": "2016-MM-DD",');
	output('	"aerodrome": [');
}

function outputEndAD() {
	output('	]');
	output('}');
}

function outputAerodrome(icao, name, lat, lon, atc, acc, vfrPointArray, isLastAerodrome) {
	output('		{');
	output('			"icao": "' + icao + '",');
	output('			"name": "' + name + '",');
	output('			"lat": "' + lat + '",');
	output('			"lon": "' + lon + '",');
	output('			"atc": "' + atc + '",');
	output('			"acc": "' + acc + '",'); // ,

	output('			"vfrpoint": [');
	
	for (var i=0; i<vfrPointArray.length; ++i) {
		var possibleComma = "";
		if (i<vfrPointArray.length-1) {
			possibleComma = ",";
		}
		output( ' { "name": "' + vfrPointArray[i][0] + '",');
		output('	"lat": "' + vfrPointArray[i][1] + '",');
		output('	"lon": "' + vfrPointArray[i][2] + '"');
		output('		 }' + possibleComma);
	}
	output('				]'); // vfrpoint

	if (isLastAerodrome == 0) {
		output('		},'); // Comma must be at the end of the aerodrome data...
	}
	else {
		output('		}'); // ... But not at the end of the last item.
	}
}



function processSuccess(data) {
	if (data.status === 'ok') {
		debug_log("Validation SUCCESS");
		alert('Valid GeoJSON!');
	} else if (data.status === 'error') {
		debug_log("Validation FAILED");
		alert('There was a problem with your GeoJSON: ' + data.message);
	}
}

function processError() {
    alert('There was a problem with ajax.');
}


function checkLatCoordinate(lineNumber, coord) {
	if (coord.length != 7) {
		debug_log("ERROR: parseLatCoordinate(): Expected length==7, was = '" + coord + "' at line " + lineNumber);
	}
}
function checkLonCoordinate(lineNumber, coord) {
	if (coord.length != 8) {
		debug_log("ERROR: checkLonCoordinate(): Expected length==8, was = '" + coord + "' at line " + lineNumber);
	}
}
function checkDash(lineNumber, str) {
	if (str != "-") {
		debug_log("ERROR: checkDash(): Expected '-', was = '" + str + "' at line " + lineNumber);
	}
}

function checkEmptyLine(lineNumber, str) {
	if (str != "") {
		debug_log("ERROR: checkEmptyLine(): Expected empty line, but got '" + str + "' at line " + lineNumber);
	}
}



function conversion(data) {
	var a =	new Array();

	var raw = data.split('\n');
	//debug_log(raw);

	for (var lineNumber=0; lineNumber<raw.length; ++lineNumber) {
		// Airspace name
		var name = raw[lineNumber];
		debug_log("Line " + lineNumber + ": airspace name: " + name );
		//++lineNumber;
		var coordArray = new Array();
		
		// Coordinates
		var done = 0;
		var safetyCounter = 100;
		while (!done && safetyCounter>0) {
			debug_log("Line " + lineNumber + ": split new coordinates.");
			safetyCounter--;
			
			var coordSplit = raw[++lineNumber].split(' ');
			var ci = 0;
			
			debug_log("Line " + lineNumber + ": coordinate loop: " + raw[lineNumber]);
			
			if (coordSplit.length == 6) { // Two coordinates and list continues "613635N 0235128E - 612303N 0240448E -"
				debug_log("Line " + lineNumber + ": coordinate loop: Two coordinates and list continues ");
				

				checkLatCoordinate(lineNumber, coordSplit[ci]);
				coordArray.push( coordSplit[ci++] );
				checkLonCoordinate(lineNumber, coordSplit[ci]);
				coordArray.push( coordSplit[ci++] );

				checkDash(lineNumber, coordSplit[ci++]);
				
				checkLatCoordinate(lineNumber, coordSplit[ci]);
				coordArray.push( coordSplit[ci++] );
				checkLonCoordinate(lineNumber, coordSplit[ci]);
				coordArray.push( coordSplit[ci++] );

				checkDash(lineNumber, coordSplit[ci++]);
			}
			else if (coordSplit.length == 5) { // Two coordinates and list ends "613635N 0235128E - 612303N 0240448E"
				debug_log("Line " + lineNumber + ": coordinate loop: Two coordinates and list ends ");

				checkLatCoordinate(lineNumber, coordSplit[ci]);
				coordArray.push( coordSplit[ci++] );
				checkLonCoordinate(lineNumber, coordSplit[ci]);
				coordArray.push( coordSplit[ci++] );

				checkDash(lineNumber, coordSplit[ci++]);
				
				checkLatCoordinate(lineNumber, coordSplit[ci]);
				coordArray.push( coordSplit[ci++] );
				checkLonCoordinate(lineNumber, coordSplit[ci]);
				coordArray.push( coordSplit[ci++] );

				debug_log("Line " + lineNumber + ": Coordinates done");
				done=1;
			} 
			else if (coordSplit.length == 2) { // One coordinate and list ends "613635N 0235128E"
				debug_log("Line " + lineNumber + ": coordinate loop: One coordinate and list ends ");

				checkLatCoordinate(lineNumber, coordSplit[ci]);
				coordArray.push( coordSplit[ci++] );
				checkLonCoordinate(lineNumber, coordSplit[ci]);
				coordArray.push( coordSplit[ci++] );
				
				debug_log("Line " + lineNumber + ": Coordinates done");
				done=1;
			} 
			else {
				debug_log("Line " + lineNumber + ": ERROR: coordinate loop: This is not coordinate line!");
				debug_log("Line " + lineNumber + ": done=1");
				done=1;
			}
			
		}
		// Top limit
		var topLimit = raw[++lineNumber];
		debug_log("Line " + lineNumber + ": topLimit=" + topLimit);
		
		// Bottom limit
		var bottomLimit = raw[++lineNumber];
		debug_log("Line " + lineNumber + ": bottomLimit=" + bottomLimit);

		var isLastAirspace=0;
		if (lineNumber>raw.length-4) {
			debug_log("Line " + lineNumber + ": This is the last airspace!");
			isLastAirspace=1;
		}
		// Write geojson entry
		outputAirspace(name, bottomLimit, topLimit, coordArray, isLastAirspace);
		
		checkEmptyLine(lineNumber, raw[++lineNumber]);
	}

	outputEnd();
	
	// Check data with geojsonlint	
	$.ajax({
	    url: 'http://geojsonlint.com/validate',
	    type: 'POST',
	    data: outputJson,
	    dataType: 'json',
	    success: processSuccess,
	    error: processError
	});
	
}


function conversionAD(data) {
	outputStartAD();

	var a =	new Array();

	var raw = data.split('\n');
	//debug_log(raw);

	for (var lineNumber=0; lineNumber<raw.length; ++lineNumber) {
		// Aerodrome's icao and full name
		var nameSplit = raw[lineNumber].split(' ');
		var icao = nameSplit[0]; //raw[lineNumber];
		var name = "";
		for (var i=1; i<nameSplit.length; ++i) {
			name += nameSplit[i];

			// Add space between words, except after last word.
			if (i<nameSplit.length-1) {
				name += ' ';
			}
		}
		debug_log("Line " + lineNumber + ": aerodrome: " + icao + " - '" + name +"'");

		var coordArray = new Array();
		
		// Coordinate
		var coordSplit = raw[++lineNumber].split(' ');
		var ci=0;
		checkLatCoordinate(lineNumber, coordSplit[ci]);
		var lat = coordSplit[ci++];
		checkLonCoordinate(lineNumber, coordSplit[ci]);
		var lon = coordSplit[ci++];
		debug_log("Line " + lineNumber + ": coordinate lat=" + lat + ", lon=" + lon);

		// ATC yes/no
		var atc = raw[++lineNumber];
		if (atc != "yes" && atc != "no") {
			debug_log("ERROR: Line " + lineNumber + ": Expected yes or no for atc, but got '" + atc + "'");
		}
		debug_log("Line " + lineNumber + ": atc=" + atc);

		// ACC frequency
		var acc = raw[++lineNumber];
		debug_log("Line " + lineNumber + ": acc=" + acc);

		var vfrPointSplit = raw[++lineNumber].split(' ');

		var done = 0;
		var safetyCounter = 100;
		//debug_log("Line " + lineNumber + ": vfr point loop vfrPointSplit.length: " + vfrPointSplit.length);
		
		var vfrPointArray = new Array();
		while (vfrPointSplit[0] != "" && safetyCounter>0) { //.length > 1
			debug_log("Line " + lineNumber + ": split vfr points.");
			safetyCounter--;

			debug_log("Line " + lineNumber + ": vfr point loop: " + raw[lineNumber]);
			
			// Handle VFR points here
			checkLatCoordinate(lineNumber, vfrPointSplit[1]);
			checkLonCoordinate(lineNumber, vfrPointSplit[2]);
			vfrPointArray.push(vfrPointSplit);
			
			vfrPointSplit = raw[++lineNumber].split(' ');
			//debug_log("Line " + lineNumber + ": vfr point loop vfrPointSplit.length: " + vfrPointSplit.length);
		}

		var isLastAerodrome=0;
		if (lineNumber>raw.length-4) {
			debug_log("Line " + lineNumber + ": This is the last aerodrome!");
			isLastAerodrome=1;
		}
		// Write json entry
		outputAerodrome(icao, name, lat, lon, atc, acc, vfrPointArray, isLastAerodrome);
	}

	outputEndAD();
	
	
	// <a href="http://jsonlint.com/?json="+ + outputJson >Run json lint for data</a></p>
	// Check data with geojsonlint	
	/*$.ajax({
	    url: 'http://jsonlint.com/?json=' + outputJson,
	    type: 'GET',
	    //data: outputJson,
	    //dataType: 'json',
	    success: processSuccess,
	    error: processError
	});*/
	
}

function onLoadConvertAerodrome()
{
	log="";
	
	$.get( "data/EE-aerodromes-raw.txt", function( data ) {
		conversionAD( data );
		//alert( "Load was performed." );
	});
	
}
