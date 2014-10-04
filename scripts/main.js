"use strict";

/*
 * TODO list:
 * + kokeile vfr tiedon asetusta (täytä seuraava kenttä oikein)
 * + jos reitti on tyhjä, lisää space (vai nolla?)
 * + Kohdassa 18 edelleen "DEF RTF EFES ACC"; pelkkä "DEP RTF ACC" riittäisi
 * + Jos perustiedot-osassa on nopeusyksiköksi annettu KT, olisi luontevaa näyttää kokonaismatka myös NM, ei KM
 * + myös RMK/ kauttaviiva muutettu escape koodiksi
 * + myös kenttälistaukseen km -> NM
 * + Joissakin koneissa on enemmän kuin 4 paikkaa
 * + VFR tiedon tilalle muitakin vaihtoehtoja A000, F000, ...
 * + Olisiko mahdollista saada useamman koneen tuki ilman että perustiedoista pitäisi käydä muuttamassa koneen tietoja?
 * + lähtöaika samoin kuin toiminta-aika, 15 min jaolla
 * + molempiin aikoihin 1h lisää?
 * + Jos koneessa on laitteissa "G" , ts BRNAV-hyväksytty GPS (kuten GNS430/530) tulisi kohtaan 18 täyttää aina lisäksi PBN/xxx  (ks. taustat täältä http://www.rocketroute.com/ICAO2012-PBN-RNAV.php )
 *     + jos laitteissa on R -> avaa uusi kenttä "PBN/jotain"
 *     + 18 kentän täyttö lisää uuden kentän sisältö ennen RMK/ kohtaa
 *     + tietojen tallennus ja lataus
 *     + lisää pbn tiedon tarkistus vaadittuihin tietoihin ennen lomakkeelle siirtymistä
 * + lentolaskelmataulukon yhteyteen valitun koneen tunnus näkyviin
 * + zzzz kentän koordinaatit 4+5 numerolla. ConvertToDM()
 * + lentoajan antaminen itse (paikallislennoille tai jos muuten haluaa kierrellä enemmän)
 * 
 * /- lisää tallenna -nappi
 * - tallennetaan plaanin tiedot (localstorageen) (ilman virallista plaanin jättämistä)
 * 		+- tallenna storageen
 * 			- epävirallisen nimi + koordinaatit?
 * 		+- lue storagesta ja muodosta plaanilista etusivulle
 * 			- (epävirallisen) kentän nimi
 * 			- kaikki tiedot näkyvyllä (tai täpättävissä näkyviin), ei linkkiä
 * 		+ lataa storagesta koko plaani storedPlan sivulle
 * 		/- lisää napit (poisto, ...)
 * 		- lisää linkit
 * 			+ notam
 * 			- vfr suomi/aip
 * 			- efes
 * 			- metar
 * 			- ZZZZ kenttien hanskaus
 * 		- session storage -> local storage
 * 		+ nappien teksti 2 riville?
 * 		+ plaanin deletointi
 * 		+ lisää tietojen tallennusta
 * 			+ zzzz kentän selväkielinen nimi
 * 			+ korkeus
 * 			+ toiminta-aika
 * 			+ hlö määrä
 * + käyttöohjesivu
 * 		+ käyttö
 * 		+ toteutuksen tekniset yksityiskohdat
 * + jätä johonkin talteen plaanin aktivointi- ja lopetustavat (puh/jakso), ettei tarvisi kirjoittaa muistiin
 * 
 * =======
 * - Ilmatilauudistus 13 NOV 2014
 * 		+ tee tietojen ajastettu vaihto
 * 			+ kaikki kolme xml tiedostoa
 * 		+ uusi VFR pisteet -tiedosto -> on valmiina
 * 		+ ACC sektorit uusiksi
 * 			+ selvitettävä millä sektorilla mikäkin kenttä on?
 * 				+ tornikentät
 * 				+ korpikentät -> tarkistuksia vielä
 * 				+ zzzz kentät (oikeasta ilmailukartasta) -> tarkistuksia vielä
 * 				+ sektoreiden koordinaatit on tiedossa, joten voisi olla mahdollista piirtää ne kartalle?
 * 			+ tarkistuksia tehtävä vielä oikealla datalla
 * 			+ jaksot
 * 			+ sektorien koordinaatit löytyy, mutta ei vielä suoraa tietoa mitkä kentät ko. alueilla on.
 * 				ENR 2.1 FIR, ACC SECTOR, CTA, FIZ UPPER, TMA
 * 				ACC-sektorit on esitetty taulukossa 2.1.2.
 * 				EF_AMDT_A_2014_2_part_2_en.pdf
 * 
 * +- lentokorkeus valinnat selväkielelle (kuten nopeus)
 * - kenttälistan filtteröinti kirjoituksen mukaan?
 * 		- mihin tekstikenttä sopii
 * 		- miten filtteröinti käytännössä toimii
 * 			- valmis demokoodi, data-native-menu="false"
 * 			http://demos.jquerymobile.com/1.4.4/selectmenu-custom-filter/
 * - uusi tekstikenttä, plaanin aktivointi, muu tapa (RTF PIRKKALA TWR 118 700)
 * - jos reitti jää tyhjäksi, lisää siihen DCT, paitsi jos lähtö ja määräkenttä on samoja... silloin note että "lisää siihen jotain, esim. TC"
 * 
 * 
 * - refresh jossain muualla kuin pääsivulla aiheuttaa erroreita -> jquery vaiheessa voisi koittaa korjata
 * 
 * - lisää koodin muuttamispäivämäärä lokitukseen?
 * 
 * 
 * + iframe kokeilu idebug.html
 * 		+ http://stackoverflow.com/questions/17223469/how-to-preserve-responsive-design-in-mobile-browsers-iframe
 * 		+ näyttää siltä että uudempi jquerymobile auttaa
 * + Sijainti... -> Sijainti OK
 * 		+ näkeekö onko tarkka vai karkea?
 * 		= handlePositionUpdateCallback
 * + jos huomataan että käyttäjän täytyy modata jotain tietoa lomakkeella, kerro se messageboxissa (acc jakso, /zzzz koordinaatit)
 * + tuntematon epävirallinen laskupaikka -> avaa lentoajan muuttaminen...
 * - tee samat oikeellisuustarkistukset kuin finavialla on?
 * 		- tutki mitä siellä tarkistetaan.
 * - jos reitti kenttään on syötetty jotain, pakota tai ohjaa käyttäjä muuttamaan lentoaikaa.
 * - poista html koodit input kentistä ennen tiedon käyttämistä!
 * 
 * - Jatka Lentosuunnitelmaan... napin yläpuolelle punainen huomautuslaatikko muistuttamaan mitä pitää modata?
 * - avaa notam linkki uuteen ikkunaan?
 * 
 * - review and update comments
 * 
 * - poista timestampit minimoitavasta koodista
 * - poista päivämääräfeikkaus ennen julkaisua
 * + minimization: http://closure-compiler.appspot.com/home
 */

var log="";
var VfrRepArray;

var CurrentAerodromeArray; // Contains either Official or Official+ZZZZ fields, depending on user selection.
var OfficialAerodromeArray;
var ZZZZFieldArray;

var gPosition_lat;
var gPosition_lon;

var flightPlanLink; // created link to flight plan
//var GlobalFlyingTimeStr;
var gCalculatedFlyingTimeStr;
var gSelectedFlyingTimeStr;

// constants

// Date when update is taken into use.
var dateOfUpdateStr = "2014-11-13T00:00:00Z";

// These names are used before update
var AerodromesFilename_before_13NOV2014 = "aerodromes_19SEP2013.xml";
var VFRPortFilename_before_13NOV2014    = "EF_VFRREP_19SEP2013.xml";
var ZZZZFieldsFilename_before_13NOV2014 = "zzzz_fields_18JAN2014.xml";

// Current (new) filenames
var VFRPortFilename = "EF_VFRREP_13NOV2014.xml";
var AerodromesFilename = "aerodromes_13NOV2014.xml";
var ZZZZFieldsFilename = "zzzz_fields_13NOV2014.xml";

var UNOFFICIAL_AERODROME="ZZZZ";
var UNOFFICIAL_AERODROME_INDEX=0; // This field index is used when ZZZZ place name was written manually, not from xml.

var BY_PHONE_ON_GROUND_STR = "PHONE ACC ";
var BY_PHONE_ON_GROUND_STR_WITH_PHONE = "PHONE ACC 032865172 "; 
var BY_RTF_ON_AIR_STR = "RTF ACC "; // ACC freq is updated later
var BY_TWR = "- (torni)";

var NOTE_TO_ADD_ACC_FREQ_STR = "LISÄÄ_ACC_JAKSO";

var overrideFlightTime = true;


function debug_log(str)
{
	log += str + "<br>";
	document.getElementById("log").innerHTML=log;
}

function debug_timestamp(str)
{
	//var d = new Date();
	//var n = d.getTime(); // toTimeString();
	//debug_log(str + ":"+ n);
}

//-------------------------------------

function getFlightTimeOverride() {
	return overrideFlightTime;
}

function setFlightTimeOverride(value) {
	//debug_log("setFlightTimeOverride:" + value);
	if (overrideFlightTime == value) {
		//debug_log("setFlightTimeOverride: --- no change -> return");
		return;
	}
	overrideFlightTime = value;
	
	if (overrideFlightTime==true) {
		// show
		//document.getElementById("overrideFlightTimeContainer").style.display = '';
		$('#overrideFlightTimeContainer').slideDown();
	}
	else {
		// Hide
		//document.getElementById("overrideFlightTimeContainer").style.display = 'none';
		$('#overrideFlightTimeContainer').slideUp();

		// Clear FlightTimeOverride selections
		var hourSel = document.getElementsByName("flightTimeHour");
		for(var i = 0; i < hourSel.length; i++) {
			$( "#flightTime" + hourSel[i].value + "h" ).removeAttr('checked').checkboxradio( "refresh" );
		}
		
		var minSel = document.getElementsByName("flightTimeMin");
		for(var i = 0; i < minSel.length; i++) {
			$( '#flightTime' + minSel[i].value ).removeAttr('checked').checkboxradio( "refresh" );
		}
		// Forget also previous override flying time
		gSelectedFlyingTimeStr = gCalculatedFlyingTimeStr;
	}
}

function onFlightTimeOverrideButton() {
	// Toggle value
	setFlightTimeOverride( !getFlightTimeOverride() );
}



function isEverythingReady() {
	var isReady=true;
	if (VfrRepArray == undefined) {
		//debug_log("isEverythingReady() - VfrRepArray not yet ready");
		isReady=false;
	}
	if (OfficialAerodromeArray == undefined) {
		//debug_log("isEverythingReady() - OfficialAerodromeArray not yet ready");
		isReady=false;
	}
	if (ZZZZFieldArray == undefined) {
		//debug_log("isEverythingReady() - ZZZZFieldArray not yet ready");
		isReady=false;
	}

	return isReady;
}

function continueIfEverythingIsReady() {
	if (isEverythingReady()) {
		//debug_log("continueIfEverythingIsReady()");
		PopulateSelections();
		onChangeDepartureAd();
		onChangeDestinationAd();
	}
	
	if (OfficialAerodromeArray !== undefined && ZZZZFieldArray !== undefined &&gPosition_lat !== undefined) {
		//debug_log("continueIfEverythingIsReady() - new handlePositionUpdate");
		handlePositionUpdate(gPosition_lat, gPosition_lon);
	}
}


function handlePositionError(error) {
	document.getElementById("locationUpdateButtonText").innerHTML = "Ei sijaintia";
	switch(error.code)
	{
	case error.PERMISSION_DENIED:
		// No need to alert, as user knows this already...
		debug_log("Sijainti ei ole saatavilla (PERMISSION_DENIED)");
		break;
	case error.POSITION_UNAVAILABLE:
		debug_log("Sijainti ei ole saatavilla (POSITION_UNAVAILABLE)");
		break;
	case error.TIMEOUT:
		debug_log("Sijainti ei ole saatavilla (TIMEOUT)");
		break;
	default:
		debug_log("Sijainti ei ole saatavilla (unknown error)");
		break;
	}
	fakeCurrentLocation();
}


function handlePositionUpdateCallback(position) {
	handlePositionUpdate(position.coords.latitude, position.coords.longitude);
	var accuracy;
	if (position.coords.accuracy<1000) {
		accuracy = "(" + Math.round(position.coords.accuracy) + "m)";
	} else {
		accuracy = "(" + Math.round(position.coords.accuracy/1000) + "km)";
	}
	/*if (position.coords.accuracy<500) {
		accuracy = "(m)";
	} else {
		accuracy = "(km)";
	}*/

	document.getElementById("locationUpdateButtonText").innerHTML = "Sijainti " + accuracy;
}

function handlePositionUpdate(lat, lon) {
	//debug_log("handlePositionUpdate()");

	gPosition_lat = lat;
	gPosition_lon = lon;
	if (OfficialAerodromeArray === undefined) {
		//debug_log("handlePositionUpdate() - OfficialAerodromeArray is not ready.");
		return;
	}
	if (ZZZZFieldArray === undefined) {
		//debug_log("handlePositionUpdate() - ZZZZFieldArray is not ready.");
		return;
	}

	if (document.getElementById("zzzzFieldsEnabled").value == "enabled") {
		debug_log("Kaikki lentokentät käytössä.");
		CurrentAerodromeArray = OfficialAerodromeArray.concat(ZZZZFieldArray);
	} else {
		debug_log("Vain viralliset lentokentät käytössä.");
		CurrentAerodromeArray = OfficialAerodromeArray;
	}


	// Special handling for ZZZZ field in index 0.
	if (CurrentAerodromeArray.length > 0 && CurrentAerodromeArray[0].icao === UNOFFICIAL_AERODROME ) {
		CurrentAerodromeArray[0].lat = lat;
		CurrentAerodromeArray[0].lon = lon;
		CurrentAerodromeArray[0].latStr = DMS_to_DM(Decimal_to_DMS_lat(lat));
		CurrentAerodromeArray[0].lonStr = DMS_to_DM(Decimal_to_DMS_lon(lon));
	}
	for (var ad=1; ad<CurrentAerodromeArray.length; ++ad) {
		CurrentAerodromeArray[ad].calcDistanceFrom(
				lat,
				lon);
	}
	CurrentAerodromeArray.sort(waypointDistanceSort);
	debug_log("Nykyinen sijainti " + Math.round(CurrentAerodromeArray[1].distance) + " km kentältä " +
			CurrentAerodromeArray[1].name + ", " + CurrentAerodromeArray[1].icao);

	PopulateSelections();
	onChangeDepartureAd();
	onChangeDestinationAd();
}

function addPrefixDigits(value, digitToAdd, targetLength) {
	while (value.length < targetLength) {
		//debug_log("addPrefixDigits: " + value.length );
		value = digitToAdd + value;
	}
	return value;
}



/*
 * convert DegMinSec format to DecMin
 */
function DMS_to_DM(dms) {
	//debug_log("DMS_to_DM: input = " + dms);
	var dm;
	
	//var decimal=0;
	var degrees=0;
	var minutes=0;
	var seconds=0;
	var sign = dms.substr(dms.length-1, 1).toUpperCase();

	if (dms.length == 7) {
		degrees=parseInt(dms.substr(0,2), 10);
		minutes=parseInt(dms.substr(2,2), 10);
		seconds=parseInt(dms.substr(4,2), 10);
	} else if (dms.length == 8) {
		degrees=parseInt(dms.substr(0,3), 10);
		minutes=parseInt(dms.substr(3,2), 10);
		seconds=parseInt(dms.substr(5,2), 10);
	}
	else {
		debug_log("ERROR: DMS_to_DM(): DMS coordinate does not look valid!");
	}
		
	if (seconds>=30) {
		seconds = 0;
		minutes += 1;
	}
	if (minutes==60) {
		minutes = 0;
		degrees += 1;
	}
	
	switch (sign) {
		case 'N':
		case 'S':
			return  addPrefixDigits( degrees.toString(), "0", 2) +
					addPrefixDigits( minutes.toString(), "0", 2) + sign;
			break;
		case 'W':
		case 'E':
			return  addPrefixDigits( degrees.toString(), "0", 3) +
					addPrefixDigits( minutes.toString(), "0", 2) + sign;
			break;
		default: // No letter at the end (or wrong letter).
			debug_log("ERROR: DMS_to_DM(): DMS coordinate does not look valid! No letter at the end (or wrong letter).");
			break;
	}

	return dm;
}


/*
 * 6 numbers + N/S
 * 7 numbers + E/W
 */
function DMS_to_Decimal(dms) {
	var factor = 1;
	var decimal=0;
	var degrees=0;
	var minutes=0;
	var seconds=0;
	
	switch (dms.substr(dms.length-1, 1).toUpperCase()) {
		case 'N':
		case 'E':
			dms = dms.substr(0, dms.length-1);
			break;
		case 'S':
		case 'W':
			factor = -1;
			dms = dms.substr(0, dms.length-1);
			break;
		default: // No letter at the end (or wrong letter).
			break;
	}

	if (dms.length == 6) {
		degrees=parseInt(dms.substr(0,2), 10);
		minutes=parseInt(dms.substr(2,2), 10);
		seconds=parseInt(dms.substr(4,2), 10);
	} else if (dms.length == 7) {
		degrees=parseInt(dms.substr(0,3), 10);
		minutes=parseInt(dms.substr(3,2), 10);
		seconds=parseInt(dms.substr(5,2), 10);
	}
	else {
		debug_log("ERROR: DMS coordinate does not look valid!");
	}
		
	decimal = factor*(degrees+(minutes*60+seconds)/3600);
	return decimal;
}



/*
 * decimal -> 6 numbers + N/S
 * 
 */
function Decimal_to_DMS_lat(decimal) {
	var d;
	var m;
	var s;
	var sign = "N";
	if (decimal < 0) {
		sign = "S";
	}
	d = parseInt(decimal);
	decimal -= d;
	decimal *= 60;
	m = parseInt( decimal );
	decimal -= m;
	decimal *= 60;
	s = Math.round(decimal);
	if (s==60) {
		s = 0;
		m += 1;
	}
	if (m==60) {
		m = 0;
		d += 1;
	}
	
	return addPrefixDigits( d.toString(), "0", 2) +
			addPrefixDigits( m.toString(), "0", 2) +
			addPrefixDigits( s.toString(), "0", 2) + sign;
}

/*
 * decimal -> 7 numbers + E/W
 * 
 */
function Decimal_to_DMS_lon(decimal) {
	var d;
	var m;
	var s;
	var sign = "E";
	if (decimal < 0) {
		sign = "W";
	}
	d = parseInt(decimal);
	decimal -= d;
	decimal *= 60;
	m = parseInt( decimal );
	decimal -= m;
	decimal *= 60;
	s = Math.round(decimal);
	if (s==60) {
		s = 0;
		m += 1;
	}
	if (m==60) {
		m = 0;
		d += 1;
	}
	
	return addPrefixDigits( d.toString(), "0", 3) +
			addPrefixDigits( m.toString(), "0", 2) +
			addPrefixDigits( s.toString(), "0", 2) + sign;
}


function Waypoint(name, lat, lon) {
	this.name = name;
	this.lat = lat;
	this.lon = lon;
	this.distance = 0;
}

function toRad(v) {
	return v * Math.PI / 180;
}

function calcDistanceFrom(lat1, lon1, lat2, lon2) {
	var R = 6371; // km
	var dLat = toRad(lat2-lat1);
	var dLon = toRad(lon2-lon1);
	lat1 = toRad(lat1);
	lat2 = toRad(lat2);
	
	var a = Math.sin(dLat/2) * Math.sin(dLat/2) +
		Math.sin(dLon/2) * Math.sin(dLon/2) * Math.cos(lat1) * Math.cos(lat2);
	var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)); 
	var d = R * c;
	return d;
}

Waypoint.prototype.getDistance = function () {
	return this.distance;
};

//http://www.movable-type.co.uk/scripts/latlong.html
//'haversine' formula
Waypoint.prototype.calcDistanceFrom = function (lat, lon) {
	this.distance = calcDistanceFrom(this.lat, this.lon, lat, lon);
};

Aerodrome.prototype = new Waypoint();
Aerodrome.prototype.constructor = Aerodrome;

function Aerodrome(name, icao, lat, lon, atc, acc, vfrPointArray) {
	Waypoint.call(this, name, DMS_to_Decimal(lat), DMS_to_Decimal(lon));
	this.latStr = DMS_to_DM(lat);
	this.lonStr = DMS_to_DM(lon);
	this.icao = icao;
	this.atc = atc;
	this.acc = acc;
	this.vfrPoints = vfrPointArray;
}


function waypointDistanceSort(a, b) {
	return a.distance - b.distance;
}


function vfrPortXmlResponseHandler() {
	//debug_log( "vfrPortXmlResponseHandler - readyState=" + this.readyState );
	if (this.readyState == this.DONE || this.readyState == 4) {
		//debug_log( "vfrPortXmlResponseHandler - status=" + this.status );
		if (this.status == 200 && this.responseXML !== null ) { //&& this.responseXML.getElementById('test').textContent
			// success!
			vfrPortReadyHandler(this.responseXML);
			return;
		}
		// something went wrong
		debug_log( "ERROR: vfrPortXmlResponseHandler - error: status=" + this.status );
	}
}

function aerodromeXmlResponseHandler() {
	//debug_log( "aerodromeXmlResponseHandler - readyState=" + this.readyState );
	if (this.readyState == this.DONE || this.readyState == 4) {
		//debug_log( "aerodromeXmlResponseHandler - status=" + this.status );
		if (this.status == 200 && this.responseXML !== null ) { //&& this.responseXML.getElementById('test').textContent
			debug_timestamp("aerodromeXml loaded");

			// success!
			aerodromeReadyHandler(this.responseXML);
			return;
		}
		// something went wrong
		debug_log( "ERROR: aerodromeXmlResponseHandler - error: status=" + this.status );
	}
}

function zzzzFieldXmlResponseHandler() {
	//debug_log( "zzzzFieldXmlResponseHandler - readyState=" + this.readyState );
	if (this.readyState == this.DONE || this.readyState == 4) {
		//debug_log( "vfrPortXmlResponseHandler - status=" + this.status );
		if (this.status == 200 && this.responseXML !== null ) { //&& this.responseXML.getElementById('test').textContent
			// success!
			zzzzFieldReadyHandler(this.responseXML);
			return;
		}
		// something went wrong
		debug_log( "ERROR: zzzzFieldXmlResponseHandler - error: status=" + this.status );
	}
}


function loadXMLDoc(filename, handler) {
	var xhttp;
	if (window.XMLHttpRequest)
	{
		xhttp=new XMLHttpRequest();
	}
	else // IE 5/6
	{
		xhttp=new ActiveXObject("Microsoft.XMLHTTP");
		debug_log( "going IE way");
	}
	
	xhttp.onreadystatechange=handler;
	
	// IE needs false
	// Nokia browser needs true
	// others works with both
	// Solution: works also in IE when not loading files parallel.
	xhttp.open("GET",filename, true);
	xhttp.send();
}

function vfrPortReadyHandler(xmlDoc) {
	try {
		var metadata = xmlDoc.getElementsByTagName("metadata");
		if (metadata.length >0) {
			var dateStr = metadata[0].getElementsByTagName("time")[0].childNodes[0].nodeValue;
			var d = new Date(dateStr);
			//debug_log( "VFR ilmoittautumispisteet päivätty: " + d.toLocaleDateString() );
			debug_log( "VFR ilmoittautumispisteet päivätty: " + d.getFullYear() +"-"+ (d.getMonth()+1) +"-"+ d.getDate() );
		}
	} catch(err) {
		debug_log("Could not read xml date: " + err);
	}

	var wpt_list = xmlDoc.getElementsByTagName("wpt");
	
	VfrRepArray = new Array();
	
	for (var wpt=0; wpt<wpt_list.length; ++wpt) {
		var wptName = wpt_list[wpt].getElementsByTagName("name")[0].childNodes[0].nodeValue;
		var desc = wpt_list[wpt].getElementsByTagName("desc")[0].childNodes[0].nodeValue;
		if (desc == "Compulsory") {
			var lat = wpt_list[wpt].attributes.getNamedItem("lat").value; // FIXED nodeValue -> value
			var lon = wpt_list[wpt].attributes.getNamedItem("lon").value; // FIXED nodeValue -> value
			
			VfrRepArray.push(new Waypoint(wptName, lat, lon));
		}
	}
	debug_log( "=> " + VfrRepArray.length + " VFR ilmoittautumispistettä.");

	//continueIfEverythingIsReady();  moved to end of zzzzFieldReadyHandler
	
	//debug_log( "Loading unofficial airfields...");
	loadXMLDoc(ZZZZFieldsFilename, zzzzFieldXmlResponseHandler);
}

function aerodromeReadyHandler(xmlDoc) {
	debug_timestamp("aerodromeReadyHandler start");
	try {
		var gpx_list = xmlDoc.getElementsByTagName("gpx");
		if (gpx_list.length >0) {
			debug_log( "Lentokenttätiedot päivätty: " + gpx_list[0].attributes.getNamedItem("created").value); // FIXED nodeValue -> value
		}
	} catch(err) {
		debug_log("Could not read xml date: " + err);
	}
	
	try {
		var ad_list = xmlDoc.getElementsByTagName("aerodrome");
		
		OfficialAerodromeArray = new Array();

		// Add ZZZZ
		OfficialAerodromeArray.push(new Aerodrome("Epävirallinen", UNOFFICIAL_AERODROME,
				"000000N", 
				"0000000E",
				"no",
				NOTE_TO_ADD_ACC_FREQ_STR,
				new Array() ));

		for (var i=0; i<ad_list.length; ++i) {
			var name = ad_list[i].getElementsByTagName("name")[0].childNodes[0].nodeValue;
			var icao = ad_list[i].getElementsByTagName("icao")[0].childNodes[0].nodeValue;
			var atc = ad_list[i].getElementsByTagName("atc")[0].childNodes[0].nodeValue;
			var tmp_acc = ad_list[i].getElementsByTagName("acc")[0].childNodes[0].nodeValue;
			var acc = tmp_acc.replace(".", " ");
			//debug_log( tmp_acc + " -> " + acc );


			var lat = ad_list[i].attributes.getNamedItem("lat").value; // FIXED nodeValue -> value
			var lon = ad_list[i].attributes.getNamedItem("lon").value; // FIXED nodeValue -> value
			
			var vfrPoints = ad_list[i].getElementsByTagName("vfrpoint");
			var vfrPointsArray = new Array();
			for (var j=0; j<vfrPoints.length; ++j) {
				vfrPointsArray.push( vfrPoints[j].childNodes[0].nodeValue);
			}
			
			//debug_log("new Aerodrome:" + name + " - " + vfrPointsArray);
			OfficialAerodromeArray.push(new Aerodrome(name, icao, 
					//DMS_to_Decimal(lat), 
					//DMS_to_Decimal(lon),
					lat, lon,
					atc,
					acc,
					vfrPointsArray));
		}
	} catch(err) {
		alert(err);
	}

	debug_log( "=> " + OfficialAerodromeArray.length + " lentokenttää.");
	loadXMLDoc(VFRPortFilename, vfrPortXmlResponseHandler);

	// removed because we continue after VFR port file loading.
	//continueIfEverythingIsReady();
	debug_timestamp("aerodromeReadyHandler end");
}


function zzzzFieldReadyHandler(xmlDoc) {
	//debug_log("zzzzFieldReadyHandler");
	
	try {
		var gpx_list = xmlDoc.getElementsByTagName("gpx");
		if (gpx_list.length >0) {
			debug_log( "Epävirallisten lentopaikkojen tiedot päivätty: " + gpx_list[0].attributes.getNamedItem("created").value); // FIXED nodeValue -> value
		}
	} catch(err) {
		debug_log("Could not read xml date: " + err);
	}
	
	try {
		var ad_list = xmlDoc.getElementsByTagName("aerodrome");
		
		ZZZZFieldArray = new Array();

		for (var i=0; i<ad_list.length; ++i) {
			var name = ad_list[i].getElementsByTagName("name")[0].childNodes[0].nodeValue;
			var icao = ad_list[i].getElementsByTagName("icao")[0].childNodes[0].nodeValue;
			var atc = ad_list[i].getElementsByTagName("atc")[0].childNodes[0].nodeValue;
			var tmp_acc = ad_list[i].getElementsByTagName("acc")[0].childNodes[0].nodeValue;
			var acc = tmp_acc.replace(".", " ");
			//debug_log( tmp_acc + " -> " + acc );

			var lat = ad_list[i].attributes.getNamedItem("lat").value; // FIXED nodeValue -> value
			var lon = ad_list[i].attributes.getNamedItem("lon").value; // FIXED nodeValue -> value
			
			var vfrPoints = ad_list[i].getElementsByTagName("vfrpoint");
			var vfrPointsArray = new Array();
			
			//debug_log("new ZZZZ Field:" + name );
			ZZZZFieldArray.push(new Aerodrome(name, icao, 
					//DMS_to_Decimal(lat), 
					//DMS_to_Decimal(lon),
					lat, lon,
					atc,
					acc,
					vfrPointsArray));
		}
	} catch(err) {
		alert(err);
	}

	debug_log( "=> " + ZZZZFieldArray.length + " epävirallista lentopaikkaa.");
	//OfficialAerodromeArray = OfficialAerodromeArray.concat(ZZZZFieldArray);
	
	continueIfEverythingIsReady();
}





function removeOptions(elSelect) {
	//debug_log("removeOptions()");
	
	while (elSelect.length > 0) {
		elSelect.remove(0);
	}
}

function appendOption(elSelect, text, value) {
	//debug_log("appendOption()");
	var elOptNew = document.createElement('option');
	elOptNew.text = text;
	elOptNew.value = value;
	
	try {
		elSelect.add(elOptNew, null); // standards compliant; doesn't work in IE?
	}
	catch(ex) {
		//debug_log("appendOption() catch for IE done");
		elSelect.add(elOptNew); // IE only
	}
}


/*
function getAerodromeByName(aerodrome) {
	debug_log("OBSOLETE: getAerodromeByName(): " + aerodrome);
	if (CurrentAerodromeArray === undefined) {
		debug_log("NOTE: getAerodromeByName(): CurrentAerodromeArray not yet loaded");
		return null;
	}
	for (var i=0; i<CurrentAerodromeArray.length; ++i) {
		if (aerodrome == CurrentAerodromeArray[i].icao) {
			return CurrentAerodromeArray[i];
		}
	}
	debug_log("ERROR: getAerodromeByName(): " + aerodrome + " not found.");
	return null;
}
*/

function getAerodromeByIndex(index) {
	//debug_log("NEW: getAerodromeByIndex(): " + index);
	if (CurrentAerodromeArray === undefined) {
		debug_log("NOTE: getAerodromeByIndex(): CurrentAerodromeArray not yet loaded");
		return null;
	}
	if (index>=CurrentAerodromeArray.length) {
		debug_log("ERROR: getAerodromeByIndex(): index " + index + " too big. CurrentAerodromeArray.length=" + CurrentAerodromeArray.length);
		return null;
	}
	
	//debug_log("NEW: getAerodromeByIndex(): found " + CurrentAerodromeArray[index].icao + ", " + CurrentAerodromeArray[index].name);
	return CurrentAerodromeArray[index];
}


function getVfrWayPointByName( name ) {
	if (VfrRepArray === undefined) {
		//debug_log("NOTE: getVfrWayPointByName(): VfrRepArray not yet loaded");
		return null;
	}

	for (var wptInd=0; wptInd<VfrRepArray.length; ++wptInd) {
		if (name == VfrRepArray[wptInd].name) {
			return VfrRepArray[wptInd];
		}
	}
	return null;
}


function getVfrWayPointsByName( names ) {
	var array=new Array();
	for (var nameInd=0; nameInd<names.length; ++nameInd) {
		var wpt = getVfrWayPointByName(names[nameInd]);
		if (wpt !== null) {
			array.push( wpt );
		}
	}
	return array;
}



function PopulateSelections() {
	//debug_log("PopulateSelections() - OfficialAerodromeArray.length=" + OfficialAerodromeArray.length);
	var elSelectDep = document.getElementById('departure');
	var elSelectDest = document.getElementById('destination');
	
	removeOptions(elSelectDep);
	removeOptions(elSelectDest);
	
	// This is because we come here first time before location update.
	if (CurrentAerodromeArray === undefined) {
		CurrentAerodromeArray = OfficialAerodromeArray;
	}

	// FIXED change km to NM if speed unit is KT?
	var aircraftSpeedUnit = document.getElementById("aircraftSpeedUnit").value;
	var distanceFactor=999;
	var distanceUnitText = "";
	switch (aircraftSpeedUnit) {
		case "K": // kilometers per hour
			distanceFactor=1.0;
			distanceUnitText = "km";
			break;
		case "N": // knots
			distanceFactor=1.0/1.852;
			distanceUnitText = "NM";
			break;
		/*default:
			break;*/
	}
	
	for (var i=0; i<CurrentAerodromeArray.length; ++i) {
		var textStr = CurrentAerodromeArray[i].icao + " (" + CurrentAerodromeArray[i].name;
		if (Math.round(CurrentAerodromeArray[i].distance) !== 0) {
			textStr += ", " + Math.round(CurrentAerodromeArray[i].distance * distanceFactor) + " " + distanceUnitText;
		}
		textStr += ")";
		appendOption(elSelectDep, textStr, i);
		appendOption(elSelectDest, textStr, i);
	}
	elSelectDep.selectedIndex = 1;
	elSelectDest.selectedIndex = 1;
}


function onChangeFlightLv() {
	var flight_level_elem = document.getElementById("flight_level");
	flight_level_elem.value = "";
	
	var flight_lv = document.getElementById("flight_lv").value;
	switch (flight_lv) {
		case "F": // 3 num
		case "A": // 3 num
			flight_level_elem.setAttribute("maxlength", 3);
			// show flight_level
			//document.getElementById("flight_level_container").style.display = '';
			$('#flight_level_container').slideDown();
			break;
			
		case "S": // 4 num
		case "M": // 4 num
			flight_level_elem.setAttribute("maxlength", 4);
			// show flight_level
			//document.getElementById("flight_level_container").style.display = '';
			$('#flight_level_container').slideDown();
			break;
			
		case "VFR":
			// hide flight_level
			//document.getElementById("flight_level_container").style.display = 'none';
			$('#flight_level_container').slideUp();
			break;
	}

}

// 
function onChangeFlightLevel() {
	
	var flight_level = document.getElementById("flight_level").value;
	var flight_lv = document.getElementById("flight_lv").value;
	switch (flight_lv) {
		case "F": // 3 num
		case "A": // 3 num
			document.getElementById("flight_level").value = addPrefixDigits(flight_level , "0", 3);
			break;
		case "S": // 4 num
		case "M": // 4 num
			document.getElementById("flight_level").value = addPrefixDigits(flight_level , "0", 4);
			break;
		//case "VFR":
	}
}

// Support for multiple aircrafts
/*
 * + localstoragen latausvaiheessa tarkistetaan onko vanha data käytössä
 *   +-> konvertoidaan uuteen muotoon, poistetaan vanha data
 * + currentSettingsId
 * + aircraftSettingsTable
 * + listasta valittaessa päivitetään id jota käytetään
 * + luettaessa käytetään oikeaa id:tä
 * + kirjoitettaessa käytetään oikeaa id:tä
 * + select lista päivitetään 
 *     + tablen perusteella + "Uusi kone"
 *     + alun latausvaiheessa
 *     + onChange tunnus
 *     + refresh
 * + kentät tyhjennetään 
 *     + asetuksia vaihtaessa
 *     + uutta konetta tehdessä
 * 
 */

function clearAircraftSettingsFields() {
	//debug_log("clearAircraftSettingsFields()");
	document.getElementById("aircraftIdentification").value = "";
	document.getElementById("aircraftType").value = "";
	document.getElementById("equipment").value = "";
	document.getElementById("equipmentPBN").value = "";
	document.getElementById("ssr").value = "C";
	document.getElementById("aircraftSpeedUnit").value = "K";
	document.getElementById("aircraftSpeed").value = "";
	document.getElementById("aircraftColor").value = "";
	//try {
	$('#ssr').selectmenu('refresh');
	$('#aircraftSpeedUnit').selectmenu('refresh');
	//} catch(err) { } // ignore error (it happens in first onload)
}

function updateAircraftSelectionList() {
	//debug_log("updateAircraftSelectionList()");
	
	var table = localStorage.getItem("aircraftSettingsTable");
	if (table == null) {
		debug_log("ERROR: updateAircraftSelectionList() - table is null");
		return;
	}
	table = table.split(',');
	
	var listElem = document.getElementById('aircraftSettingsList');
	removeOptions(listElem);
	
	var currentId = localStorage.getItem( "currentSettingsId");
	var currentIndex = 0;
	
	for (var i=0; i<table.length; ++i) {
		var id = table[i];
		if (id == currentId) {
			currentIndex = i;
		}
		var aircraftIdentification = localStorage.getItem( id + "_aircraftIdentification");
		if (aircraftIdentification == null) {
			aircraftIdentification = "Nimetön";
		}
		appendOption(listElem, aircraftIdentification, id);
	}
	appendOption(listElem, "Lisää kone", "NewAircraft");

	listElem.selectedIndex = currentIndex;
	
	try {
		$('#aircraftSettingsList').selectmenu('refresh');
	} catch(err) { } // ignore error (it happens in first onload)
}

function onChangeAircraftSettings() {
	//debug_log("onChangeAircraftSettings()");
	var selectedAircraft = document.getElementById("aircraftSettingsList").value;

	clearAircraftSettingsFields();
	if (selectedAircraft == "NewAircraft") {
		addNewAircraftSettings();
	} else {
		//debug_log("onChangeAircraftSettings() - selected id: " + selectedAircraft );
		// update current id
		localStorage.setItem( "currentSettingsId", selectedAircraft);
		
		// Load current data
		updateFromLocalStorage();
		// And update correct distance units to main page
		onChangeAircraftSpeed();
	}

	updateAircraftIdentificationToMainpage();
}

function removeAircraftDataWithPrefix( prefix ) {
	//debug_log("removeAircraftDataWithPrefix() - " + prefix);
	
	localStorage.removeItem( prefix + "aircraftIdentification");
	localStorage.removeItem( prefix + "aircraftType");
	localStorage.removeItem( prefix + "equipment");
	localStorage.removeItem( prefix + "equipmentPBN");
	localStorage.removeItem( prefix + "ssr");
	localStorage.removeItem( prefix + "aircraftSpeedUnit");
	localStorage.removeItem( prefix + "aircraftSpeed");
	localStorage.removeItem( prefix + "aircraftColor");
}

function deleteCurrentAircraftSettings() {
	//debug_log("deleteCurrentAircraftSettings()");
	
	var currentId = localStorage.getItem( "currentSettingsId");

	// remove id from list
	var table = localStorage.getItem("aircraftSettingsTable");
	if (table == null) {
		debug_log("ERROR: deleteCurrentAircraftSettings() - table == null");
		return;
	}
	table = table.split(',');
	
	var index=0;
	if (table.length > 1) {
		index = table.indexOf(currentId);
		table.splice(index, 1);
		if (index>0) {
			index--;
		}
		localStorage.setItem( "aircraftSettingsTable", table);
	}
	
	// remove data from id
	removeAircraftDataWithPrefix( currentId + "_" );
	
	// päivitä id
	currentId = table[index];
	localStorage.setItem( "currentSettingsId", currentId);

	updateAircraftSelectionList();
	onChangeAircraftSettings();
}

function addNewAircraftSettings() {
	//debug_log("addNewAircraftSettings()");
	var table = localStorage.getItem("aircraftSettingsTable");
	if (table == null) {
		debug_log("ERROR: addNewAircraftSettings() - table == null");
		return;
	} else {
		table = table.split(',');
	}
	
	// generate new Id for settings
	var newId = 0;
	if (table.length > 0) {
		newId = Number(table[table.length-1])+1;
	}
	//debug_log("addNewAircraftSettings() - newId=" + newId );
	
	// update table with new Id
	table.push( newId );
	localStorage.setItem( "aircraftSettingsTable", table);
	
	localStorage.setItem( "currentSettingsId", newId);
	
	//debug_log("addNewAircraftSettings() - " + table );
}

function updateAircraftIdentificationToMainpage() {
	var identification = document.getElementById("aircraftIdentification").value;
	if (identification.length !== 0) {
		document.getElementById("selectedPlane").innerHTML = "Kone: " + identification;
	}
	else {
		document.getElementById("selectedPlane").innerHTML = "";
	}
}

function onChangeAircraftIdentification() {
	var currentId = localStorage.getItem( "currentSettingsId");
	localStorage.setItem( currentId + "_aircraftIdentification", document.getElementById("aircraftIdentification").value);
	
	updateAircraftSelectionList();
	updateAircraftIdentificationToMainpage();
}

function onChangeAircraftType() {
	var currentId = localStorage.getItem( "currentSettingsId");
	localStorage.setItem( currentId + "_aircraftType", document.getElementById("aircraftType").value);
}


function isPbnNeeded() {
	var equipment = document.getElementById("equipment").value;
	
	if (equipment.indexOf("R") !== -1 || equipment.indexOf("r") !== -1) {
		return true;
	}
	return false;
}

function onChangeEquipment() {
	//debug_log("onChangeEquipment");
	var currentId = localStorage.getItem( "currentSettingsId");
	var equipment = document.getElementById("equipment").value;
	localStorage.setItem( currentId + "_equipment", equipment);
	onChangeSsr();
	
	/*
	 * Find R from equipments
	 *   - yes -> open PBN field
	 *   - no -> clear, store and hide PBN
	 */
	if (isPbnNeeded()) {
		// show PBN field
		//debug_log("onChangeEquipment - R tieto löytyi");
		//document.getElementById("equipment_PBN_container").style.display = '';
		$('#equipment_PBN_container').slideDown();
	}
	else {
		//debug_log("onChangeEquipment - ei R tietoa");
		// clear and store
		document.getElementById("equipmentPBN").value = "";
		onChangeEquipmentPBN();
		// hide PBN
		//document.getElementById("equipment_PBN_container").style.display = 'none';
		$('#equipment_PBN_container').slideUp();
	}
}

function onChangeSsr() {
	var currentId = localStorage.getItem( "currentSettingsId");
	localStorage.setItem( currentId + "_ssr", document.getElementById("ssr").value);
}

function onChangeEquipmentPBN() {
	var currentId = localStorage.getItem( "currentSettingsId");
	localStorage.setItem( currentId + "_equipmentPBN", document.getElementById("equipmentPBN").value);
}

function onChangeAircraftSpeed() {
	var speed = document.getElementById("aircraftSpeed").value;
	speed = addPrefixDigits(speed, "0", 4);
	document.getElementById("aircraftSpeed").value = speed;
	
	var currentId = localStorage.getItem( "currentSettingsId");
	localStorage.setItem( currentId + "_aircraftSpeedUnit", document.getElementById("aircraftSpeedUnit").value);
	localStorage.setItem( currentId + "_aircraftSpeed", speed);

	// Update distance units in ad selection lists
	PopulateSelections();
	onChangeDepartureAd();
	onChangeDestinationAd();

	//$('#departure').selectmenu('refresh');
	//$('#destination').selectmenu('refresh');

	//createFlyingTimeTable();
}

function onChangePilot() {
	localStorage.setItem( "pilot", document.getElementById("pilot").value);
}

function onChangePilotTel() {
	localStorage.setItem( "pilotTel", document.getElementById("pilotTel").value);
}

function onChangeAircraftColor() {
	var currentId = localStorage.getItem( "currentSettingsId");
	localStorage.setItem( currentId + "_aircraftColor", document.getElementById("aircraftColor").value);
}

function onChangeZzzzFieldsEnabled() {
	localStorage.setItem( "zzzzFieldsEnabled", document.getElementById("zzzzFieldsEnabled").value);
	handlePositionUpdate(gPosition_lat, gPosition_lon);
}

function convertOldSettings() {
	var newId=0;
	localStorage.setItem( "aircraftSettingsTable", [ newId ] );
	localStorage.setItem( "currentSettingsId", newId );
	
	
	var ident = localStorage.getItem("aircraftIdentification");
	if (ident !== null) {
		localStorage.setItem(newId + "_aircraftIdentification", ident);
	}
	var type = localStorage.getItem("aircraftType");
	if (type !== null) {
		localStorage.setItem(newId + "_aircraftType", type);
	}
	var equipment = localStorage.getItem("equipment");
	if (equipment !== null) {
		localStorage.setItem(newId + "_equipment", equipment);
	}
	var ssr = localStorage.getItem("ssr");
	if (ssr !== null) {
		localStorage.setItem(newId + "_ssr", ssr);
	}
	var speedUnit = localStorage.getItem("aircraftSpeedUnit");
	if (speedUnit !== null) {
		localStorage.setItem(newId + "_aircraftSpeedUnit", speedUnit);
	}
	var speed = localStorage.getItem("aircraftSpeed");
	if (speed !== null) {
		localStorage.setItem(newId + "_aircraftSpeed", speed);
	}
	var color = localStorage.getItem("aircraftColor");
	if (color !== null) {
		localStorage.setItem(newId + "_aircraftColor", color);
	}
	
	// Remove old settings
	removeAircraftDataWithPrefix("");
}


function updateFromLocalStorage() {
	//document.getElementById("aircraftIdentification").value = localStorage.getItem("aircraftIdentification");
	var currentId = localStorage.getItem( "currentSettingsId");
	if (currentId == null) {
		//debug_log("updateFromLocalStorage() - Old settings, converting...");
		convertOldSettings();
		currentId = localStorage.getItem( "currentSettingsId");
	}
	
	var ident = localStorage.getItem(currentId + "_aircraftIdentification");
	if (ident !== null) {
		document.getElementById("aircraftIdentification").value = ident;
	}
	var type = localStorage.getItem(currentId + "_aircraftType");
	if (type !== null) {
		document.getElementById("aircraftType").value = type;
	}
	var equipment = localStorage.getItem(currentId + "_equipment");
	if (equipment === null) {
		//debug_log("updateFromLocalStorage() - force equipment V"); // TODO
		equipment = "V"; //TODO
		localStorage.setItem( currentId + "_equipment", equipment);
	}
	if (equipment !== null) {
		document.getElementById("equipment").value = equipment;
	} 
	
	var ssr = localStorage.getItem(currentId + "_ssr");
	if (ssr !== null) {
		document.getElementById("ssr").value = ssr;
		try {
			$('#ssr').selectmenu('refresh');
		} catch(err) { } // ignore error (it happens in first onload)
	}
	
	if (isPbnNeeded()) {
		// show PBN field
		//debug_log("updateFromLocalStorage - R tieto löytyi");
		//document.getElementById("equipment_PBN_container").style.display = '';
		$('#equipment_PBN_container').slideDown();
	}
	else {
		// hide PBN
		//debug_log("updateFromLocalStorage - ei R tietoa");
		//document.getElementById("equipment_PBN_container").style.display = 'none';
		$('#equipment_PBN_container').slideUp();
	}

	document.getElementById("equipmentPBN").value = "";
	var equipmentPBN = localStorage.getItem(currentId + "_equipmentPBN");
	if (equipmentPBN !== null) {
		document.getElementById("equipmentPBN").value = equipmentPBN;
	}
	
	
	var speedUnit = localStorage.getItem(currentId + "_aircraftSpeedUnit");
	if (speedUnit !== null) {
		document.getElementById("aircraftSpeedUnit").value = speedUnit;
		try {
			$('#aircraftSpeedUnit').selectmenu('refresh');
		} catch(err) { } // ignore error (it happens in first onload)
	}
	var speed = localStorage.getItem(currentId + "_aircraftSpeed");
	if (speed !== null) {
		document.getElementById("aircraftSpeed").value = speed;
	}
	var pilot = localStorage.getItem("pilot");
	if (pilot !== null) {
		document.getElementById("pilot").value = pilot;
	}
	var tel = localStorage.getItem("pilotTel");
	if (tel !== null) {
		document.getElementById("pilotTel").value = tel;
	}
	var color = localStorage.getItem(currentId + "_aircraftColor");
	if (color !== null) {
		document.getElementById("aircraftColor").value = color;
	}
	var zzzzEnabled = localStorage.getItem("zzzzFieldsEnabled");
	if (zzzzEnabled !== null) {
		document.getElementById("zzzzFieldsEnabled").value = zzzzEnabled;
	}
	//createFlyingTimeTable();
	
	updateAircraftSelectionList();
}

function isValid( value ) {
	if (value === undefined) {
		//alert("isValid: undefined");
		return false;
	}
	if (value.length <= 0) {
		return false;
	}
	return true;
}

function isAllSettingsAvailable() {
	try {
		var ident = document.getElementById("aircraftIdentification").value;
		var type = document.getElementById("aircraftType").value;
		var equipment = document.getElementById("equipment").value;
		
		var equipmentPBN = "ok"; // temp value for checking
		if (isPbnNeeded()) {
			equipmentPBN = document.getElementById("equipmentPBN").value;
		}
		var ssr = document.getElementById("ssr").value;
		var speedUnit = document.getElementById("aircraftSpeedUnit").value;
		var speed = document.getElementById("aircraftSpeed").value;
		var pilot = document.getElementById("pilot").value;
		var tel = document.getElementById("pilotTel").value;
		var color = document.getElementById("aircraftColor").value;
		
		if (/*gSelectedFlyingTimeStr===undefined && */ gCalculatedFlyingTimeStr===undefined) { //GlobalFlyingTimeStr
			//alert("GlobalFlyingTimeStr");
			return false;
		}
		
		if ( isValid(ident) &&
			 isValid(type) &&
			 isValid(equipment) &&
			 isValid(ssr) &&
			 isValid(equipmentPBN) && 
			 isValid(speedUnit) &&
			 isValid(speed) &&
			 isValid(pilot) &&
			 isValid(tel) &&
			 isValid(color) ) {
			return true;
		}
		return false;
	} catch(err) {
		return false;
	}
}


function getPlansFromStorage() {
	var storedPlansStr = localStorage.getItem("storedPlans");
	var storedPlans;
	if (storedPlansStr == null) {
		storedPlans = [];
	}
	else {
		storedPlans = JSON.parse(storedPlansStr);
	}
	return storedPlans;
}

function addPlanToStorage(plan) {
	var storedPlans = getPlansFromStorage();
	storedPlans.push(plan);
	
	localStorage.setItem( "storedPlans", JSON.stringify(storedPlans));
}

function deleteCurrentStoredPlan() {
	var storedPlans = getPlansFromStorage();
	var ind = localStorage.getItem('selectedStoredPlanIndex');
	storedPlans.splice(ind, 1);
	localStorage.setItem( "storedPlans", JSON.stringify(storedPlans));
	
	updateStoredPlanList();
}



function removeOldPlansFromStorage() {
	var storedPlans = getPlansFromStorage();
	var newStoredPlans = [];
	
	var now = new Date();
	var hour_in_ms = 1000*60*60;
	var yesterday = new Date();
	yesterday.setTime(now.getTime()-24*hour_in_ms);

	//debug_log("removeOldPlansFromStorage: now=" + now );
	//debug_log("removeOldPlansFromStorage: yesterday=" + yesterday );
	
	for (var i=0; i<storedPlans.length; i++) {
		var takeoffDate = new Date(storedPlans[i].takeoff_time);
		if (takeoffDate >= yesterday) {
			//debug_log("removeOldPlansFromStorage: included=" + takeoffDate );
			newStoredPlans.push(storedPlans[i]);
		}
		else {
			//debug_log("removeOldPlansFromStorage: removed=" + takeoffDate );
		}
	}
	localStorage.setItem( "storedPlans", JSON.stringify(newStoredPlans));
}

function getTimeIn4digits(takeoffDate) {
	//var takeoffDate = new Date(storedPlans[i].takeoff_time);
	
	var timeStr="";
	//var hours = takeoffDate.getUTCHours();
	var hours = takeoffDate.getHours();
	//var minutes = takeoffDate.getUTCMinutes();
	var minutes = takeoffDate.getMinutes();
	
	if (hours<10) timeStr += "0";
	timeStr += hours;
	if (minutes<10) timeStr += "0";
	timeStr += minutes;
	
	return timeStr;
}


function setSelectedStoredPlanIndex(ind) {
	localStorage.setItem('selectedStoredPlanIndex', ind);
}



function updateStoredPlanList() {
	removeOldPlansFromStorage();
	var storedPlans = getPlansFromStorage();
	
	// Clear old list
	$('#storedPlanList').find('li').remove();
	localStorage.removeItem('selectedStoredPlanIndex');
	
	for (var i=0; i<storedPlans.length; i++) {
		var timeStr=getTimeIn4digits(new Date(storedPlans[i].takeoff_time));
		/*var takeoffDate = new Date(storedPlans[i].takeoff_time);
		
		var timeStr="";
		//var hours = takeoffDate.getUTCHours();
		var hours = takeoffDate.getHours();
		//var minutes = takeoffDate.getUTCMinutes();
		var minutes = takeoffDate.getMinutes();
		
		if (hours<10) timeStr += "0";
		timeStr += hours;
		if (minutes<10) timeStr += "0";
		timeStr += minutes;*/

		var route = "";
		if (storedPlans[i].dep_route !== undefined) {
			route += storedPlans[i].dep_route + " ";
		}
		if (storedPlans[i].route !== undefined) {
			route += storedPlans[i].route + " ";
		}
		if (storedPlans[i].dest_route !== undefined) {
			route += storedPlans[i].dest_route;
		}
		
		var text = "<li class='storedPlanListItem'>" //<a href='#'>
			+ "<a href='#page-stored-plan' onClick='setSelectedStoredPlanIndex(" + i + ")'>"
			+ "<h2>"+ storedPlans[i].departure + "-" + storedPlans[i].destination + "</h2>"
			+ "<p class='ui-li-aside'>Lähtöaika:<br><strong>" + timeStr +"</strong> (sa)</p>"
			+ "<p><strong>Reitti: " + route + "</strong></p>"
			+ "<p>Lentoaika: " + storedPlans[i].flight_time + "</p>"
			+ "<p>Päättäminen: " + storedPlans[i].completion_method + "</p>"
			+ "</a>";
		//onclick="onClickFlightPlanLinkButton()"
		//indow.open( flightPlanLink );
		if (storedPlans[i].destination !== UNOFFICIAL_AERODROME) {
			text += "<a href='" + getNotamLink(storedPlans[i].destination) + "' rel='external'>Notam</a>";
			//text += "<a href='#' onclick='window.open(" + getNotamLink(storedPlans[i].destination) + ");' rel='external'>Notam</a>";
		}
		text += "</li>";

		$('#storedPlanList').append( $(text) );
	}
	$('.buttonContainer').hide();
	$("#storedPlanList").listview('refresh');
}

// TODO this should be finally in some document.ready() handler?
function initStoredPlanPageHandler() {
	// jQuery( ".selector" ).on( "pagebeforeshow", function( event ) { ... } )
	// Fill fields for stored plan page
	$('#page-stored-plan').on('pagebeforeshow', function(event) {
		var storedPlans = getPlansFromStorage();
		var ind = localStorage.getItem('selectedStoredPlanIndex');
		$('#storedPlanAircraftIdentification').val( storedPlans[ind].identification );
		
		$('#storedPlanDeparture').val( storedPlans[ind].departure + " "+ storedPlans[ind].dep_name );
		$('#storedPlanDestination').val( storedPlans[ind].destination + " " + storedPlans[ind].dest_name );
		$('#storedPlanRoute').val( storedPlans[ind].dep_route +' '+ storedPlans[ind].route +' '+ storedPlans[ind].dest_route);

		$('#storedPlanFlightLevel').val( storedPlans[ind].flight_level );
		$('#storedPlanTakeoffTime').val( getTimeIn4digits(new Date(storedPlans[ind].takeoff_time)) + " (sa)" );
		$('#storedPlanFlightTime').val( storedPlans[ind].flight_time );
		$('#storedPlanEndurance').val( storedPlans[ind].endurance );
		$('#storedPlanPersons').val( storedPlans[ind].persons );
		$('#storedPlanDepMethod').val( storedPlans[ind].activation_method );
		$('#storedPlanArrMethod').val( storedPlans[ind].completion_method );
		// TODO if destination alkaa !ZZZZ
		//$('#openNotamButton').text("Notam: " + storedPlans[ind].destination); //( "<button onclick='openNotam('" + storedPlans[ind].destination + "')' data-inline='true' data-mini='true'>Notam: " + storedPlans[ind].destination + "</button>");
		//$('#openNotamButton').button('refresh');
		
		if (storedPlans[ind].activation_method !== BY_PHONE_ON_GROUND_STR_WITH_PHONE && 
			storedPlans[ind].completion_method !== BY_PHONE_ON_GROUND_STR_WITH_PHONE) {
			$('#callAccButton').hide();
		}
		else {
			$('#callAccButton').show();
		}
	});
}


function onLoad()
{
	// Check whether we should still load old not-yet-updated files
	var today = new Date();
	var dateOfUpdate = new Date(dateOfUpdateStr);
	if (today.getTime() < dateOfUpdate.getTime()) {
		VFRPortFilename = VFRPortFilename_before_13NOV2014;
		AerodromesFilename = AerodromesFilename_before_13NOV2014;
		ZZZZFieldsFilename = ZZZZFieldsFilename_before_13NOV2014;
	}

	debug_timestamp("aerodromeXml load start");
	loadXMLDoc(AerodromesFilename, aerodromeXmlResponseHandler);

	if (navigator.geolocation) {
		updateCurrentLocation();
	}
	else {
		// Hide updateCurrentLocationButton
		debug_log( "Geolocation ei ole tuettu selaimessa.");
		fakeCurrentLocation();
		document.getElementById("locationUpdateButtonText").innerHTML = "Ei sijaintia";
	}
	
	updateFromLocalStorage();
	onChangeFlightLv();
	
	updateStoredPlanList();

	initStoredPlanPageHandler();

}


function fakeCurrentLocation() {
	debug_log("Todellista sijaintia ei saada. Käytetään sijaintina Tamperetta...");
	gPosition_lat = 61.49816;
	gPosition_lon = 23.761055;
	
	handlePositionUpdate(gPosition_lat, gPosition_lon);
}


function updateCurrentLocation() {
	//debug_log("updateCurrentLocation");
	if (navigator.geolocation) {
		//debug_log("geolocation is supported");
		document.getElementById("locationUpdateButtonText").innerHTML = "Sijainti...";
		navigator.geolocation.getCurrentPosition(handlePositionUpdateCallback, handlePositionError );
	}
}


function sortNearestFirst(array, lat, lon) {
	//debug_log("sortNearestFirst");
	for (var ind=0; ind<array.length; ++ind) {
		array[ind].calcDistanceFrom(lat, lon);
		//debug_log("sortNearestFirst - " + array[ind].name + " " + array[ind].distance + " km");
	}
	array.sort(waypointDistanceSort);
	return array;
}


function fillVfrWaypointSelectionData(elSelection, dep, dest) {
	//debug_log("fillVfrWaypointSelectionData");
	removeOptions(elSelection);

	var vfrWaypoints = getVfrWayPointsByName( dep.vfrPoints );
	if (vfrWaypoints.length == 0) {
		//debug_log("fillVfrWaypointSelectionData - vfrWaypoints not yet ready");
		return;
	}
	sortNearestFirst(vfrWaypoints, dest.lat, dest.lon);

	// Empty ref point
	appendOption(elSelection, "-", "");
	
	for (var i=0; i<vfrWaypoints.length; ++i) {
		appendOption(elSelection, vfrWaypoints[i].name, vfrWaypoints[i].name);
	}
	
	// For local flight, use empty as default ref point.
	// for other flights, preselect first actual ref point
	if (dep!==dest) {
		elSelection.selectedIndex = 1;
	}
}


// 	x		torniin
// 		x	puhelimella maassa
// 		x	radiolla ilmassa
function updatePlanActivationMethods(elSelection, ad) {
	//debug_log("updatePlanActivationMethods");
	removeOptions(elSelection);

	if (ad.atc == "yes") {
		appendOption(elSelection, BY_TWR, "twr");
	}
	appendOption(elSelection, "Puhelimella maassa (ACC)", "phoneOnGound");
	appendOption(elSelection, "Radiolla ilmassa (ACC, " + ad.acc + ")", "rtfOnAir");
}


function onChangeDepartureAd() {
	//debug_log("onChangeDepartureAd");
	var dep=document.getElementById("departure");
	var dest=document.getElementById("destination");
	$('#departure').selectmenu('refresh');

	var depAd = getAerodromeByIndex(dep.value);
	document.getElementById("route_departure_ad").innerHTML = depAd.icao + " (" + depAd.name + ")";

	var depAerodrome = getAerodromeByIndex( dep.value );
	var destAerodrome = getAerodromeByIndex( dest.value );
	
	fillVfrWaypointSelectionData(document.getElementById("route_departure_rep"), depAerodrome, destAerodrome);
	fillVfrWaypointSelectionData(document.getElementById("route_destination_rep"), destAerodrome, depAerodrome);
	$('#route_departure_rep').selectmenu('refresh');
	$('#route_destination_rep').selectmenu('refresh');
	
	updatePlanActivationMethods( document.getElementById("planActivationMethod"), depAerodrome );
	$('#planActivationMethod').selectmenu('refresh');
	
	createFlyingTimeTable();
	
	if (dep.value == UNOFFICIAL_AERODROME_INDEX) {
		//document.getElementById("zzzz_departure_container").style.display = '';
		$('#zzzz_departure_container').slideDown();
	}
	else {
		//document.getElementById("zzzz_departure_container").style.display = 'none';
		$('#zzzz_departure_container').slideUp();
	}
}

function onChangeDestinationAd() {
	//debug_log("onChangeDestinationAd");
	var dep=document.getElementById("departure");
	var dest=document.getElementById("destination");
	$('#destination').selectmenu('refresh');

	var destAd = getAerodromeByIndex(dest.value);
	document.getElementById("route_destination_ad").innerHTML = destAd.icao + " (" + destAd.name + ")";
	
	var depAerodrome = getAerodromeByIndex( dep.value );
	var destAerodrome = getAerodromeByIndex( dest.value );

	fillVfrWaypointSelectionData(document.getElementById("route_departure_rep"), depAerodrome, destAerodrome);
	fillVfrWaypointSelectionData(document.getElementById("route_destination_rep"), destAerodrome, depAerodrome);
	$('#route_departure_rep').selectmenu('refresh');
	$('#route_destination_rep').selectmenu('refresh');

	updatePlanActivationMethods( document.getElementById("planCompletionMethod"), destAerodrome );
	$('#planCompletionMethod').selectmenu('refresh');

	createFlyingTimeTable();
	
	if (dest.value == UNOFFICIAL_AERODROME_INDEX) {
		//document.getElementById("zzzz_destination_container").style.display = '';
		$('#zzzz_destination_container').slideDown();
		setFlightTimeOverride(true);
	}
	else {
		//document.getElementById("zzzz_destination_container").style.display = 'none';
		$('#zzzz_destination_container').slideUp();
		setFlightTimeOverride(false);
	}
}

// distance in km
// speed in km/h
// return time in minutes
function getTimeFromDistance(distance, speed) {
	if (speed > 0) {
		return Math.round(distance/speed * 60);
	}
	return "Tarkista lentonopeus!";
}

function timeNext5mins(flyingTime) {
	//debug_log("timeNext5mins() - in " + flyingTime );
	var num=5;
	flyingTime = Math.ceil(flyingTime/num)*num;
	
	//debug_log("timeNext5mins() - out " + flyingTime );
	return flyingTime;
}

// Convert flying time in minutes to string (HHMM)
function convertFlyingTimeToString( flyingTime )
{
	//debug_log("convertFlyingTimeToString() - in " + flyingTime );
	var flyingTimeMinutes = flyingTime%60;
	var flyingTimeHours = (flyingTime-flyingTimeMinutes)/60;
	
	var flyingTimeStr="";
	if (flyingTimeHours<10) {
		flyingTimeStr += "0";
	}
	flyingTimeStr += flyingTimeHours;
	
	if (flyingTimeMinutes<10) {
		flyingTimeStr += "0";
	}
	flyingTimeStr += flyingTimeMinutes;
	//debug_log("convertFlyingTimeToString() - out " + flyingTimeStr );
	return flyingTimeStr;
}

/*function getSpeedUnitText() {
	var aircraftSpeedUnit = document.getElementById("aircraftSpeedUnit").value;
	switch (aircraftSpeedUnit) {
		case "K": // kilometers
			return "km";
		case "N": // nautical miles
			return "NM";
		default:
			debug_log("Error: getSpeedUnitText() - unknown aircraftSpeedUnit: " + aircraftSpeedUnit);
	}
	return "unknown";
}*/

// Return distance in km or NM.
function getDistanceInCurrentUnit( dist ) {
	var aircraftSpeedUnit = document.getElementById("aircraftSpeedUnit").value;
	switch (aircraftSpeedUnit) {
		case "K": // kilometers
			return Number(dist);
		case "N": // nautical miles
			return Number(dist) * 1000/1852;
		default:
			debug_log("Error: getDistanceInCurrentUnit() - unknown aircraftSpeedUnit: " + aircraftSpeedUnit);
	}
	return "unknown";
}

function createFlyingTimeTable() {
	//debug_log("createFlyingTimeTable()");
	
	updateAircraftIdentificationToMainpage();

	var aircraftSpeedUnit = document.getElementById("aircraftSpeedUnit").value;
	var aircraftSpeed = document.getElementById("aircraftSpeed").value;
	var distanceUnitText="";
		
	switch (aircraftSpeedUnit) {
		case "K": // kilometers per hour
			aircraftSpeed = Number(aircraftSpeed);
			distanceUnitText = "km";
			break;
		case "N": // knots
			aircraftSpeed = Number(aircraftSpeed) * 1852/1000;
			distanceUnitText = "NM";
			break;
		default:
			debug_log("Error: createFlyingTimeTable() - unknown aircraftSpeedUnit: " + aircraftSpeedUnit);
			aircraftSpeed = Number(aircraftSpeed);
			break;
	}
	
	if (aircraftSpeed == 0) {
		//document.getElementById("flyingTime").innerHTML = '<a href="#page-plan-settings" class="ui-btn-right">Täytä Perustiedot sivulle puuttuvat tiedot!</a>';
		document.getElementById("flyingTime").innerHTML = '<a href="#page-plan-settings">Täytä Perustiedot sivulle puuttuvat tiedot!</a>';
		
		//debug_log("Täytä Perustiedot sivulle puuttuvat tiedot!");
		return;
	}	
	
	var dep=document.getElementById("departure").value;
	var dep_rep=document.getElementById("route_departure_rep").value;
	var dest_rep=document.getElementById("route_destination_rep").value;
	var dest=document.getElementById("destination").value;
	
	var array=new Array();
	array.push(getAerodromeByIndex(dep));
	array.push(getVfrWayPointByName(dep_rep));
	array.push(getVfrWayPointByName(dest_rep));
	array.push(getAerodromeByIndex(dest));
	
	//var tableBegin = '<table data-role="table" id="flyingTimeTable" data-mode="columntoggle" class="ui-responsive table-stripe" data-column-btn-text="Sarakkeet..."><thead><tr class="ui-bar-d"><th data-priority="persist">paikka</th><th data-priority="2">km</th><th data-priority="1">min</th></tr></thead><tbody>';
	var tableBegin = '<table data-role="table" id="flyingTimeTable" class="table-stripe">';
	tableBegin += '<thead>';
	tableBegin += '<tr class="ui-bar-a">'; // ui-bar-d
	tableBegin += '<th data-priority="persist">paikka</th>';
	tableBegin += '<th data-priority="2">' + distanceUnitText + '</th>';
	
	tableBegin += '<th data-priority="1">min</th>';
	tableBegin += '</tr></thead><tbody>';

	var tableEnd="</tbody></table>";
	var rowBegin="<tr>";
	var rowEnd="</tr>";
	var cellBegin="<td>";
	var cellEnd="</td>";
	var headerCellBegin="<th>";
	var headerCellEnd="</th>";

	var row = rowBegin;
	row += cellBegin + array[0].icao + " (" + array[0].name+ ")" + cellEnd;
	row += cellBegin + "0" + cellEnd;
	row += cellBegin + "0" + cellEnd;
	row += rowEnd;

	var table = tableBegin + row;

	var prev=array[0];
	var totalDist=0;
	for (var i=1; i<array.length; ++i) {
		if (array[i] !== null) {
			var legDist = calcDistanceFrom(prev.lat, prev.lon, array[i].lat, array[i].lon);
			totalDist += legDist;
			
			row = rowBegin;

			if (array[i].icao === undefined) {
				row += cellBegin + array[i].name + cellEnd;
			}
			else {
				row += cellBegin + array[i].icao + " (" + array[i].name+ ")" + cellEnd;
				//row += cellBegin + array[i].icao + cellEnd;
			}
			row += cellBegin + Math.round(getDistanceInCurrentUnit(legDist)) + cellEnd;
			row += cellBegin + getTimeFromDistance(legDist, aircraftSpeed) + cellEnd;
			row += rowEnd;
			
			table += row;
			prev=array[i];
		}
	}
	
	row = rowBegin;
	row += headerCellBegin + "Yhteensä" + headerCellEnd;
	row += headerCellBegin + Math.round(getDistanceInCurrentUnit(totalDist)) + " " + distanceUnitText + headerCellEnd;
	row += headerCellBegin + getTimeFromDistance(totalDist, aircraftSpeed) + " min" + headerCellEnd;
	row += rowEnd;
	
	table += row;
	
	document.getElementById("flyingTime").innerHTML = table;
	
	var flyingTime = getTimeFromDistance(totalDist, aircraftSpeed);

	// Convert flying time in minutes to string (HHMM)
	
	flyingTime = timeNext5mins(flyingTime);
	
	if (flyingTime < 10) {
		flyingTime = 10;
	}

	gCalculatedFlyingTimeStr = convertFlyingTimeToString( flyingTime );
	
	// Hide FlightTimeOverride controls because we just calculated new flight time
	setFlightTimeOverride(false);
}

	// Convert scandinavian letters
function convertScandinavianLetters( str ) {
	var retStr = str;
	retStr = retStr.replace(/[äå]/g, "a");
	retStr = retStr.replace(/[ÄÅ]/g, "A");
	retStr = retStr.replace(/ö/g, "o");
	retStr = retStr.replace(/Ö/g, "O");
	return retStr;
}


function updateFlyingTimeValues() {
	gSelectedFlyingTimeStr = gCalculatedFlyingTimeStr;
	if (getFlightTimeOverride()) {
		var flightTimeOverrideStr="";

		var hourSel = document.getElementsByName("flightTimeHour");
		for(var i = 0; i < hourSel.length; i++) {
			if (hourSel[i].checked == true ) {
				flightTimeOverrideStr = hourSel[i].value;
				break;
			}
		}
		
		var minSel = document.getElementsByName("flightTimeMin");
		for(var i = 0; i < minSel.length; i++) {
			if (minSel[i].checked == true ) {
				flightTimeOverrideStr += minSel[i].value;
				break;
			}
		}
		if (flightTimeOverrideStr.length !== 4) {
			alert("Itse määriteltyyn lentoaikaan täytyy antaa sekä tunnit että minuutit!");
			return false;
		}
		if (Number(flightTimeOverrideStr) < Number(gSelectedFlyingTimeStr)) {
			alert("Itse määritellyksi lentoajaksi ei voi antaa vähempää kuin laskelmassa on laskettu!");
			return false;
		}
		gSelectedFlyingTimeStr = flightTimeOverrideStr;
	}
}


function updateFlightPlanLink() {
	// Get current time and add time offset
	
	var departureTimeHourSelection = document.getElementsByName("departureTimeHour");
	var departureTimeHour=0;
	for(var i = 0; i < departureTimeHourSelection.length; i++) {
		if(departureTimeHourSelection[i].checked) {
			departureTimeHour = Number(departureTimeHourSelection[i].value);
			break;
		}
	}
	var departureTimeMinSelection = document.getElementsByName("departureTimeMin");
	var departureTimeMin=0;
	for(var i = 0; i < departureTimeMinSelection.length; i++) {
		if(departureTimeMinSelection[i].checked) {
			departureTimeMin = Number(departureTimeMinSelection[i].value);
			break;
		}
	}
	if (departureTimeHour + departureTimeMin === 0) {
		alert("Lähtöaika ei voi olla heti.\nMuuta lähtöaika järkeväksi.");
		return false;
	}
	var d = new Date();
	var timeStr="";
	//debug_log("updateFlightPlanLink() - nyt=" + d.getUTCHours() + ":" + d.getUTCMinutes());
	//debug_log("updateFlightPlanLink() - off=" + departureTimeHour + ":" + departureTimeMin);

	d.setMinutes( timeNext5mins( d.getMinutes() ) + departureTimeMin );
	d.setHours( d.getHours() + departureTimeHour);
	var hours = d.getUTCHours();
	var minutes = d.getUTCMinutes();

	//debug_log("updateFlightPlanLink() - ====" + d.getUTCHours() + ":" + d.getUTCMinutes());




	if (hours<10) timeStr += "0";
	timeStr += hours;
	if (minutes<10) timeStr += "0";
	timeStr += minutes;
	
	var linkStart = "http://ais.fi/C/flightplan/efpl_lomake/";
	var linkString = "&id=" + 		document.getElementById("aircraftIdentification").value;
	linkString += "&rules=V"; // + 		document.getElementById("flightRules").value;
	linkString += "&type=G"; // + 		document.getElementById("flightType").value;
	linkString += "&aircraft=" + 	document.getElementById("aircraftType").value;
	linkString += "&cat=L"; // + 		document.getElementById("wakeTurbulenceCat").value;
	linkString += "&equipment=" + 	document.getElementById("equipment").value;
	linkString += "&ssr=" + 		document.getElementById("ssr").value;
	linkString += "&ad=" + 			getAerodromeByIndex( document.getElementById("departure").value ).icao;
	linkString += "&time=" +		timeStr;
	linkString += "&spd=" + 		document.getElementById("aircraftSpeedUnit").value;
	linkString += "&speed=" + 		document.getElementById("aircraftSpeed").value;
	
	//linkString += "&lv=VFR";
	linkString += "&lv=" + document.getElementById("flight_lv").value;
	// FIXED! When VFR is set, also 'level' must contain something. Space is enough!
	//linkString += "&level= ";
	var level = document.getElementById("flight_level").value;
	if (level == "") {
		level = " ";
	}
	linkString += "&level=" + level;
	
	linkString += "&route=";
	var routeStr="";
	if (document.getElementById("route_departure_rep").value !== "") {
		routeStr += document.getElementById("route_departure_rep").value + " ";
	}
	routeStr += document.getElementById("route").value;
	if (document.getElementById("route_destination_rep").value !== "") {
		routeStr += " " + document.getElementById("route_destination_rep").value;
	}
	// Check if route is empty, then add space.
	if (routeStr == "") {
		routeStr += " ";
	}
	
	linkString += routeStr;
	
	linkString += "&dad=" + getAerodromeByIndex( document.getElementById("destination").value ).icao;
	
	// Check FlightTimeOverride
	if (updateFlyingTimeValues() == false) {
		return false;
	}
	
	linkString += "&eet=" + gSelectedFlyingTimeStr;

	var other="";
	
	
	// Add departure and/or destination places into 18: field, if using ZZZZ airfield.
	//18: DEP/NUMMIJARVI DEST/AHTARI
	var alertText = "Muista päivittää lomakkeen kenttään 18:";
	var showAlertText = false;
	
	var departureValue = document.getElementById("departure").value;
	if (departureValue == UNOFFICIAL_AERODROME_INDEX) 
	{
		// ZZZZ field with freetext name
		other += 'DEP%252F' + document.getElementById("zzzz_departure").value + " ";
		other += CurrentAerodromeArray[UNOFFICIAL_AERODROME_INDEX].latStr + " ";
		other += CurrentAerodromeArray[UNOFFICIAL_AERODROME_INDEX].lonStr + " ";
	} 
	else {
		var departureAerodrome = getAerodromeByIndex(departureValue);
		if ( departureAerodrome.icao == UNOFFICIAL_AERODROME) {
			// ZZZZ field from xml
			other += 'DEP%252F' + departureAerodrome.name + " ";
			other += departureAerodrome.latStr + " ";
			other += departureAerodrome.lonStr + " ";
		}
	}
	
	
	var destinationValue = document.getElementById("destination").value;
	if (destinationValue == UNOFFICIAL_AERODROME_INDEX) {
		other += "DEST%252F" + document.getElementById("zzzz_destination").value + " ";
		
		// TODO note user to manually add coordinates
		//alertText += "\nMääräkentän koordinaatit (ddmmN dddmmE).";
		//showAlertText = true;
	}
	else {
		var destinationAerodrome = getAerodromeByIndex(destinationValue);
		if ( destinationAerodrome.icao == UNOFFICIAL_AERODROME) {
			// ZZZZ field from xml
			other += 'DEST%252F' + destinationAerodrome.name + " ";
			other += destinationAerodrome.latStr + " ";
			other += destinationAerodrome.lonStr + " ";
		}
	}
	
	if (isPbnNeeded()) {
		var pbn = document.getElementById("equipmentPBN").value;
		//debug_log("PBN/" + pbn);
		other += "PBN%252F" + pbn + " ";
	}

	other += "RMK%252F";
	if (document.getElementById("planActivationMethod").value == "phoneOnGound") {
		other += "DEP " + BY_PHONE_ON_GROUND_STR;
	}
	else if (document.getElementById("planActivationMethod").value == "rtfOnAir") {
		var dep=document.getElementById("departure");
		var depAerodrome = getAerodromeByIndex( dep.value );
		//debug_log("dep acc =" + depAerodrome.acc);
		other += "DEP " + BY_RTF_ON_AIR_STR + depAerodrome.acc + " ";
		
		if (depAerodrome.acc == NOTE_TO_ADD_ACC_FREQ_STR) {
			alertText += "\nLähtöpaikan ACC jakso.";
			showAlertText = true;
		}
	}

	if (document.getElementById("planCompletionMethod").value == "phoneOnGound") {
		other += "ARR " + BY_PHONE_ON_GROUND_STR;
	}
	else if (document.getElementById("planCompletionMethod").value == "rtfOnAir") {
		var dest=document.getElementById("destination");
		var destAerodrome = getAerodromeByIndex( dest.value );
		//debug_log("dest acc =" + destAerodrome.acc);
		other += "ARR " + BY_RTF_ON_AIR_STR + destAerodrome.acc + " ";
		
		if (destAerodrome.acc == NOTE_TO_ADD_ACC_FREQ_STR) {
			alertText += "\nLaskupaikan ACC jakso.";
			showAlertText = true;
		}
	}

	//other += "PILOT TEL " + document.getElementById("pilotTel").value;
	other += "PIC TEL " + document.getElementById("pilotTel").value;

	linkString += "&other=" + other;
	




	
	var endurance="";
	var enduranceSelection = document.getElementsByName("enduranceHour");
	for(var i = 0; i < enduranceSelection.length; i++) {
		if(enduranceSelection[i].checked) {
			endurance = enduranceSelection[i].value;
			break;
		}
	}
	enduranceSelection = document.getElementsByName("enduranceMin");
	for(var i = 0; i < enduranceSelection.length; i++) {
		if(enduranceSelection[i].checked) {
			endurance += enduranceSelection[i].value;
			break;
		}
	}
	if (Number(endurance) === 0) {
		alert("Toiminta-aika puuttuu!\nAseta oikea toiminta-aika.");
		return false;
	}

	linkString += "&endurance=" + endurance;
	//linkString += "&endurance=" + document.getElementById("endurance").value;

	var persons="";
	var personsSelection = document.getElementsByName("persons");
	for(var i = 0; i < personsSelection.length; i++) {
		if(personsSelection[i].checked) {
			persons = personsSelection[i].value;
			break;
		}
	}
	linkString += "&person=" + persons;
	
	//linkString += "&person=" + document.getElementById("persons").value;
	
	linkString += "&markings=" + document.getElementById("aircraftColor").value;
	linkString += "&pic=" + document.getElementById("pilot").value;
	linkString += "&tel=" + document.getElementById("pilotTel").value;
	linkString += "&filed=" + document.getElementById("pilot").value;
	
	
	//debug_log("updateFlightPlanLink() - linkString before =" + linkString);

	// Convert scandinavian letters
	linkString = convertScandinavianLetters(linkString);

	//debug_log("updateFlightPlanLink() - linkString after  =" + linkString);

	flightPlanLink = linkStart + linkString;
	
	if (showAlertText) {
		alert(alertText);
	}
	
	return true;
}


/* 
 * Plan storing
 * 
 * JSON data
 * - identification
 * - takeoff_time
 * - departure
 * - dep_route
 * - route
 * - dest_route
 * - destination
 * - flight_time
 * - completion_method
 * ----
 * - dep_name
 * 		- normal ad
 * 		- zzzz from db
 * 		/- zzzz freetext
 * - dest_name
 * 		- normal ad
 * 		- zzzz from db
 * 		/- zzzz freetext
 * - flight_level
 * - endurance
 * - persons
 * 
 */
function getPlanForStoring() {
	//debug_log("getPlanForStoring");
	
	var plan = {};
	// Get current time and add time offset
	var departureTimeHourSelection = document.getElementsByName("departureTimeHour");
	var departureTimeHour=0;
	for(var i = 0; i < departureTimeHourSelection.length; i++) {
		if(departureTimeHourSelection[i].checked) {
			departureTimeHour = Number(departureTimeHourSelection[i].value);
			break;
		}
	}
	var departureTimeMinSelection = document.getElementsByName("departureTimeMin");
	var departureTimeMin=0;
	for(var i = 0; i < departureTimeMinSelection.length; i++) {
		if(departureTimeMinSelection[i].checked) {
			departureTimeMin = Number(departureTimeMinSelection[i].value);
			break;
		}
	}
	if (departureTimeHour + departureTimeMin === 0) {
		alert("Lähtöaika ei voi olla heti.\nMuuta lähtöaika järkeväksi.");
		return false;
	}
	var d = new Date();
	var timeStr="";
	
	d.setMinutes( timeNext5mins( d.getMinutes() ) + departureTimeMin );
	d.setHours( d.getHours() + departureTimeHour);
	var hours = d.getUTCHours();
	var minutes = d.getUTCMinutes();
	
	if (hours<10) timeStr += "0";
	timeStr += hours;
	if (minutes<10) timeStr += "0";
	timeStr += minutes;
	
	if (document.getElementById("planActivationMethod").value == "phoneOnGound") {
		plan.activation_method = BY_PHONE_ON_GROUND_STR_WITH_PHONE;
	}
	else if (document.getElementById("planActivationMethod").value == "rtfOnAir") {
		var dep=document.getElementById("departure");
		var depAerodrome = getAerodromeByIndex( dep.value );
		plan.activation_method = BY_RTF_ON_AIR_STR + depAerodrome.acc + " ";
	}
	else {
		plan.activation_method = BY_TWR;
	}

	if (document.getElementById("planCompletionMethod").value == "phoneOnGound") {
		plan.completion_method = BY_PHONE_ON_GROUND_STR_WITH_PHONE;
	}
	else if (document.getElementById("planCompletionMethod").value == "rtfOnAir") {
		var dest=document.getElementById("destination");
		var destAerodrome = getAerodromeByIndex( dest.value );
		plan.completion_method = BY_RTF_ON_AIR_STR + destAerodrome.acc + " ";
	}
	else {
		plan.completion_method = BY_TWR;
	}
	
	
	plan.takeoff_time = d.toJSON();
	//plan.takeoff_time = timeStr;
	plan.identification = document.getElementById("aircraftIdentification").value;
	// TODO add coordinates to departure and destination (later)
	plan.departure = getAerodromeByIndex( document.getElementById("departure").value ).icao;
	plan.dep_name = getAerodromeByIndex( document.getElementById("departure").value ).name;
	plan.dep_route = document.getElementById("route_departure_rep").value;
	var route = document.getElementById("route").value;
	plan.route = $( '<p>'+ route +'</p>').text(); // Remove html from input field...
	plan.dest_route = document.getElementById("route_destination_rep").value;
	plan.destination = getAerodromeByIndex( document.getElementById("destination").value ).icao;
	plan.dest_name = getAerodromeByIndex( document.getElementById("destination").value ).name;
	
	var flight_level = document.getElementById("flight_lv").value;
	if (flight_level !== "VFR") {
		flight_level += document.getElementById("flight_level").value;
	}
	plan.flight_level = flight_level;
	
	var endurance="";
	var enduranceSelection = document.getElementsByName("enduranceHour");
	for(var i = 0; i < enduranceSelection.length; i++) {
		if(enduranceSelection[i].checked) {
			endurance = enduranceSelection[i].value;
			break;
		}
	}
	enduranceSelection = document.getElementsByName("enduranceMin");
	for(var i = 0; i < enduranceSelection.length; i++) {
		if(enduranceSelection[i].checked) {
			endurance += enduranceSelection[i].value;
			break;
		}
	}
	plan.endurance = endurance;
	
	var personsSelection = document.getElementsByName("persons");
	for(var i = 0; i < personsSelection.length; i++) {
		if(personsSelection[i].checked) {
			plan.persons = personsSelection[i].value;
			break;
		}
	}

	
	// Use override flight time when needed
	updateFlyingTimeValues();
	plan.flight_time = gSelectedFlyingTimeStr;

	//debug_log("getPlanForStoring - " + JSON.stringify(plan));
	return plan;
}

function storeCurrentPlan() {
    var plan = getPlanForStoring();
    addPlanToStorage(plan);
    updateStoredPlanList();
    //debug_log("stringify = " + JSON.stringify(plan));
}

/*function onClickFlightPlanShareButton() {
    var plan = getPlanForStoring();
    addPlanToStorage(plan);
    updateStoredPlanList();
    //debug_log("stringify = " + JSON.stringify(plan));
}*/


function onClickFlightPlanLinkButton() {
	if ( isAllSettingsAvailable() ) {
		try {
			if (updateFlightPlanLink()) {
				storeCurrentPlan();
				window.open( flightPlanLink );
			}
		} catch(err) {
			alert("Lentosuunnitelman luominen ei onnistunut.\n" + err );
		}
	} else {
		alert("Perustietoja puuttuu vielä.\nLisää puuttuvat tiedot Perustiedot sivulle, niin lentosuunnitelma saadaan täytettyä oikein.");
		window.open( "#page-plan-settings", "_self" );
	}
}



function getNotamLink(icao) {
	if (icao >= 'EFAA' && icao <='EFLP') {
		return "http://www.ais.fi/ais/bulletins/envfra.htm#" + icao;
	}
	else if (icao >= 'EFMA' && icao <='EFYL') {
		return "http://www.ais.fi/ais/bulletins/envfrm.htm#" + icao;
	}
}

/*function openNotam() {
	var storedPlans = getPlansFromStorage();
	var ind = localStorage.getItem('selectedStoredPlanIndex');
	var icao = storedPlans[ind].destination;
	var link="";
	if (icao >= 'EFAA' && icao <='EFLP') {
		//debug_log("openNotam 1 - " + icao);
		window.open("http://www.ais.fi/ais/bulletins/envfra.htm#" + icao);
	}
	else if (icao >= 'EFMA' && icao <='EFYL') {
		//debug_log("openNotam 2 - " + icao);
		window.open("http://www.ais.fi/ais/bulletins/envfrm.htm#" + icao);
	}
	//debug_log("openNotam 3 - " + link);
	//window.open( link );
}*/

//function openAip() {
	//https://ais.fi/ais/vfr/aerodromes/EFAA.html
	//https://ais.fi/ais/vfr/pdf/EFAA.pdf
	
	//https://ais.fi/ais/eaip/html/efet.htm
//}

