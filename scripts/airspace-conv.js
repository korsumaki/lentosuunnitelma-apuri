"use strict";

/*
 * TODO list:
 * 
 * 
 * 
 * http://geojsonlint.com/
 * http://geojson.org/geojson-spec.html
 * 
 * geojson
 * + datan voi tarkistaa kartalla
 * - oma formaatti voisi olla tiiviimpi
 * - koordinaatit täytyy convertoida
 * 
 * TODO Airspace
 * - tee scripti muodostamaan geojson filen yksinkertaisemmasta datasta
 *   - koordinaattien muunto desimaalimuotoon
 * - 

Ilmatilat

CTR
TMA
CTA
FIZ UPPER
ACC sektorit <- ei näitä

ENR 2.1 FIR, ACC SECTOR, CTA, FIZ UPPER, TMA

EFTP AD 2.17 ATS-ILMATILA

"name": "EFTP CTR"
"lateralLimits": 
613635N 0235128E - 612303N 0240448E -
611303N 0232104E - 612630N 0230729E -
613635N 0235128E
"verticalLimits": "korkeus SFC - 2000FT MSL"

EFTP TMA EAST
614324N 0234508E - 614307N 0240755E -
613600N 0243552E - 611443N 0243524E -
610548N 0235502E - 610342N 0232209E -
610640N 0230829E - 612126N 0225328E -
613145N 0225407E - 614324N 0234508E
2000 FT MSL - FL 95

EFTP TMA WEST
613145N 0225407E - 612126N 0225328E -
610640N 0230829E - 610342N 0232209E -
610251N 0230418E - 611036N 0223554E -
612857N 0223728E - 613012N 0224727E -
613145N 0225407E
FL 65 - FL 95



EFHA CTR
615938N 0251232E - 614442N 0251426E -
614305N 0242345E - 615759N 0242122E -
615938N 0251232E
SFC - 2000FT MSL

EFHA TMA
621002N 0250657E - 615152N 0254656E -
613731N 0253018E - 613600N 0243552E -
614307N 0240755E - 615655N 0240258E -
620455N 0240521E - 621002N 0250657E
2000 FT MSL - FL 95

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
		debug_log("ERROR: checkEmptyLine(): Expected empty line between airspaces, but got '" + str + "' at line " + lineNumber);
	}
}


/* TODO
 * + EFIV CTR ja EFIV FIZ LOWER sama alue
 * + EFKT CTR ja EFKT FIZ LOWER sama alue
 * + EFKS CTR ja EFKS FIZ LOWER sama alue
 * + EFIV FIZ UPPER ja EFIV TMA sama alue
 * + EFKT FIZ UPPER ja EFKT TMA sama alue
 * + EFKS FIZ UPPER ja EFKS TMA sama alue
 * 
 * + EFVR FIZ LOWER poistettava, tarkista!
 * + EFVR FIZ UPPER poistettava, tarkista!
 * 

ENR 2.1 FIR, ACC SECTOR, CTA, FIZ UPPER, TMA

EFKT AD 2.17 ATS-ILMATILA

 * - EFPO CTR koordinaateista puuttuu viivat rivin lopusta
 * - EFKT CTR koordinaateista puuttuu yksi viiva rivin lopusta
 * - EFKT FIZ LOWER koordinaateista puuttuu yksi viiva rivin lopusta
 * - EFKS TMA koordinaateista puuttuu yksi viiva rivin lopusta
 * - 
 * - EFJY CTA, 2 viimeistä koordinaattia (631116N 0263241E - 631924N 0254005E) on virheellisiä. Tämä näyttää aiheuttavan Keiteleen nurkille ylimääräisen viivan hiukan CTA alueen ulkopuolelle.
EFJY CTA
631924N 0254005E - 630627N 0270241E -
623159N 0270936E - 620714N 0263435E -
622437N 0263339E - 624834N 0253951E -
624803N 0251041E - 624251N 0245007E -
620836N 0244901E - 620455N 0240521E -
622753N 0233304E - 623741N 0233957E -
630006N 0240449E - 631302N 0243759E -
631758N 0250448E - 631924N 0254005E
631116N 0263241E - 631924N 0254005E



 * 
 * - EFHA CTR väli puuttuu 2000 ja FT välistä
 * 
 */ 

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

function onLoadConvertAirspace()
{
	log="";
	outputStart();
	
	$.get( "data/airspace-raw.txt", function( data ) {
		conversion( data );
		//alert( "Load was performed." );
	});
	
}
