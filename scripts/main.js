"use strict";

/*
 * TODO list:
 * 
 * + lentokorkeus valinnat selväkielelle (kuten nopeus)
 * - kenttälistan filtteröinti kirjoituksen mukaan?
 * 		- mihin tekstikenttä sopii
 * 		- miten filtteröinti käytännössä toimii
 * 			- valmis demokoodi, data-native-menu="false"
 * 			http://demos.jquerymobile.com/1.4.4/selectmenu-custom-filter/
 * - uusi tekstikenttä, plaanin aktivointi, muu tapa (RTF PIRKKALA TWR 118 700)
 * - jos reitti jää tyhjäksi, lisää siihen DCT, paitsi jos lähtö ja määräkenttä on samoja... silloin note että "lisää siihen jotain, esim. TC"
 * 
 * - refresh jossain muualla kuin pääsivulla aiheuttaa erroreita -> jquery vaiheessa voisi koittaa korjata
 * 
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
 * 
 * - BUG: when resize is changed during settings screen, canvas is resized to minimum size.
 * 
 * Kehitys
 * 	- sijainti -nappi 
 * 		+ keltaisella kun sijaintia haetaan
 * 		- punaisella jos sijaintia ei ole saatu (denied yms.)
 * 		- vihreällä jos ok sijainti
 * 	- Perustiedot -nappi
 * 		- vihreällä/punaisella
 * 	- graafi
 * 		+ symbolien sijainnit fiksusti
 * 
 * - poista timestampit minimoitavasta koodista
 * - Muista päivittää kooditiedoston nimi! Kannattaa olla versionumero yms. varmistamassa uuden tiedoston lataamista.
 * + minimization: http://closure-compiler.appspot.com/home
 */


/*
Muutoksia:

- Mukana olevat kentät: http://eaip.eans.ee/2016-02-04/html/eAIP/EE-AD-1.3-en-GB.html#AD-1.3

- Kentän ollessa Virossa (puhelimella ja radiolla tehtäviin) ARR ja DEP tietoihin lisätään TALLINN
  PHONE ACC -> PHONE TALLINN ACC
  RTF ACC -> RTF TALLINN ACC

- 18 kenttään itse päivitettävä EET tieto
  - EET/PAIKKAHHMM

- käyttäjän on päivitettävä oma puhelinnumero kansainväliseen muotoon +358nnnnnnnnn (plussa jää plaanilomakkeelle mentäessä pois)

- Notam linkit (alareunan "Tehdyt lentosuunnitelmat" ja siitä oikean reunan "i" nappi) toimii myös Viron kentille (mikäli ko. kentän notam löytyy Finavian bulletin palvelusta)

- Lennon­valmistelu­tiedot kohdassa olevat Metarit ja TAF toimii myös Viron kentille

- "RAKETTIPELASTUSVARJO" on vaihdettu muotoon "PYROTECHNICS ON BOARD"



 * Naapurimaat
 * - Tarviiko olla mainittu TALLINN ACC?
 *   PHONE ACC -> PHONE TALLINN ACC
 *   RTF ACC -> RTF TALLINN ACC
 * 
 * Phase 1
 * + settings switch Naapurimaiden kentät
 *   + otherFieldsEnabled
 * + isEverythingReady, add check for other aerodromes
 * + handlePositionUpdate add branch for other aerodromes
 * + VfrRepArray and OtherVfrRepArray handling to isEverythingReady
 * + add "data/EE_aerodromes_04FEB2016.json" to validity.json file
 *   + update unit test for validation
 * 
 * + ACC jaksot
 * + ACC puhelinnumero <- voisi olla mukana maan kenttädatassa
 *   + TALLINN ACC
 *     + +372 625 8254
 *     + http://eaip.eans.ee/2016-02-04/html/eAIP/EE-GEN-3.3-en-GB.html#GEN-3.3
 * + aktivointi ja päättämistekstit varioidaan kyseisen maan mukaan.
 * + tekstit englanniksi
 *   + rakettipelastusvarjo
 * + oman puhelinnumeron kansainvälinen muoto? Käyttäjän tulee laittaa itse oikea muoto perustietoihin. Plussa poistuu automaattisesti.
 * 
 * + Tarkista tuorein tieto, Effective 04 FEB 2016
 *   - http://eaip.eans.ee/2016-02-04/html/index-en-GB.html
 * 
 * + Uudet kentät
 *   http://eaip.eans.ee/2016-02-04/html/eAIP/EE-AD-1.3-en-GB.html#AD-1.3
 *   + EEKL Koigi 585146N 0254451E
 *   + EEAA Antsla 574940N 0262940E
 * + poista piste TALLINN ACC jaksosta...
 * 
 * + dummy EET täyttäminen tarvittaessa kohtaan 18 + note sen päivittämisestä
 *   - EET/PaikkaHHMM
 * + notam linkit: https://ais.fi/ais/bulletins/eettvfr.htm#EETN
 * 
 * 
 * 
 * + BUG: Tsau - kysyin tänään briefingistä ja apuri lisää muutamia ylimääräisiä välilyöntejä mm. reitin ja PIC-nimen ympärille. Tsekkaas
 *   + puhelinnumeron + jää tyhjäksi, voisi filtteröidä pois
 *     'DEP/ILVESJOKI 6219N 02242E DEST/REKIKOSKI HUITTINEN 6112N 02253E RMK/DEP RTF ACC 127 100 ARR PHONE ACC PIC TEL  358505580335'
 *   + reitti, jos vapaamuotoista tekstiä ei ole kirjoitettu
 *     'PALLO  TALVI'
 *   + pelkkä yksi ilmoittautumispiste
 *   / lentoajan perässä? ei näytä johtuvan apurista
 * 
 * MOHNI 595349N 0253506E
 * BALTI 595415N 0251506E
 * DOBAN 594758N 0242709E
 * PETOT 593040N 0230831E
 * OSTOT 591715N 0221043E
 * 
 * NOTES
 * + hide id = route_fir_point_container, silloin kun kentät on samassa maassa
 * + show id = route_fir_point_container, silloin kun on valittu eri maissa olevat kentät
 * 
 * 
 * Phase 2
 * + maiden väliset ilm. pisteet, Viron AIP:stä, kartasta. Ruotsin suuntaan pisteet löytyy suomen AIP:stä.
 *   - http://eaip.eans.ee/2015-12-10/graphics/eAIP/AIRAC-AMDT-11-2015/ENR-ENRC-12112015.pdf
 *     - katso uusin versio
 *   + ANC kartta: http://eaip.eans.ee/files/ESTONIAN_VFR_2015_CHART.pdf
 *     -> tiedostoon
 * + UI: jos eri maan kentät, lisää reitti osuuteen uusi vfr piste lista
 * + modausta tarvitaan ylimääräisen reittipisteen takia
 * + reitin käsittely
 *   + laskelmat -taulukon täyttö
 *   + pituuksien laskenta
 *   + reittikartan piirtäminen
 * + EET ajan laskenta
 *   - onnistuu helposti jos on rajalla oleva välipiste
 *   + laske
 *   + päivitä plaaniin
 * + FIR piste mukaan reittikenttään, myös tallennettuun plaaniin
 * 
 * TODO Phase 2
 * - Parempi reitin kokonaisuuden optimointi FIR pisteen kanssa
 * + FIR pisteiden tallennus johonkin fiksusti
 *   + oma tiedosto missä pisteelle on mainittu minkä maiden välillä se on
 * - UI tarkistus
 *   + merkitse FIR valinta jollain erityisellä värillä?
 *   + Tarviiko FIR lista otsikon?
 *   - onko muuten fiksu?
 *   + liian kiinni seuraavassa listassa? -> lisätty marginaalia
 * - take care of situation when apuri is started abroad
 * 
 * - Tarkista muiden maiden ohjeista miten siellä täytetään EET?
 * - ZZZZ ohjeessa on eroa Ruotsissa
 * 
 * http://demos.jquerymobile.com/1.4.5/body-bar-classes/
 * <div class="ui-body ui-body-a ui-corner-all">
 * 
 * 
 * 
 * https://aim.eans.ee/index.php?option=com_content&view=article&id=129&Itemid=2&lang=en
 * 
 * + Change FREQ for Tallinn FIR E sector. New FREQ 127.175 MHz.
 * + Change FREQ for Tallinn FIR W sector. New FREQ 134.325 MHz.
 * 
 * 
 * Phase 3
 * - Ruotsi
 *   - VFR Flight in Sweden
 *     http://www.daec.de/fileadmin/user_upload/files/2012/fachbereiche/luftraum/A3-2007VFR_SCHW..pdf
 *   - https://www.aro.lfv.se/Editorial/View/IAIP
 * 
 * 
 * 
 * - ilmatilat?
 * 
 * + UTF-8 merkistö?? Ääkköset?
 *   + toimii kun kopioi alkuperäisestä lähteestä sellaisenaan...
 *   + tarviiko conversio koodia modata, että data kulkisi alusta loppuun oikein?
 * 
 */


/*
 * http://geojsonlint.com/
 * http://geojson.org/geojson-spec.html
 * 
 * geojson
 * + datan voi tarkistaa kartalla
 * - oma formaatti voisi olla tiiviimpi
 * - koordinaatit täytyy convertoida
 * 
 */

var log="Ohjelmakoodi päivätty: 2016-04-03<br>";
var CurrentVfrRepArray;
var VfrRepArray;
var OtherVfrRepArray; // Viro
var gFirPointArray;


var CurrentAerodromeArray; // Contains either Official or Official+ZZZZ fields, depending on user selection.
var OfficialAerodromeArray;
var ZZZZFieldArray;
var OtherAerodromeArray; // Viro

var gPosition_lat;
var gPosition_lon;

var flightPlanLink; // created link to flight plan
var gCalculatedFlyingTimeStr;
var gSelectedFlyingTimeStr;
var gTotalFlightTimeToFirBorder;

var airspaceData;

// Current filenames
var VFRPortFilename = "";
var AerodromesFilename = "";
var ZZZZFieldsFilename = "";
var AirspaceFilename = "";
var EE_AerodromesFilename = ""; // Viron kentät
var FirPointsFilename = "";

// These sizes will change based on screen size
var CANVAS_WIDTH = 300;
var CANVAS_HEIGHT = 300;

// constants

var DATA_VALIDITY_JSON_FILE = "data/validity.json";
var MAX_CANVAS_SIZE = 800; // Max height and width of canvas
var MIN_CANVAS_SIZE = 300; // Min height and width of canvas

var SCREEN_MARGINAL = 20; // Screen marginal size %

var UNOFFICIAL_AERODROME="ZZZZ";
var UNOFFICIAL_AERODROME_INDEX=0; // This field index is used when ZZZZ place name was written manually, not from xml.

//var BY_PHONE_ON_GROUND_STR = "PHONE ACC ";
//var BY_PHONE_ON_GROUND_STR_WITH_PHONE = "PHONE ACC 032865172 "; 
//var BY_RTF_ON_AIR_STR = "RTF ACC "; // ACC freq is updated later

var BY_PHONE_STR = "PHONE ";
var BY_RTF_STR = "RTF "; // ACC freq is updated later
var BY_TWR = "- (torni)";

var NOTE_TO_ADD_ACC_FREQ_STR = "LISÄÄ_ACC_JAKSO";

//var PYROTECHNICS_NOTE_REMARKS = "rakettipelastusvarjo";
var PYROTECHNICS_NOTE_REMARKS = "pyrotechnics on board";

var OPENAVIATIONDATA_APIKEY = "mkXQV7UpiiBgOVjxbTzioYfpOlNVtEtg";

var overrideFlightTime = true;

// This cache is used in resize function to redraw map display
var mapCacheRouteArray;


var total_startup_start_time = 0;
var aerodromeXml_start_time = 0;

function debug_log(str)
{
	log += str + "<br>";
	document.getElementById("log").innerHTML=log;
}

function debug_timestamp_start(str)
{
	var d = new Date();
	var n = d.getTime(); // toTimeString();
	//debug_log("-> " + str); // + ": " + n
	return n;
}
function debug_timestamp_ready(str, start_time)
{
	var d = new Date();
	var n = d.getTime(); // toTimeString();
	//debug_log("<- " + str + ": " + (n-start_time)); //  + " -- "+ n
}


function getFlightTimeOverride() {
	return overrideFlightTime;
}


// Get country part of ICAO code (=2 first letters)
function getCountryByICAO(icao) {
	if (icao.length != 4) {
		debug_log("ERROR: getCountryByICAO: icao='" + icao + "' is not valid. Expected 4 characters.");
	}
	var country = icao.substr(0,2).toUpperCase();;
	// Let's assume ZZZZ fields are in Finland.
	if (country == 'ZZ') {
		country = 'EF'; 
	}
	return country;
}


function get_ACC_STR_WITH_PHONE_by_country(country) {
	switch(country)
	{
	case 'EF': return "ACC +35832865172 ";
	case 'EE': return "TALLINN ACC +3726258254 ";
	default:
		debug_log("ERROR: get_ACC_STR_WITH_PHONE_by_country: country '" + country + "' no yet handled.'");
		return "ACC +35832865172 ";
		break;
	}
}

function get_ACC_STR_by_country(country) {
	switch(country)
	{
	case 'EF': return "ACC";
	case 'EE': return "TALLINN ACC";
	default:
		debug_log("ERROR: get_ACC_STR_by_country: country '" + country + "' no yet handled.'");
		return "ACC";
		break;
	}
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
	debug_timestamp_ready("total startup (check if everything is ready)", total_startup_start_time);

	if (isEverythingReady()) {
		//debug_log("continueIfEverythingIsReady()");
		PopulateSelections();
		onChangeDepartureAd();
		onChangeDestinationAd();
	}
	debug_timestamp_ready("total startup (all but position)", total_startup_start_time);

	if (OfficialAerodromeArray !== undefined && ZZZZFieldArray !== undefined && gPosition_lat !== undefined) {
		//debug_log("continueIfEverythingIsReady() - new handlePositionUpdate");
		handlePositionUpdate(gPosition_lat, gPosition_lon);
	}
}


function handlePositionError(error) {
	document.getElementById("locationUpdateButtonText").innerHTML = "Ei sijaintia";
	$('#location-button').removeClass('location-waiting').addClass('location-not-available');

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
	debug_timestamp_ready("total startup (got position update)", total_startup_start_time);

	handlePositionUpdate(position.coords.latitude, position.coords.longitude);
	var accuracy;
	if (position.coords.accuracy<1000) {
		accuracy = "(" + Math.round(position.coords.accuracy) + "m)";
	} else {
		accuracy = "(" + Math.round(position.coords.accuracy/1000) + "km)";
	}

	document.getElementById("locationUpdateButtonText").innerHTML = "Sijainti " + accuracy;
	$('#location-button').removeClass('location-waiting location-not-available');
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
	if (document.getElementById("otherFieldsEnabled").value == "enabled") {
		if (OtherAerodromeArray === undefined) {
			//debug_log("handlePositionUpdate() - OtherAerodromeArray is not ready.");
			return;
		}
	}

	debug_log("Suomen lentokentät käytössä.");
	CurrentAerodromeArray = OfficialAerodromeArray;
	if (document.getElementById("zzzzFieldsEnabled").value == "enabled") {
		debug_log("Epäviralliset lentopaikat käytössä.");
		CurrentAerodromeArray = CurrentAerodromeArray.concat(ZZZZFieldArray);
	}
	
	if (document.getElementById("otherFieldsEnabled").value == "enabled") {
		debug_log("Viron lentokentät käytössä.");
		CurrentAerodromeArray = CurrentAerodromeArray.concat(OtherAerodromeArray);
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
	
	debug_timestamp_ready("total startup (after position update)", total_startup_start_time);
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
		debug_log("ERROR: DMS_to_DM(): DMS coordinate does not look valid! dms=" + dms);
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
			debug_log("ERROR: DMS_to_DM(): DMS coordinate does not look valid! No letter at the end (or wrong letter). dms=" + dms);
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
			debug_log("ERROR: DMS_to_Decimal(): DMS coordinate does not look valid! No letter at the end (or wrong letter). dms=" + dms);
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
		debug_log("ERROR: DMS_to_Decimal(): DMS coordinate does not look valid! dms=" + dms);
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
		decimal = -decimal;
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
		decimal = -decimal;
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
	return v * (Math.PI / 180);
}

function toDeg(v) {
	return v / (Math.PI / 180);
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

Waypoint.prototype.setDistance = function (d) {
	this.distance = d;
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
			debug_timestamp_ready("aerodromeXml loaded", aerodromeXml_start_time);

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

function combineVfrPointArrays() {
	//debug_log("combineVfrPointArrays()");
	if (VfrRepArray !== undefined) {
		CurrentVfrRepArray = VfrRepArray;
		//debug_log("combineVfrPointArrays() - VfrRepArray added");
		
		if (OtherVfrRepArray !== undefined) {
			//debug_log("combineVfrPointArrays() - OtherVfrRepArray added");
			CurrentVfrRepArray = CurrentVfrRepArray.concat(OtherVfrRepArray);
		}
	}
}

function vfrPortReadyHandler(xmlDoc) {
	var vfrPortReadyHandler_start_time = debug_timestamp_start("vfrPortReadyHandler");

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

	combineVfrPointArrays();
	
	debug_timestamp_ready("vfrPortReadyHandler", vfrPortReadyHandler_start_time);
	
	//debug_log( "Loading unofficial airfields...");
	loadXMLDoc(ZZZZFieldsFilename, zzzzFieldXmlResponseHandler);
}

function aerodromeReadyHandler(xmlDoc) {
	var aerodromeReadyHandler_start_time = debug_timestamp_start("aerodromeReadyHandler");
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

	debug_timestamp_ready("aerodromeReadyHandler", aerodromeReadyHandler_start_time);

	loadXMLDoc(VFRPortFilename, vfrPortXmlResponseHandler);

	// removed because we continue after VFR port file loading.
	//continueIfEverythingIsReady();
}


function zzzzFieldReadyHandler(xmlDoc) {
	//debug_log("zzzzFieldReadyHandler");
	var zzzzFieldReadyHandler_start_time = debug_timestamp_start("zzzzFieldReadyHandler");
	
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

	debug_timestamp_ready("zzzzFieldReadyHandler", zzzzFieldReadyHandler_start_time);
	
	continueIfEverythingIsReady();
}


// Handle aerodromes from other countries
function aerodromeJsonHandler(data) {
	OtherAerodromeArray = new Array();
	OtherVfrRepArray = new Array();
	
	debug_log( "Viron lentokenttätiedot ja VFR pisteet päivätty: " + data.created);
	
	for (var i=0; i<data.aerodrome.length; ++i) {
		var name = data.aerodrome[i].name;
		var icao = data.aerodrome[i].icao;
		var atc = data.aerodrome[i].atc;
		var tmp_acc = data.aerodrome[i].acc;
		var acc = tmp_acc.replace(".", " ");
		//debug_log( tmp_acc + " -> " + acc );


		var lat = data.aerodrome[i].lat;
		var lon = data.aerodrome[i].lon;
		
		var vfrPoints = data.aerodrome[i].vfrpoint;
		var vfrPointsArray = new Array();
		for (var j=0; j<vfrPoints.length; ++j) {
			
			vfrPointsArray.push( data.aerodrome[i].vfrpoint[j].name);
			
			OtherVfrRepArray.push(new Waypoint(data.aerodrome[i].vfrpoint[j].name, 
				DMS_to_Decimal(data.aerodrome[i].vfrpoint[j].lat), 
				DMS_to_Decimal(data.aerodrome[i].vfrpoint[j].lon)));
			//debug_log( "vfr point: " + data.aerodrome[i].vfrpoint[j].name );
		}
		
		//debug_log("new Aerodrome:" + name + " - " + vfrPointsArray);
		OtherAerodromeArray.push(new Aerodrome(name, icao, 
				lat, lon,
				atc,
				acc,
				vfrPointsArray));
	}
	debug_log( "=> " + OtherAerodromeArray.length + " Viron lentokenttää.");
	debug_log( "=> " + OtherVfrRepArray.length + " Viron VFR ilmoittautumispistettä.");
	//CurrentVfrRepArray = CurrentVfrRepArray.concat(OtherVfrRepArray); 
	
	combineVfrPointArrays();
	continueIfEverythingIsReady();

	//debug_log( "aerodromeJsonHandler: end");
}


// Handle FIR points for other countries
function FirPointsJsonHandler(data) {
	//debug_log( "FirPointsJsonHandler");

	gFirPointArray = new Array();

	for (var i=0; i<data.FirPoints.length; ++i) {
		//debug_log( "FirPointsJsonHandler - country " + i + ": " + data.FirPoints[i].country);

		// Create new array for country, if it does not yet exist
		if (gFirPointArray[data.FirPoints[i].country] == undefined) {
			//debug_log( "FirPointsJsonHandler - create new array");
			gFirPointArray[data.FirPoints[i].country] = new Array();
		} 
		
		gFirPointArray[data.FirPoints[i].country].push(new Waypoint(data.FirPoints[i].name, 
			DMS_to_Decimal(data.FirPoints[i].lat), 
			DMS_to_Decimal(data.FirPoints[i].lon)));
	}
	
	// TODO this is not needed. but we should take care of situation when this is started abroad
	//continueIfEverythingIsReady();
}


function loadAerodromeJson() {
	// Load only if needed
	if (document.getElementById("otherFieldsEnabled").value == "enabled") {
		$.getJSON(EE_AerodromesFilename,
			function(data, textStatus, jqXHR) {
				aerodromeJsonHandler(data);
			}).fail(function() {
				alert("Virhe '" + EE_AerodromesFilename + "' tiedoston lataamisessa. Kokeile ladata sivu uudestaan. Jos vika ei poistu, ota yhteyttä Lentosuunnitelma-apurin tekijään.");
			}).always(function() {
			});
		$.getJSON(FirPointsFilename,
			function(data, textStatus, jqXHR) {
				FirPointsJsonHandler(data);
			}).fail(function() {
				alert("Virhe '" + FirPointsFilename + "' tiedoston lataamisessa. Kokeile ladata sivu uudestaan. Jos vika ei poistu, ota yhteyttä Lentosuunnitelma-apurin tekijään.");
			}).always(function() {
			});
	}
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
	if (CurrentVfrRepArray === undefined) {
		//debug_log("NOTE: getVfrWayPointByName(): CurrentVfrRepArray not yet loaded");
		return null;
	}

	for (var wptInd=0; wptInd<CurrentVfrRepArray.length; ++wptInd) {
		if (name == CurrentVfrRepArray[wptInd].name) {
			return CurrentVfrRepArray[wptInd];
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
	document.getElementById("pyrotechnicsOnBoard").value = "off";
	//try {
	$('#ssr').selectmenu('refresh');
	//$('#pyrotechnicsOnBoard').flipswitch('refresh'); // This is moved later, so that previous plane data is not changed...

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
		$('#pyrotechnicsOnBoard').flipswitch('refresh'); // NOTE: This could not be in clearAircraftSettingsFields() as there it would change previous aircrafts pyrotechnicsOnBoard value...
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
	localStorage.removeItem( prefix + "pyrotechnicsOnBoard");
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

function onChangePyrotechnicsOnBoard() {
	var currentId = localStorage.getItem( "currentSettingsId");
	localStorage.setItem( currentId + "_pyrotechnicsOnBoard", document.getElementById("pyrotechnicsOnBoard").value);
}

function onChangeZzzzFieldsEnabled() {
	localStorage.setItem( "zzzzFieldsEnabled", document.getElementById("zzzzFieldsEnabled").value);
	handlePositionUpdate(gPosition_lat, gPosition_lon);
}
function onChangeOtherFieldsEnabled() {
	//debug_log("onChangeOtherFieldsEnabled - " + document.getElementById("otherFieldsEnabled").value);
	localStorage.setItem( "otherFieldsEnabled", document.getElementById("otherFieldsEnabled").value);

	// Check if file is loaded, load if needed.
	if (document.getElementById("otherFieldsEnabled").value == "enabled") {
		if (OtherAerodromeArray === undefined) {
			loadAerodromeJson();
			return;
		}
	}

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
		equipment = "V";
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

	var pyrotechnicsOnBoard = localStorage.getItem(currentId + "_pyrotechnicsOnBoard");
	if (pyrotechnicsOnBoard === null) {
		pyrotechnicsOnBoard = "off";
	}
	
	document.getElementById("pyrotechnicsOnBoard").value = pyrotechnicsOnBoard;
	try {
		$('#pyrotechnicsOnBoard').flipswitch('refresh');
	} catch(err) { } // ignore error (it happens in first onload)

	var zzzzEnabled = localStorage.getItem("zzzzFieldsEnabled");
	if (zzzzEnabled !== null) {
		document.getElementById("zzzzFieldsEnabled").value = zzzzEnabled;
	}
	var otherEnabled = localStorage.getItem("otherFieldsEnabled");
	if (otherEnabled !== null) {
		//ebug_log("otherFieldsEnabled=" + otherEnabled);
		document.getElementById("otherFieldsEnabled").value = otherEnabled;
	}
	
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
		
		if (gCalculatedFlyingTimeStr===undefined) {
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
		
		// TODO check if there is way to do this check?
		//if (storedPlans[ind].activation_method !== BY_PHONE_ON_GROUND_STR_WITH_PHONE && 
		//	storedPlans[ind].completion_method !== BY_PHONE_ON_GROUND_STR_WITH_PHONE) {
		//	$('#callAccButton').hide();
		//}
		//else {
			$('#callAccButton').show();
		//}
	});
}

// Handle toggling of OFPContainer
function showOFPContainer() {
	$('#OFPContainer').slideDown();
	$('#OFPContainerToggleButton').text("Piilota...");
}

function hideOFPContainer() {
	$('#OFPContainer').slideUp();
	$('#OFPContainerToggleButton').text("Näytä...");
}

function onOFPContainerToggleClick() {
	if ($('#OFPContainer').is(":hidden")) {
		showOFPContainer();
	} else {
		hideOFPContainer();
	}
}


/*
 * loadValidityJson will load current filenames from 'validity.json'
 * - load json file
 * - parse dates 
 * - find current date range
 * - use files from that date range
 * 
 * 
 * Unit tests ('JSON validity check') are used to check correctness of 'validity.json' file
 * 
 * It will check that 
 * - json file founds
 * - no errors in parse
 * - all dates parsed without errors
 * - dates are in increasing order
 * - all tags found
 * - filenames are not empty
 * - from today to future, all dates have all files
 * - all files are actually found from data directory
 * 
 */
function loadValidityJson()
{
	$.getJSON(DATA_VALIDITY_JSON_FILE, 
		function(data, textStatus, jqXHR) {
			var today = new Date();

			for (var i=0; i<data.data.length; ++i) {
				
				var dateOfUpdate = new Date(data.data[i].validFrom);
				
				if (today.getTime() >= dateOfUpdate.getTime()) {
					AerodromesFilename = data.data[i].aerodromes;
					ZZZZFieldsFilename = data.data[i].zzzzfields;
					VFRPortFilename = data.data[i].vfrpoints;
					AirspaceFilename = data.data[i].airspace;
					EE_AerodromesFilename = data.data[i].EE_aerodromes;
					FirPointsFilename = data.data[i].FirPoints;
				}
			}
			if (AerodromesFilename == "" && ZZZZFieldsFilename == "" && VFRPortFilename == "" && EE_AerodromesFilename == "") {
				alert("En löydä kenttätietoja tälle päivämäärälle (en muista kovin vanhoja juttuja). Tarkista laitteesi päivämääräasetus.");
			}
		}).fail(function() {
			alert("Virhe validity.json tiedoston lataamisessa. Tiedostoa ei löydy tai formaatti on pielessä. Kokeile ladata sivu uudestaan. Jos vika ei poistu, ota yhteyttä Lentosuunnitelma-apurin tekijään.");
		}).always(function() {
			onStartup();
		});
}

function loadAirspaceJson()
{
	$.getJSON(AirspaceFilename, 
		function(data, textStatus, jqXHR) {
			airspaceData = data;
		}).fail(function() {
			alert("Virhe airspace.json tiedoston lataamisessa. Tiedostoa ei löydy tai formaatti on pielessä. Kokeile ladata sivu uudestaan. Jos vika ei poistu, ota yhteyttä Lentosuunnitelma-apurin tekijään.");
		}).always(function() {
			//onStartup();
		});
}

function isPrivateBrowsingOn() {
	var testKey = "Private";
	//debug_log( "isPrivateBrowsingOn");
	try
	{
		localStorage.setItem(testKey, 'test');
		localStorage.removeItem(testKey);
		return false;
	}
	catch (error)
	{
		return true;
	}
}


function onLoad()
{
	window.addEventListener('resize', resizeCanvas, false);
	if (isPrivateBrowsingOn()) {
		var str = "Private Browsing (Yksityinen selaus) on päällä selaimessasi. Apuri ei voi toimia tässä tilassa. Palaa takaisin normaalin tilaan ja lataa sivu uudestaan.";
		debug_log( str );
		alert( str );
	}
	updateFromLocalStorage();
	loadValidityJson();
	resizeCanvas();
}

function onStartup() {
	//console.log( "onStartup()" );
	loadAirspaceJson();

	total_startup_start_time = debug_timestamp_start("onStartup");

	aerodromeXml_start_time = debug_timestamp_start("aerodromeXml load start");
	loadXMLDoc(AerodromesFilename, aerodromeXmlResponseHandler);
	loadAerodromeJson();

	if (navigator.geolocation) {
		updateCurrentLocation();
	}
	else {
		// Hide updateCurrentLocationButton
		debug_log( "Geolocation ei ole tuettu selaimessa.");
		fakeCurrentLocation();
		document.getElementById("locationUpdateButtonText").innerHTML = "Ei sijaintia";
		$('#location-button').removeClass('location-waiting').addClass('location-not-available');
	}
	
	onChangeFlightLv();
	
	updateStoredPlanList();

	initStoredPlanPageHandler();

   hideOFPContainer();

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
		$('#location-button').removeClass('location-not-available').addClass('location-waiting');

/*	http://www.w3.org/TR/geolocation-API/#high-accuracy
  interface PositionOptions {
    attribute boolean enableHighAccuracy;
    attribute long timeout;
    attribute long maximumAge;
  };
*/
		//var options = { maximumAge:600000 };
		//debug_log("updateCurrentLocation(): maximumAge:600000 in use");
		//boolean enableHighAccuracy
		//navigator.geolocation.getCurrentPosition(handlePositionUpdateCallback, handlePositionError, options);
		navigator.geolocation.getCurrentPosition(handlePositionUpdateCallback, handlePositionError );
	}
}

/*
// Idea:
// etsitään vain p1 (lähtökentän VFR piste) minkä kautta tulee lyhin reitti.
// p2 (määräkentän VFR piste) haetaan (toisesta suunnasta) erikseen samanlaisella kutsulla
min_dist = -1
for p1 in dep points 
	d1 = distance(dep, p1)
	for p2 in dest points 
		d2 = distance(p1, p2)
		d3 = distance(p2, dest)
		if min_dist > d1+d2+d3 or min_dist == -1
			min_points = p1 // <- haetaan vain parasta p1:stä
			min_dist = d1+d2+d3
 */

/*
 * sortNearestFirst(vfrWaypoints, dep, dest)
 * 		vfrWaypoints = VFR point array to sort
 * 		dep = departure airfield
 * 		dest = destination airfield
 */
function sortNearestFirst(vfrWaypoints, dep, dest) {
	//debug_log("sortNearestFirst - " + dep.icao + " - " + dest.icao );

	var DestVfrWaypoints = getVfrWayPointsByName( dest.vfrPoints );

	// Loop departure's VFR points
	for (var ind=0; ind<vfrWaypoints.length; ++ind) {

		// distance from dep to VFR point
		var min_dist = -1; // -1 means that it does not have value yet
		var d1 = calcDistanceFrom(vfrWaypoints[ind].lat, vfrWaypoints[ind].lon, dep.lat, dep.lon);
		//debug_log("sortNearestFirst - " + dep.icao + " - " + vfrWaypoints[ind].name + " = " + d1 + " km");
		
		// Check whether destination contains any VFR points
		if (DestVfrWaypoints.length == 0) {
			var d2 = calcDistanceFrom(vfrWaypoints[ind].lat, vfrWaypoints[ind].lon, dest.lat, dest.lon);
			//debug_log("sortNearestFirst - -  " + vfrWaypoints[ind].name + " - " + dest.icao + " = " + d2 + " km");
			vfrWaypoints[ind].setDistance(d1+d2);
		}
		else {
			// Loop destination's VFR points
			for (var destInd=0; destInd<DestVfrWaypoints.length; ++destInd) {
				var d2 = calcDistanceFrom(vfrWaypoints[ind].lat, vfrWaypoints[ind].lon, DestVfrWaypoints[destInd].lat, DestVfrWaypoints[destInd].lon);
				//debug_log("sortNearestFirst - - " + vfrWaypoints[ind].name + " - " + DestVfrWaypoints[destInd].name + " = " + d2 + " km");
	
				var d3 = calcDistanceFrom(DestVfrWaypoints[destInd].lat, DestVfrWaypoints[destInd].lon, dest.lat, dest.lon);
				//debug_log("sortNearestFirst - -  " + DestVfrWaypoints[destInd].name + " - " + dest.icao + " = " + d3 + " km");
				
				if ((min_dist > d1+d2+d3) || (min_dist == -1)) {
					min_dist = d1+d2+d3;
					vfrWaypoints[ind].setDistance(min_dist);
				}
			}
		}

		//debug_log("sortNearestFirst - Distance via " + vfrWaypoints[ind].name + " = " + vfrWaypoints[ind].getDistance() + " km");
	}
	vfrWaypoints.sort(waypointDistanceSort);
	//debug_log("sortNearestFirst - Done" );
}


/*
// Old version of sorting... It is too simple, and gives incorrect results sometimes.
function sortNearestFirstOld(array, lat, lon) {
	//debug_log("sortNearestFirst");
	for (var ind=0; ind<array.length; ++ind) {
		array[ind].calcDistanceFrom(lat, lon);
		//debug_log("sortNearestFirst - " + array[ind].name + " " + array[ind].distance + " km");
	}
	array.sort(waypointDistanceSort);
	return array;
}
*/

function fillVfrWaypointSelectionData(elSelection, dep, dest) {
	//debug_log("fillVfrWaypointSelectionData");
	removeOptions(elSelection);

	var vfrWaypoints = getVfrWayPointsByName( dep.vfrPoints );
	if (vfrWaypoints.length == 0) {
		//debug_log("fillVfrWaypointSelectionData - " + dep.icao + " does not have VFR points");
		return;
	}
	//sortNearestFirstOld(vfrWaypoints, dest.lat, dest.lon);
	sortNearestFirst(vfrWaypoints, dep, dest);

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


// TODO this is not most accurate sorting...
// Let's see if this is good enough
function sortFirPoints(array, dep, dest) {
	//debug_log("sortFirPoints");
	for (var ind=0; ind<array.length; ++ind) {
		var d1 = calcDistanceFrom(array[ind].lat, array[ind].lon, dep.lat, dep.lon);
		var d2 = calcDistanceFrom(array[ind].lat, array[ind].lon, dest.lat, dest.lon);
		array[ind].setDistance(d1+d2);
		//debug_log("sortFirPoints - " + array[ind].name + " " + array[ind].getDistance() + " km" );
	}
	array.sort(waypointDistanceSort);
	return array;
}


// Find FIR points which are between depCountry and destCountry.
// TODO country could be "EE-EF" and "ES-EF". Then find 'depCountry+"-"+destCountry' and vise versa
function getFIRpoints( depCountry, destCountry ) {
	//debug_log("getFIRpoints between countries " + depCountry + " and "+ destCountry);

	var arr = new Array();
	if (gFirPointArray[destCountry] != undefined) {
		arr = arr.concat(gFirPointArray[destCountry]);
	}
	if (gFirPointArray[depCountry] != undefined) {
		arr = arr.concat(gFirPointArray[depCountry]);
	}
	return arr;
}

function getFirPointByName( name ) {
	//debug_log("getFirPointByName - searching FIR point: " + name );
	if (name == "") {
		return null;
	}
	
	for (var country in gFirPointArray) {
		//debug_log("getFirPointByName - country: " + country );
		for (var i=0; i<gFirPointArray[country].length; ++i) {
			//debug_log("getFirPointByName - name: " + gFirPointArray[country][i].name );
			if (name == gFirPointArray[country][i].name) {
				//debug_log("getFirPointByName - found!");
				return gFirPointArray[country][i];
			}
		}
	}
	debug_log("ERROR: getFirPointByName - '" + name + "' not found");
	return null;
}



function fillFIRwaypointSelectionData(elSelection, dep, dest) {
	//debug_log("fillFIRwaypointSelectionData");

	removeOptions(elSelection);
	// Show or hide FIR point container based on countries
	if (getCountryByICAO(dep.icao) == getCountryByICAO(dest.icao)) {
		$('#route_fir_point_container').slideUp();
		return;
	}
	else {
		$('#route_fir_point_container').slideDown();
	}

	var firWaypoints = getFIRpoints( getCountryByICAO(dep.icao), getCountryByICAO(dest.icao) );
	if (firWaypoints.length == 0) {
		debug_log("fillFIRwaypointSelectionData - I don't know FIR points between countries " + getCountryByICAO(dep.icao) + " and "+ getCountryByICAO(dest.icao) + ".");
		return;
	}
	
	sortFirPoints(firWaypoints, dep, dest);
	
	// Empty ref point
	// Future option, with DCT route we should calculate coordinates and time for that point.
	//appendOption(elSelection, "-", "");
	
	for (var i=0; i<firWaypoints.length; ++i) {
		appendOption(elSelection, firWaypoints[i].name, firWaypoints[i].name);
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
	appendOption(elSelection, "Puhelimella maassa (" + get_ACC_STR_by_country(getCountryByICAO(ad.icao)) + ")", "phoneOnGound");
	appendOption(elSelection, "Radiolla ilmassa (" + get_ACC_STR_by_country(getCountryByICAO(ad.icao)) + " " + ad.acc + ")", "rtfOnAir");
}


function getMetar(aerodrome, selector) {
	// http://api.jquery.com/load/
	document.getElementById(selector).innerHTML = "";

	$.getJSON("https://api.openaviationdata.com/v1/metar?station=" + aerodrome + "&key=" + OPENAVIATIONDATA_APIKEY, 
		function(data, textStatus, jqXHR) {
			if (data.code == 200) {
				document.getElementById(selector).innerHTML = data.data[aerodrome].raw;
			}
		} );
}

function getTaf(aerodrome, selector) {
	// http://api.jquery.com/load/
	document.getElementById(selector).innerHTML = "";
	
	$.getJSON("https://api.openaviationdata.com/v1/taf?station=" + aerodrome + "&key=" + OPENAVIATIONDATA_APIKEY, 
		function(data, textStatus, jqXHR) {
			if (data.code == 200) {
				document.getElementById(selector).innerHTML = data.data[aerodrome].raw;
			}
		} );
}

function getNotam(aerodrome, selector) {
	// http://api.jquery.com/load/
	document.getElementById(selector).innerHTML = "";
	
	$.getJSON("https://api.openaviationdata.com/v2/notam/facility?icao=" + aerodrome + "&key=" + OPENAVIATIONDATA_APIKEY, 
		function(data, textStatus, jqXHR) {
			if (data.code == 200) {
				var notams="";
				var ind;
				//notams += '<ul data-role="listview">';
				for (ind=0; ind<data.data.length; ind++) {
					//notams += "<li>";
					notams += data.data[ind].facility_icao + "=== ";
					
					notams += data.data[ind].report; //report, text
					notams += "<br>";
					//notams += "</li>";
				}
				//notams += "</ul>";
				document.getElementById(selector).innerHTML = notams;
			}
		} );
}


function requestOpenDataDep(depIcao) {
	// TODO Check whether dep and dest differs and request only needed data.
	
	$('#metarDepId').text("");
	$('#tafDepId').text("");
	//$('#notamDepId').text("");
	
	// TODO - if ZZZZ is selected, remember to clear previous values from fields...
	if (depIcao !== UNOFFICIAL_AERODROME) {
		getMetar(depIcao, "metarDepId");
		getTaf(depIcao, "tafDepId");
		//getNotam(depIcao, "notamDepId");
	}

	// TODO not yet good... Need to check better what data should be requested...
	/*if (depIcao !== destIcao) {
		if (destIcao !== UNOFFICIAL_AERODROME) {
			getMetar(destIcao, "metarDestId");
			getTaf(destIcao, "tafDestId");
			getNotam(destIcao, "notamDestId");
		}
	}*/
}

function requestOpenDataDest(destIcao) {
	// TODO Check whether dep and dest differs and request only needed data.
	
	$('#metarDestId').text("");
	$('#tafDestId').text("");
	//$('#notamDestId').text("");
	
	// TODO - if ZZZZ is selected, remember to clear previous values from fields...
	if (destIcao !== UNOFFICIAL_AERODROME) {
		getMetar(destIcao, "metarDestId");
		getTaf(destIcao, "tafDestId");
		//getNotam(destIcao, "notamDestId");
	}

	// TODO not yet good... Need to check better what data should be requested...
	/*if (depIcao !== destIcao) {
		if (destIcao !== UNOFFICIAL_AERODROME) {
			getMetar(destIcao, "metarDestId");
			getTaf(destIcao, "tafDestId");
			getNotam(destIcao, "notamDestId");
		}
	}*/
}

// http://cheatsheetworld.com/programming/html5-canvas-cheat-sheet/

var outcode_TOP_LEFT 	= 0x1;
var outcode_TOP_RIGHT 	= 0x2;
var outcode_BOTTOM_LEFT	= 0x4;
var outcode_BOTTOM_RIGHT= 0x8;

/*
 * return outcode for direction
 * 0x1 0x2
 * 0x4 0x8

 * 0001 0010
 * 0100 1000
 * 
 */


// getOutcode finds quadrants to which direction other coordinate is.
// Returns one quadrant opcode
function getOutcode(current_x, current_y, other_x, other_y) {
	//debug_log("getOutcode");
	var code = 0;
	if (other_y > current_y) {
		if (other_x > current_x) {
			code |= outcode_TOP_RIGHT;
		}
		else if (other_x < current_x) { // =
			code |= outcode_TOP_LEFT;
		}
	}
	else if (other_y < current_y) { // =
		if (other_x > current_x) {
			code |= outcode_BOTTOM_RIGHT;
		}
		else if (other_x < current_x) { // =
			code |= outcode_BOTTOM_LEFT;
		}
	}
	
	//debug_log("getOutcode: code=" + code);
	return code;
}


// Get horizontal alignment (string) for text.
// This implementation should be in sync with getVerticalAlignment, so that both selects the same quadrant.
function getHorisontalAlignment(outcode) {
	if (!(outcode & outcode_TOP_LEFT) && !(outcode & outcode_TOP_RIGHT)) {
		//debug_log("getHorisontalAlignment: CENTER (top)");
		return "center";
	}
	if (!(outcode & outcode_BOTTOM_LEFT) && !(outcode & outcode_BOTTOM_RIGHT)) {
		//debug_log("getHorisontalAlignment: CENTER (bottom)");
		return "center";
	}
	
	if (!(outcode & outcode_TOP_LEFT)) {
		//debug_log("getHorisontalAlignment: LEFT (top)");
		return "right";
	}
	else if (!(outcode & outcode_TOP_RIGHT)) {
		//debug_log("getHorisontalAlignment: RIGHT (top)");
		return "left";
	}
	else if (!(outcode & outcode_BOTTOM_LEFT)) {
		//debug_log("getHorisontalAlignment: LEFT (bottom)");
		return "right";
	}
	else { // if (!(outcode & outcode_BOTTOM_RIGHT)) {
		//debug_log("getHorisontalAlignment: RIGHT (bottom)");
		return "left";
	}
}

// Get vertical alignment value (-1 or 1) for text. Value is used as factor to select side (top or bottom) of the text.
// This implementation should be in sync with getHorisontalAlignment, so that both selects the same quadrant.
function getVerticalAlignment(outcode) {
	if (!(outcode & outcode_TOP_LEFT) && !(outcode & outcode_TOP_RIGHT)) {
		//debug_log("getVerticalAlignment: TOP (center)");
		return -1;
	}
	if (!(outcode & outcode_BOTTOM_LEFT) && !(outcode & outcode_BOTTOM_RIGHT)) {
		//debug_log("getVerticalAlignment: BOTTOM (center)");
		return 1;
	}

	if (!(outcode & outcode_TOP_LEFT)) {
		//debug_log("getVerticalAlignment: TOP (left)");
		return -1;
	}
	else if (!(outcode & outcode_TOP_RIGHT)) {
		//debug_log("getVerticalAlignment: TOP (right)");
		return -1;
	}
	else if (!(outcode & outcode_BOTTOM_LEFT)) {
		//debug_log("getVerticalAlignment: BOTTOM (left)");
		return 1;
	}
	else { // if (!(outcode & outcode_BOTTOM_RIGHT)) {
		//debug_log("getVerticalAlignment: BOTTOM (right)");
		return 1;
	}
}


// Draw VFR point.
// outcode specifies in which quadrants are 'reserved' by lines. Text should be written to free quadrant.
function drawVfrPoint(ctx, x, y, name, outcode) {
	var size=100; // %
	var h1=size*5.7735/100;
	var h2=size*2.8868/100;
	var half=size*5/100;
	ctx.beginPath();
	ctx.moveTo(x,y-h1);
	ctx.lineTo(x+half,y+h2);
	ctx.lineTo(x-half,y+h2);
	ctx.lineTo(x,y-h1);
	ctx.fill();
	//ctx.lineWidth = 1;
	ctx.closePath();
	ctx.strokeStyle = 'black';
	ctx.stroke();

	ctx.font = "14px Arial";
	ctx.fillStyle = 'black';
	//ctx.textAlign = "center";
	ctx.textAlign = getHorisontalAlignment(outcode);
	var text_y = half+half*3*getVerticalAlignment(outcode);
	
	//debug_log("drawVfrPoint: " + name + ", textAlign=" + ctx.textAlign);
	ctx.fillText(name,x,y+text_y); // y-half*2
}

// Draw Airfield.
// outcode specifies in which quadrants are 'reserved' by lines. Text should be written to free quadrant.
function drawAirfield(ctx, x, y, name, outcode) {
	var size=100; // %
	var radius=size*7/100;
	ctx.fillStyle = 'white';
	ctx.beginPath();

	var xOffset = [ 0, -2, -4, -6, -7, -7, -6, -4, -2,  2,  4,  6,  7, 7, 6, 4, 2, 0 ];
	var yOffset = [ 7,  7,  6,  4,  2, -2, -4, -6, -7, -7, -6, -4, -2, 2, 4, 6, 7, 7 ];
	ctx.moveTo( x+xOffset[0], y+yOffset[0] );
	for (var i=1; i<xOffset.length; ++i) {
		ctx.lineTo( x+xOffset[i], y+yOffset[i] );
	}

	ctx.closePath();
	ctx.strokeStyle = 'black';
	ctx.stroke();
	
	ctx.fillStyle = 'black';
	ctx.font = "14px Arial";
	ctx.textAlign = getHorisontalAlignment(outcode);
	var text_y = radius+radius*3*getVerticalAlignment(outcode);

	//debug_log("drawAirfield: " + name + ", textAlign=" + ctx.textAlign);
	ctx.fillText(name,x,y+text_y);
}



function drawAllAirfields(ctx) {
	//debug_log("drawAllAirfields()");
	if (CurrentAerodromeArray === undefined) {
		//debug_log("NOTE: drawAllAirfields(): CurrentAerodromeArray not yet loaded");
		return;
	}

	ctx.beginPath();

	var size = 3;
	for (var i = 1; i<CurrentAerodromeArray.length; ++i) {
		var y = scaleToScreenY(CurrentAerodromeArray[i].lat);
		var x = scaleToScreenX(CurrentAerodromeArray[i].lon);
		
		ctx.moveTo( x-size, y );
		ctx.lineTo( x+size, y );
		ctx.moveTo( x, y-size );
		ctx.lineTo( x, y+size );
	}
	ctx.closePath();
	ctx.strokeStyle = 'gray';
	ctx.stroke();
}



function drawArrow(ctx, x1, y1, x2, y2, direction) {
	ctx.moveTo(x1,y1);
	ctx.lineTo(x2,y2);
	ctx.strokeStyle = 'black';
	ctx.stroke();
}

function drawAirspace(ctx, coordinates, bottom) {

	var bot = bottom.split(' ');
	if (bot[0] == "SFC") { // Airspaces from surface
		ctx.strokeStyle = 'green';
		ctx.fillStyle = 'lightgreen';
		ctx.globalAlpha=0.5;
	} 
	else if (bot[0] == "FL") { // Airspaces from FL xx (typically FL 65 ->)
		ctx.strokeStyle = 'blue';
		ctx.fillStyle = 'lightblue';
		ctx.globalAlpha=0.2;
	}
	else if (bot[1] == "FT") { // Airspaces from xxxx FT
		ctx.strokeStyle = 'blue';
		ctx.fillStyle = 'lightblue';
		ctx.globalAlpha=0.4;
	}
	else { // undef
		debug_log("ERROR: drawAirspace: tuntematon ilmatilan alareunan merkintä '" + bottom + "'");
		ctx.strokeStyle = 'red';
		ctx.fillStyle = 'red';
		ctx.globalAlpha=0.7;
	}
	ctx.beginPath();
	ctx.moveTo( scaleToScreenX(coordinates[0][0]), scaleToScreenY(coordinates[0][1]));

	var coordList=0;
	for (var coord=0; coord<coordinates.length; ++coord) {
		ctx.lineTo( scaleToScreenX(coordinates[coord][0]), scaleToScreenY(coordinates[coord][1]));
	}
	
	ctx.closePath();
	ctx.fill();
	ctx.stroke();
	ctx.globalAlpha=1.0;
}


// These variables are for precalculation
var gMaxX_gMinX_CANVAS_WIDTH = 0;
var gMaxY_gMinY_CANVAS_HEIGHT = 0;

var gMinX=0;
var gMaxX=0;
var gMinY=0;
var gMaxY=0;



function resizeCanvas() {
	var c = document.getElementById("mapCanvas");
	var container = document.getElementById("planCompletionMethod");
	//debug_log("resizeCanvas old size: " + c.width + ", " + c.height);
	//debug_log("resizeCanvas container: " + container.clientWidth + ", " + container.clientHeight);

	c.width = container.clientWidth; // innerWidth;
	c.height = container.clientWidth; //innerHeight;
	if (c.width > MAX_CANVAS_SIZE) {
		c.width = MAX_CANVAS_SIZE;
		c.height = MAX_CANVAS_SIZE;
	}
	else if (c.width < MIN_CANVAS_SIZE) {
		c.width = MIN_CANVAS_SIZE;
		c.height = MIN_CANVAS_SIZE;
	}

	//debug_log("resizeCanvas new size: " + c.width + ", " + c.height);
	CANVAS_WIDTH = c.width;
	CANVAS_HEIGHT = c.height;
	
	updateMapData(mapCacheRouteArray);
}


/*
 * Calculate screen scale factors from coordinates
 * 
 * Screen:
 * 
 * gMinX        gMaxX
 * gMinY
 * 0 1 2 3 4 .. 299 -> x
 * 1
 * 2
 * 3
 * ...
 * 299 gMaxY
 * 
 */
function getScreenScale(coordArray) {
	//debug_log("getScreenScale");

	gMinY = coordArray[0].lat;
	gMaxY = coordArray[0].lat;
	gMinX = coordArray[0].lon;
	gMaxX = coordArray[0].lon;
	for (var wptInd=1; wptInd<coordArray.length; ++wptInd) {
		if (coordArray[wptInd] != null) {
			gMinY = Math.min(gMinY, coordArray[wptInd].lat);
			gMaxY = Math.max(gMaxY, coordArray[wptInd].lat);
			gMinX = Math.min(gMinX, coordArray[wptInd].lon);
			gMaxX = Math.max(gMaxX, coordArray[wptInd].lon);
		}
	}
	// Make sure map area width and height is at least 'minimum_size_deg' degrees
	var minimum_size_deg = 0.25;
	if (gMaxY-gMinY < minimum_size_deg) {
		gMinY -= minimum_size_deg/2;
		gMaxY += minimum_size_deg/2;
	}
	if (gMaxX-gMinX < minimum_size_deg) {
		gMinX -= minimum_size_deg/2;
		gMaxX += minimum_size_deg/2;
	}

	/* Scale X or Y with real distances.
	 * - 1. calculate which direction is longer (width or height, in kilometers)
	 * - 2. how much should be added to smaller distance (in kilometers, for each side)
	 * - 3. how much it is in map (in degrees)
	 * - 4. add it to min and max values
	 */

	// 1. calculate which direction is longer (width or height, in kilometers)
	var width_km = calcDistanceFrom(gMinY, gMinX, gMinY, gMaxX); // Width (minX..maxX) in km
	var height_km = calcDistanceFrom(gMinY, gMinX, gMaxY, gMinX); // Height (minY..maxY) in km
	//debug_log("Route area width_km: " + width_km);
	//debug_log("Route area height_km: " + height_km);

	var marginalX_deg = 0;
	var marginalY_deg = 0;
	var height_deg = gMaxY-gMinY; // in degrees
	var width_deg = gMaxX-gMinX; // in degrees

	if (width_km < height_km) {
		// 2. how much should be added to smaller distance (in kilometers, for each side)
		var inc_km = (height_km-width_km)/2;
		// 3. how much it is in map (in degrees)
		var inc_deg = width_deg/width_km * inc_km;
		
		// 4. add it to min and max values
		gMinX -= inc_deg;
		gMaxX += inc_deg;
		width_deg = gMaxX-gMinX; // in degrees
		
	} else {
		// 2. how much should be added to smaller distance (in kilometers, for each side)
		var inc_km = (width_km-height_km)/2;
		// 3. how much it is in map (in degrees)
		var inc_deg = height_deg/height_km * inc_km;

		// 4. add it to min and max values
		gMinY -= inc_deg;
		gMaxY += inc_deg;
		height_deg = gMaxY-gMinY; // in degrees
	}
	marginalY_deg = height_deg * SCREEN_MARGINAL/100;
	marginalX_deg = width_deg * SCREEN_MARGINAL/100;
	
	gMinY -= marginalY_deg;
	gMaxY += marginalY_deg;
	gMinX -= marginalX_deg;
	gMaxX += marginalX_deg;

	// Precalculate values for easier calculation for each coordinate
	gMaxX_gMinX_CANVAS_WIDTH = CANVAS_WIDTH/(gMaxX-gMinX);
	gMaxY_gMinY_CANVAS_HEIGHT = CANVAS_HEIGHT/(gMaxY-gMinY);
	
	/*var lenX = calcDistanceFrom(gMinY, gMinX, gMinY, gMaxX); // Width (minX..maxX) in km
	var lenX2 = calcDistanceFrom(gMaxY, gMinX, gMaxY, gMaxX); // Width (minX..maxX) in km
	var lenY = calcDistanceFrom(gMinY, gMinX, gMaxY, gMinX); // Height (minY..maxY) in km
	debug_log("Screen area width (bottom): " + lenX + " km, width (top): " + lenX2 + " km, height (km): " + lenY);
	debug_log("Screen scaling error factor (left/bottom, 1.00 = perfect): " + lenY/lenX);
	debug_log("Screen scaling error factor (top/bottom, 1.00 = perfect): " + lenX2/lenX);
	*/
}

function scaleToScreenX(coord) {
	//var screenX = (coord-gMinX) / (gMaxX-gMinX) * CANVAS_WIDTH;
	var screenX = (coord-gMinX) * gMaxX_gMinX_CANVAS_WIDTH;
	return screenX;
}

function scaleToScreenY(coord) {
	//var screenY = CANVAS_HEIGHT - (coord-gMinY) / (gMaxY-gMinY) * CANVAS_HEIGHT;
	var screenY = CANVAS_HEIGHT - (coord-gMinY) * gMaxY_gMinY_CANVAS_HEIGHT;
	return screenY;
}

/*
function createTESTdata() {
	var routeArray = new Array();
	//DMS_to_Decimal
	// reitti
	//routeArray.push(new Waypoint("61-23", 61, 23));
	//routeArray.push(new Waypoint(calcDistanceFrom(61, 23, 61, 24), 61, 24));
	//routeArray.push(new Waypoint(calcDistanceFrom(61, 23, 62, 23), 62, 23));
	//routeArray.push(new Waypoint("62-24", 62, 24));
	
	//calcDistanceFrom(61, 23, 62, 23);
	routeArray.push(new Waypoint("EFTP", DMS_to_Decimal("612455N"), DMS_to_Decimal("0233516E")));
	routeArray.push(new Waypoint("PALLO", 61.5858333, 23.7530556));
	routeArray.push(new Waypoint("TALVI", 61.7180556, 24.3958333));
	routeArray.push(new Waypoint("EFHA", DMS_to_Decimal("615123N"), DMS_to_Decimal("0244721E")));
	
	getScreenScale(routeArray);
	
	var c = document.getElementById("mapCanvas");
	var ctx = c.getContext("2d");
	
	for (var wptInd=0; wptInd<routeArray.length; ++wptInd) {
		drawAirfield(ctx, scaleToScreenX(routeArray[wptInd].lon), scaleToScreenY(routeArray[wptInd].lat), routeArray[wptInd].name);
	}
	return 0;
}
*/





/* 
 *   Draw map
 * 
 * - move names to correct place, 
 *   + out of route line
 *   - out of other labels
 * + use different size of canvas elements. Select which one to use based on screen (or some div's) width.
 * 
 * + check time used for drawing (with phones), should it be optimized? -> no need to optimize
 * + colors
 *   + edge color, 1 from surface, 2 from FTs, 3 from FL
 *   - analyze which colors would be best
 * - switch to disable drawing for higher airspaces (SFC, FL65+)
 */
function updateMapData(routeArray) {
	//debug_log("updateMapData");
	
	if (routeArray == undefined) {
		//debug_log("updateMapData - No valid route to draw. Return.");
		return;
	}
	mapCacheRouteArray = routeArray;
	
	// Get scale factors for screen, based on current route
	var timestamp_scale = debug_timestamp_start("getScreenScale");
	getScreenScale(routeArray);
	debug_timestamp_ready("getScreenScale", timestamp_scale);

	var c = document.getElementById("mapCanvas");
	var ctx = c.getContext("2d");
	
	// Clear screen
	ctx.clearRect(0,0,CANVAS_WIDTH,CANVAS_HEIGHT);

	// Draw airspaces
	var timestamp_airspace = debug_timestamp_start("Draw airspaces");
	if (airspaceData != undefined) {
		//debug_log("updateMapData - airspace");
		for (var feature=0; feature<airspaceData.features.length; ++feature) {
			//debug_log("updateMapData - airspace: name: " + airspaceData.features[feature].properties.name );
			drawAirspace(ctx, airspaceData.features[feature].geometry.coordinates[0], airspaceData.features[feature].properties.bottom );
		}
	}
	debug_timestamp_ready("Draw airspaces", timestamp_airspace);

	// Draw current route
	var timestamp_draw_route = debug_timestamp_start("draw route");
	var prev=routeArray[0];
	var next=routeArray[0];
	for (var i=0; i<routeArray.length; ++i) {
		if (routeArray[i] !== null) { // Skip missing VFR points

			// find next coordinate for calculating directions
			next = routeArray[i]; // default 'next' point
			for (var tmp_i=i+1; tmp_i<routeArray.length; ++tmp_i) {
				if (routeArray[tmp_i] !== null) {
					next = routeArray[tmp_i];
					break;
				}
			}
			// Check directions of lines
			var outcode = getOutcode(routeArray[i].lon, routeArray[i].lat, prev.lon, prev.lat);
			outcode |= getOutcode(routeArray[i].lon, routeArray[i].lat, next.lon, next.lat);
			//debug_log("outcode=" + outcode);
			
			if (i==0 || i==routeArray.length-1) { // Airfields are first and last items
				var name = routeArray[i].icao;
				if (name == "ZZZZ") {
					name += "-" + routeArray[i].name;
				}
				drawAirfield(ctx, scaleToScreenX(routeArray[i].lon), scaleToScreenY(routeArray[i].lat), name, outcode);
			}
			else {     // VFR or FIR points are all other than first and last items
				drawVfrPoint(ctx, scaleToScreenX(routeArray[i].lon), scaleToScreenY(routeArray[i].lat), routeArray[i].name, outcode);
			}
			// Route
			drawArrow(ctx, scaleToScreenX(prev.lon),scaleToScreenY(prev.lat), scaleToScreenX(routeArray[i].lon),scaleToScreenY(routeArray[i].lat), "");
			prev=routeArray[i];
		}
	}
	// Special handling for visualizing local flight, and extra special for Malmi ;)
	if (routeArray[0] == routeArray[routeArray.length-1] && routeArray[1] == null && routeArray[2] == null && routeArray[3] == null) {
		// http://www.w3schools.com/tags/tryit.asp?filename=tryhtml5_canvas_quadraticcurveto
		if (routeArray[0].icao == "EFHF") {
			ctx.beginPath();
			var cx = CANVAS_WIDTH/2;
			var cy = CANVAS_HEIGHT/2;
			ctx.moveTo(cx, cy);
			ctx.quadraticCurveTo(cx,     cy-20,  cx+20, cy-20);
			ctx.quadraticCurveTo(cx+40,  cy-20, cx+40, cy-10); 
			ctx.quadraticCurveTo(cx+35, cy+10,     cx+30, cy+20); 
			ctx.quadraticCurveTo(cx+25,  cy+30,  cx+15, cy+40); 
			ctx.quadraticCurveTo(cx+10,  cy+50,  cx+20, cy+50); 
			ctx.quadraticCurveTo(cx+30,  cy+45,  cx+30, cy+30); 
			ctx.quadraticCurveTo(cx+30,  cy+25,  cx+15, cy+20); 
			ctx.quadraticCurveTo(cx,     cy+15,  cx,    cy);
			ctx.stroke();
		}
		else {
			ctx.beginPath();
			var cx = CANVAS_WIDTH/2;
			var cy = CANVAS_HEIGHT/2;
			ctx.moveTo(cx, cy);
			ctx.quadraticCurveTo(cx,     cy-50,  cx+50, cy-100); //150, 100, 200, 50);
			ctx.quadraticCurveTo(cx+70,  cy-110, cx+90, cy-50); //220, 40, 240, 100);
			ctx.quadraticCurveTo(cx+110, cy,     cx+70, cy+30); //260, 150, 220, 180);
			ctx.quadraticCurveTo(cx+30,  cy+50,  cx+50, cy-50); //180, 200, 200, 100);
			ctx.quadraticCurveTo(cx+50,  cy-80,  cx-20, cy-40); //50 //200, 70, 130, 100);
			ctx.quadraticCurveTo(cx-40,  cy-30,  cx-20, cy); //110, 120, 130, 150);
			ctx.quadraticCurveTo(cx,     cy+20,  cx,    cy); //150, 170, 150, 150);
			ctx.stroke();
		}
	}
	debug_timestamp_ready("draw route", timestamp_draw_route);
	
	// Draw all airfields
	drawAllAirfields(ctx);
}

function onChangeDepartureAd() {
	//debug_log("onChangeDepartureAd");
	var dep=document.getElementById("departure");
	var dest=document.getElementById("destination");
	$('#departure').selectmenu('refresh');

	//var depAd = getAerodromeByIndex(dep.value);
	var depAerodrome = getAerodromeByIndex( dep.value );
	var destAerodrome = getAerodromeByIndex( dest.value );
	
	document.getElementById("route_departure_ad").innerHTML = depAerodrome.icao + " (" + depAerodrome.name + ")";

	fillVfrWaypointSelectionData(document.getElementById("route_departure_rep"), depAerodrome, destAerodrome);
	fillVfrWaypointSelectionData(document.getElementById("route_destination_rep"), destAerodrome, depAerodrome);
	$('#route_departure_rep').selectmenu('refresh');
	$('#route_destination_rep').selectmenu('refresh');
	
	fillFIRwaypointSelectionData(document.getElementById("route_fir_point"), depAerodrome, destAerodrome);
	$('#route_fir_point').selectmenu('refresh');
	
	updatePlanActivationMethods( document.getElementById("planActivationMethod"), depAerodrome );
	$('#planActivationMethod').selectmenu('refresh');
	
	createFlyingTimeTable();
	
	if (dep.value == UNOFFICIAL_AERODROME_INDEX) {
		$('#zzzz_departure_container').slideDown();
	}
	else {
		$('#zzzz_departure_container').slideUp();
	}
	
	// Get Metar, Taf and Notams (in future?) from open data service
	requestOpenDataDep(depAerodrome.icao);
}

function onChangeDestinationAd() {
	//debug_log("onChangeDestinationAd");
	var dep=document.getElementById("departure");
	var dest=document.getElementById("destination");
	$('#destination').selectmenu('refresh');

	var depAerodrome = getAerodromeByIndex( dep.value );
	var destAerodrome = getAerodromeByIndex( dest.value );
	document.getElementById("route_destination_ad").innerHTML = destAerodrome.icao + " (" + destAerodrome.name + ")";

	fillVfrWaypointSelectionData(document.getElementById("route_departure_rep"), depAerodrome, destAerodrome);
	fillVfrWaypointSelectionData(document.getElementById("route_destination_rep"), destAerodrome, depAerodrome);
	$('#route_departure_rep').selectmenu('refresh');
	$('#route_destination_rep').selectmenu('refresh');

	fillFIRwaypointSelectionData(document.getElementById("route_fir_point"), depAerodrome, destAerodrome);
	$('#route_fir_point').selectmenu('refresh');

	updatePlanActivationMethods( document.getElementById("planCompletionMethod"), destAerodrome );
	$('#planCompletionMethod').selectmenu('refresh');

	createFlyingTimeTable();
	
	if (dest.value == UNOFFICIAL_AERODROME_INDEX) {
		$('#zzzz_destination_container').slideDown();
		setFlightTimeOverride(true);
	}
	else {
		$('#zzzz_destination_container').slideUp();
		setFlightTimeOverride(false);
	}
	
	// Get Metar, Taf and Notams (in future?) from open data service
	requestOpenDataDest(destAerodrome.icao);
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



/*
 * Calculate bearing from point1 to point2
 * 
 * Input in Radian decimal -format
 * 
 * source: http://www.movable-type.co.uk/scripts/latlong.html
 */
function BearingBetweenCoordinates(lat1, lon1, lat2, lon2 ) {
	//debug_log("BearingBetweenCoordinates - " + lat1+" "+lon1+" "+lat2+" "+lon2);

	var y = Math.sin(lon2-lon1) * Math.cos(lat2);
	var x = Math.cos(lat1)*Math.sin(lat2) - Math.sin(lat1)*Math.cos(lat2)*Math.cos(lon2-lon1);
	var brng = toDeg(Math.atan2(y, x));
	
	// Result is between -180 ... + 180. To change to 0 ... 360 use "(brng+360)%360"
	brng = (brng+360)%360;
	
	//debug_log("BearingBetweenCoordinates ---> " + brng);
	return brng;
}

/*
 * Calculate bearing from point1 to point2.
 * Calculate average from start bearing and final bearing.
 * 
 * Input in Degree decimal -format
 */
function Bearing(latitude1, longitude1, latitude2, longitude2) {
	//debug_log("Bearing - " + latitude1+" "+longitude1+" "+latitude2+" "+longitude2);
	//debug_log("Bearing - " + lat1+" "+lon1+" "+lat2+" "+lon2);
	var lat1 = toRad(latitude1);
	var lon1 = toRad(longitude1);
	var lat2 = toRad(latitude2);
	var lon2 = toRad(longitude2);
	
	var startBearing = BearingBetweenCoordinates(lat1, lon1, lat2, lon2);
	var finalBearing = (BearingBetweenCoordinates(lat2, lon2, lat1, lon1) + 180)%360;
	// reverse angle  (brng+180)%360
	var average = (startBearing+finalBearing)/2;

	//debug_log("Bearing ---> start=" + startBearing + " final=" + finalBearing + " diff=" + (finalBearing-startBearing) + ", average=" + average);

	return Math.round(average);
}
// Input in Degree Minute Second -format
function Bearing_DMS(latitude1, longitude1, latitude2, longitude2) {
	//debug_log("Bearing_DMS - " + latitude1+" "+longitude1+" "+latitude2+" "+longitude2);
	//"612455N", "0233516E", "613509N", "0234511E"
	var lat1 = DMS_to_Decimal(latitude1);
	var lon1 = DMS_to_Decimal(longitude1);
	var lat2 = DMS_to_Decimal(latitude2);
	var lon2 = DMS_to_Decimal(longitude2);
	
	return Bearing(lat1, lon1, lat2, lon2);
}


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
		document.getElementById("flyingTime").innerHTML = '<a href="#page-plan-settings">Täytä Perustiedot sivulle puuttuvat tiedot!</a>';
		return;
	}	
	
	var dep=document.getElementById("departure").value;
	var dep_rep=document.getElementById("route_departure_rep").value;
	var fir_rep=document.getElementById("route_fir_point").value;
	var dest_rep=document.getElementById("route_destination_rep").value;
	var dest=document.getElementById("destination").value;
	
	var array=new Array();
	array.push(getAerodromeByIndex(dep));
	array.push(getVfrWayPointByName(dep_rep));
	array.push(getFirPointByName(fir_rep));
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
			
			// Add flight directions to table, only if previous and current points are different
			if (prev.lat != array[i].lat || prev.lon != array[i].lon) {
				row = rowBegin;
				var bearingStr = addPrefixDigits( Bearing(prev.lat, prev.lon, array[i].lat, array[i].lon).toString(), 0, 3);
				row += cellBegin + "<center>" + bearingStr + "&deg;</center>" + cellEnd;
				row += cellBegin + cellEnd;
				row += cellBegin + cellEnd;
				row += rowEnd;
				table += row;
			}

			var legDist = calcDistanceFrom(prev.lat, prev.lon, array[i].lat, array[i].lon);
			totalDist += legDist;
			
			// This means FIR point. Let's take up flight time, it is used later in EET field in FPL
			if (i==2) { // Hard coded value for third item... Assuming that it is FIR point.
				gTotalFlightTimeToFirBorder = getTimeFromDistance(totalDist, aircraftSpeed);
			}
			
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
	
	updateMapData(array);
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
	
	var dep_icao = getAerodromeByIndex( document.getElementById("departure").value ).icao;
	var dest_icao = getAerodromeByIndex( document.getElementById("destination").value ).icao;

	var linkStart = "http://ais.fi/C/flightplan/efpl_lomake/";
	var linkString = "&id=" + 		document.getElementById("aircraftIdentification").value;
	linkString += "&rules=V"; // + 		document.getElementById("flightRules").value;
	linkString += "&type=G"; // + 		document.getElementById("flightType").value;
	linkString += "&aircraft=" + 	document.getElementById("aircraftType").value;
	linkString += "&cat=L"; // + 		document.getElementById("wakeTurbulenceCat").value;
	linkString += "&equipment=" + 	document.getElementById("equipment").value;
	linkString += "&ssr=" + 		document.getElementById("ssr").value;
	linkString += "&ad=" + 			dep_icao;
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
	
	// Combine route
	linkString += "&route=";
	var routeStr="";
	if (document.getElementById("route_departure_rep").value !== "") {
		routeStr += document.getElementById("route_departure_rep").value;
	}
	if (document.getElementById("route").value !== "") {
		if (routeStr.length > 0) { // Add space if needed
			routeStr += " ";
		}
		routeStr += document.getElementById("route").value;
	}
	if (document.getElementById("route_fir_point").value !== "") {
		if (routeStr.length > 0) { // Add space if needed
			routeStr += " ";
		}
		routeStr += document.getElementById("route_fir_point").value;
	}
	if (document.getElementById("route_destination_rep").value !== "") {
		if (routeStr.length > 0) { // Add space if needed
			routeStr += " ";
		}
		routeStr += document.getElementById("route_destination_rep").value;
	}
	// Check if route is empty, then add space.
	if (routeStr == "") {
		routeStr += " ";
	}

	linkString += routeStr;
	
	linkString += "&dad=" + dest_icao;
	
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
	
	// If country is changing, then EET information must be added.
	if (getCountryByICAO(dep_icao) != getCountryByICAO(dest_icao)) {
		var firPoint = document.getElementById("route_fir_point").value;
		// Calculate flight time to FIR point
		other += "EET%252F" + firPoint + convertFlyingTimeToString(gTotalFlightTimeToFirBorder) + " ";
	}

	other += "RMK%252F";
	if (document.getElementById("planActivationMethod").value == "phoneOnGound") {
		other += "DEP " + BY_PHONE_STR + get_ACC_STR_by_country(getCountryByICAO(dep_icao) ) + " ";
	}
	else if (document.getElementById("planActivationMethod").value == "rtfOnAir") {
		var dep=document.getElementById("departure");
		var depAerodrome = getAerodromeByIndex( dep.value );
		//debug_log("dep acc =" + depAerodrome.acc);
		other += "DEP " + BY_RTF_STR + get_ACC_STR_by_country(getCountryByICAO(dep_icao)) + " " + depAerodrome.acc + " ";
		
		if (depAerodrome.acc == NOTE_TO_ADD_ACC_FREQ_STR) {
			alertText += "\nLähtöpaikan ACC jakso.";
			showAlertText = true;
		}
	}

	if (document.getElementById("planCompletionMethod").value == "phoneOnGound") {
		other += "ARR " + BY_PHONE_STR + get_ACC_STR_by_country(getCountryByICAO(dest_icao)) + " ";
	}
	else if (document.getElementById("planCompletionMethod").value == "rtfOnAir") {
		var dest=document.getElementById("destination");
		var destAerodrome = getAerodromeByIndex( dest.value );
		//debug_log("dest acc =" + destAerodrome.acc);
		other += "ARR " + BY_RTF_STR + get_ACC_STR_by_country(getCountryByICAO(dest_icao)) + " " + destAerodrome.acc + " ";
		
		if (destAerodrome.acc == NOTE_TO_ADD_ACC_FREQ_STR) {
			alertText += "\nLaskupaikan ACC jakso.";
			showAlertText = true;
		}
	}

	// Remove possible '+' from phone number. It was interpreted as additional space in FPL form.
	var pilotTel = document.getElementById("pilotTel").value;
	//debug_log("pilotTel 1 '" + pilotTel + "'");
	if (pilotTel[0] == '+') {
		pilotTel = pilotTel.substr(1, pilotTel.length-1);
	}
	//debug_log("pilotTel 2 '" + pilotTel + "'");
	
	other += "PIC TEL " + pilotTel;

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

	var persons="";
	var personsSelection = document.getElementsByName("persons");
	for(var i = 0; i < personsSelection.length; i++) {
		if(personsSelection[i].checked) {
			persons = personsSelection[i].value;
			break;
		}
	}
	linkString += "&person=" + persons;
	
	linkString += "&markings=" + document.getElementById("aircraftColor").value;
	
	if (document.getElementById("pyrotechnicsOnBoard").value == "on")
	{
		linkString += "&remarks=" + PYROTECHNICS_NOTE_REMARKS;
	}
	
	linkString += "&pic=" + document.getElementById("pilot").value;
	linkString += "&tel=" + pilotTel;
	linkString += "&filed=" + document.getElementById("pilot").value;
	
	
	// Convert scandinavian letters
	linkString = convertScandinavianLetters(linkString);

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

	var dep_icao = getAerodromeByIndex( document.getElementById("departure").value ).icao;
	var dest_icao = getAerodromeByIndex( document.getElementById("destination").value ).icao;
	
	if (document.getElementById("planActivationMethod").value == "phoneOnGound") {
		plan.activation_method = BY_PHONE_STR + get_ACC_STR_WITH_PHONE_by_country(getCountryByICAO(dep_icao));
	}
	else if (document.getElementById("planActivationMethod").value == "rtfOnAir") {
		var dep=document.getElementById("departure");
		var depAerodrome = getAerodromeByIndex( dep.value );
		plan.activation_method = BY_RTF_STR + get_ACC_STR_by_country(getCountryByICAO(dep_icao)) + " " + depAerodrome.acc + " ";
	}
	else {
		plan.activation_method = BY_TWR;
	}

	if (document.getElementById("planCompletionMethod").value == "phoneOnGound") {
		plan.completion_method = BY_PHONE_STR + get_ACC_STR_WITH_PHONE_by_country(getCountryByICAO(dest_icao));
	}
	else if (document.getElementById("planCompletionMethod").value == "rtfOnAir") {
		var dest=document.getElementById("destination");
		var destAerodrome = getAerodromeByIndex( dest.value );
		plan.completion_method = BY_RTF_STR + get_ACC_STR_by_country(getCountryByICAO(dest_icao)) + " " + destAerodrome.acc + " ";
	}
	else {
		plan.completion_method = BY_TWR;
	}
	
	
	plan.takeoff_time = d.toJSON();
	//plan.takeoff_time = timeStr;
	plan.identification = document.getElementById("aircraftIdentification").value;
	// TODO add coordinates to departure and destination (later)
	plan.departure = dep_icao;
	plan.dep_name = getAerodromeByIndex( document.getElementById("departure").value ).name;
	plan.dep_route = document.getElementById("route_departure_rep").value;
	var route = document.getElementById("route").value;
	plan.route = $( '<p>'+ route +'</p>').text(); // Remove html from input field...
	if (plan.route.length != 0) {
		plan.route += " ";
	}
	plan.route += document.getElementById("route_fir_point").value;

	plan.dest_route = document.getElementById("route_destination_rep").value;
	plan.destination = dest_icao;
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
		return "https://ais.fi/ais/bulletins/envfra.htm#" + icao;
	}
	else if (icao >= 'EFMA' && icao <='EFYL') {
		return "https://ais.fi/ais/bulletins/envfrm.htm#" + icao;
	}
	else if (icao >= 'EEAA' && icao <='EEZZ') { // AA and ZZ are just to include all letters...
		return "https://ais.fi/ais/bulletins/eettvfr.htm#" + icao;
	}
	return "https://ais.fi/ais/bulletins/";
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


function exportSettings() {
    // export all locally stored data into a JSON file

    // http://jsfiddle.net/k56eezxp/
    var jsonFile = null,
        _createJsonFileUrl = function(txt) {
            var data = new Blob([txt], {type: 'application/json'});
            if(jsonFile !== null) {
                window.URL.revokeObjectURL(jsonFile);
            }
            jsonFile = window.URL.createObjectURL(data);
            return jsonFile;
        },
        link = document.createElement("a");
    link.setAttribute("download", "fpl-data.json");
    link.href = _createJsonFileUrl(JSON.stringify(localStorage));
    document.body.appendChild(link);
    window.requestAnimationFrame(function() {
        link.dispatchEvent(new MouseEvent("click"));
        document.body.removeChild(link);
    });
}

function importSettings(event) {
    var dataStr = "",
        input = event.target,
        reader = new FileReader();
    reader.onload = function() {
        dataStr = reader.result;
        //console.log(dataStr);
		try {
	        var data = JSON.parse(dataStr);
	        for(var key in data) {
	            localStorage[key] = data[key];
	        }
	        updateFromLocalStorage();
	        onChangeAircraftSpeed();
	        updateStoredPlanList() ;
		} catch(err) {
			alert("Virhe JSON tiedoston lataamisessa. Tiedosto on virheellinen.\n" + err );
		}
    };
    reader.readAsText(input.files[0]);
}
