test( "starting test", function() {
	ok( 1 == "1", "Passed!" );
});


test( "DMS_to_DM", function() {
  equal( DMS_to_DM("680514N"),  "6805N" );
  equal( DMS_to_DM("680514N"),  "6805N" );
  equal( DMS_to_DM("683937N"),  "6840N" );
  equal( DMS_to_DM("684241N"),  "6843N" );
  equal( DMS_to_DM("634244N"),  "6343N" );
  equal( DMS_to_DM("623047N"),  "6231N" );
  equal( DMS_to_DM("620052N"),  "6201N" );
  equal( DMS_to_DM("621828N"),  "6218N" );
  equal( DMS_to_DM("651800N"),  "6518N" );
  equal( DMS_to_DM("604526N"),  "6045N" );
  equal( DMS_to_DM("620143N"),  "6202N" );
  equal( DMS_to_DM("621926N"),  "6219N" );
  equal( DMS_to_DM("623510N"),  "6235N" );
  equal( DMS_to_DM("623410N"),  "6234N" );
  equal( DMS_to_DM("615351N"),  "6154N" );
  equal( DMS_to_DM("630216N"),  "6302N" );
  equal( DMS_to_DM("613409N"),  "6134N" );
  equal( DMS_to_DM("690734N"),  "6908N" );
  equal( DMS_to_DM("611633N"),  "6117N" );

  equal( DMS_to_DM("611633S"),  "6117S" );

  equal( DMS_to_DM("0270726E"),  "02707E" );
  equal( DMS_to_DM("0254221E"),  "02542E" );
  equal( DMS_to_DM("0254510E"),  "02545E" );
  equal( DMS_to_DM("0252342E"),  "02524E" );
  equal( DMS_to_DM("0240403E"),  "02404E" );
  equal( DMS_to_DM("0230329E"),  "02303E" );
  equal( DMS_to_DM("0223047E"),  "02231E" );
  equal( DMS_to_DM("0252500E"),  "02525E" );
  equal( DMS_to_DM("0264421E"),  "02644E" );
  equal( DMS_to_DM("0243955E"),  "02440E" );
  equal( DMS_to_DM("0224139E"),  "02242E" );
  equal( DMS_to_DM("0222850E"),  "02229E" );
  equal( DMS_to_DM("0220339E"),  "02204E" );
  equal( DMS_to_DM("0261116E"),  "02611E" );
  equal( DMS_to_DM("0220732E"),  "02208E" );
  equal( DMS_to_DM("0280049E"),  "02801E" );
  equal( DMS_to_DM("0271410E"),  "02714E" );
  equal( DMS_to_DM("0240026E"),  "02400E" );

  equal( DMS_to_DM("0061900W"),  "00619W" );
});


test( "Decimal_to_DMS_lat", function() {
  equal( Decimal_to_DMS_lat( DMS_to_Decimal("680514N") ),  "680514N" );
  equal( Decimal_to_DMS_lat( DMS_to_Decimal("683937N") ),  "683937N" );
  equal( Decimal_to_DMS_lat( DMS_to_Decimal("684241N") ),  "684241N" );
  equal( Decimal_to_DMS_lat( DMS_to_Decimal("634244N") ),  "634244N" );
  equal( Decimal_to_DMS_lat( DMS_to_Decimal("623047N") ),  "623047N" );
  equal( Decimal_to_DMS_lat( DMS_to_Decimal("620052N") ),  "620052N" );
  equal( Decimal_to_DMS_lat( DMS_to_Decimal("621828N") ),  "621828N" );
  equal( Decimal_to_DMS_lat( DMS_to_Decimal("651800N") ),  "651800N" );
  equal( Decimal_to_DMS_lat( DMS_to_Decimal("604526N") ),  "604526N" );
  equal( Decimal_to_DMS_lat( DMS_to_Decimal("620143N") ),  "620143N" );
  equal( Decimal_to_DMS_lat( DMS_to_Decimal("621926N") ),  "621926N" );
  equal( Decimal_to_DMS_lat( DMS_to_Decimal("623510N") ),  "623510N" );
  equal( Decimal_to_DMS_lat( DMS_to_Decimal("623410N") ),  "623410N" );
  equal( Decimal_to_DMS_lat( DMS_to_Decimal("615351N") ),  "615351N" );
  equal( Decimal_to_DMS_lat( DMS_to_Decimal("630216N") ),  "630216N" );
  equal( Decimal_to_DMS_lat( DMS_to_Decimal("613409N") ),  "613409N" );
  equal( Decimal_to_DMS_lat( DMS_to_Decimal("690734N") ),  "690734N" );
  equal( Decimal_to_DMS_lat( DMS_to_Decimal("611633N") ),  "611633N" );

  equal( Decimal_to_DMS_lat( DMS_to_Decimal("611633S") ),  "611633S" );
});


test( "Decimal_to_DMS_lon", function() {
  equal( Decimal_to_DMS_lon( DMS_to_Decimal("0270726E") ),  "0270726E" );
  equal( Decimal_to_DMS_lon( DMS_to_Decimal("0254221E") ),  "0254221E" );
  equal( Decimal_to_DMS_lon( DMS_to_Decimal("0254510E") ),  "0254510E" );
  equal( Decimal_to_DMS_lon( DMS_to_Decimal("0252342E") ),  "0252342E" );
  equal( Decimal_to_DMS_lon( DMS_to_Decimal("0240403E") ),  "0240403E" );
  equal( Decimal_to_DMS_lon( DMS_to_Decimal("0230329E") ),  "0230329E" );
  equal( Decimal_to_DMS_lon( DMS_to_Decimal("0223047E") ),  "0223047E" );
  equal( Decimal_to_DMS_lon( DMS_to_Decimal("0252500E") ),  "0252500E" );
  equal( Decimal_to_DMS_lon( DMS_to_Decimal("0264421E") ),  "0264421E" );
  equal( Decimal_to_DMS_lon( DMS_to_Decimal("0243955E") ),  "0243955E" );
  equal( Decimal_to_DMS_lon( DMS_to_Decimal("0224139E") ),  "0224139E" );
  equal( Decimal_to_DMS_lon( DMS_to_Decimal("0222850E") ),  "0222850E" );
  equal( Decimal_to_DMS_lon( DMS_to_Decimal("0220339E") ),  "0220339E" );
  equal( Decimal_to_DMS_lon( DMS_to_Decimal("0261116E") ),  "0261116E" );
  equal( Decimal_to_DMS_lon( DMS_to_Decimal("0220732E") ),  "0220732E" );
  equal( Decimal_to_DMS_lon( DMS_to_Decimal("0280049E") ),  "0280049E" );
  equal( Decimal_to_DMS_lon( DMS_to_Decimal("0271410E") ),  "0271410E" );
  equal( Decimal_to_DMS_lon( DMS_to_Decimal("0240026E") ),  "0240026E" );
  
  equal( Decimal_to_DMS_lon( DMS_to_Decimal("0240026W") ),  "0240026W" );
  equal( Decimal_to_DMS_lon( DMS_to_Decimal("0061900W") ),  "0061900W" );
});
/*
<aerodrome lat="" lon=""><icao>ZZZZ</icao><name>Vuotso</name><atc>no</atc><acc>126.100</acc></aerodrome>
<aerodrome lat="" lon=""><icao>ZZZZ</icao><name>Martiniiskonpalo</name><atc>no</atc><acc>126.100</acc></aerodrome>
<aerodrome lat="" lon=""><icao>ZZZZ</icao><name>Jäkäläpää</name><atc>no</atc><acc>126.100</acc></aerodrome>
<aerodrome lat="" lon=""><icao>ZZZZ</icao><name>Haapajärvi</name><atc>no</atc><acc>132.325</acc></aerodrome>
<aerodrome lat="" lon=""><icao>ZZZZ</icao><name>Karhukangas Ähtäri</name><atc>no</atc><acc>127.100</acc></aerodrome>
<aerodrome lat="" lon=""><icao>ZZZZ</icao><name>Parkano</name><atc>no</atc><acc>127.100</acc></aerodrome>
<aerodrome lat="" lon=""><icao>ZZZZ</icao><name>Nummijärvi</name><atc>no</atc><acc>127.100</acc></aerodrome>
<aerodrome lat="" lon=""><icao>ZZZZ</icao><name>Sorosenperä Ii</name><atc>no</atc><acc>124.200</acc></aerodrome>
<aerodrome lat="" lon=""><icao>ZZZZ</icao><name>Ummeljoki</name><atc>no</atc><acc>135.525</acc></aerodrome>
<aerodrome lat="" lon=""><icao>ZZZZ</icao><name>Mänttä</name><atc>no</atc><acc>132.325</acc></aerodrome>
<aerodrome lat="" lon=""><icao>ZZZZ</icao><name>Ilvesjoki</name><atc>no</atc><acc>127.100</acc></aerodrome>
<aerodrome lat="" lon=""><icao>ZZZZ</icao><name>Myllykylä Kurikka</name><atc>no</atc><acc>127.100</acc></aerodrome>
<aerodrome lat="" lon=""><icao>ZZZZ</icao><name>Norinkylä Teuva</name><atc>no</atc><acc>127.100</acc></aerodrome>
<aerodrome lat="" lon=""><icao>ZZZZ</icao><name>Leivonmäen Höystösensuo Joutsa</name><atc>no</atc><acc>132.325</acc></aerodrome>
<aerodrome lat="" lon=""><icao>ZZZZ</icao><name>Vähäkyrö</name><atc>no</atc><acc>127.100</acc></aerodrome>
<aerodrome lat="" lon=""><icao>ZZZZ</icao><name>Pistohiekka Puumala</name><atc>no</atc><acc>135.525</acc></aerodrome>
<aerodrome lat="" lon=""><icao>ZZZZ</icao><name>Kaamanen</name><atc>no</atc><acc>126.100</acc></aerodrome>
<aerodrome lat="" lon=""><icao>ZZZZ</icao><name>Valkeakoski</name><atc>no</atc><acc>127.100</acc></aerodrome>
*/

/*
// Decimal_to_DMS_lat
test( "getCoordinatesStringFromAerodrome", function() {
  equal( getCoordinatesStringFromAerodrome( 0 ),  "0" );
});
*/


test( "convertFlyingTimeToString", function() {
  equal( convertFlyingTimeToString( 0 ),  "0000" );
  equal( convertFlyingTimeToString( 1 ),  "0001" );
  equal( convertFlyingTimeToString( 9 ),  "0009" );
  equal( convertFlyingTimeToString( 10 ), "0010" );
  equal( convertFlyingTimeToString( 29 ), "0029" );
  equal( convertFlyingTimeToString( 59 ), "0059" );
  equal( convertFlyingTimeToString( 60 ), "0100" );
  equal( convertFlyingTimeToString( 61 ), "0101" );
  equal( convertFlyingTimeToString( 119 ),"0159" );
  equal( convertFlyingTimeToString( 120 ),"0200" );
  equal( convertFlyingTimeToString( 300 ),"0500" );
  equal( convertFlyingTimeToString( 600 ),"1000" );
  equal( convertFlyingTimeToString( 599 ),"0959" );
  equal( convertFlyingTimeToString( 611 ),"1011" );
});



test( "convertScandinavianLetters", function() {
  equal( convertScandinavianLetters( "a" ), "a" );
  equal( convertScandinavianLetters( "o" ), "o" );
  
  equal( convertScandinavianLetters( "ä" ), "a" );
  equal( convertScandinavianLetters( "Ä" ), "A" );
  equal( convertScandinavianLetters( "Å" ), "A" );
  equal( convertScandinavianLetters( "ö" ), "o" );
  equal( convertScandinavianLetters( "Ö" ), "O" );
  equal( convertScandinavianLetters( "mäki testailee ääkkösiä" ), "maki testailee aakkosia" );
  equal( convertScandinavianLetters( "ÄÄKKÖSIÄ" ), "AAKKOSIA" );
  equal( convertScandinavianLetters( "aAäÄåÅoOöÖ" ), "aAaAaAoOoO" );
});



test( "timeNext5mins", function() {
  equal( timeNext5mins( 0 ), 0 );
  equal( timeNext5mins( 1 ), 5 );
  equal( timeNext5mins( 4 ), 5 );
  equal( timeNext5mins( 5 ), 5 );
  equal( timeNext5mins( 6 ), 10 );
  equal( timeNext5mins( 59 ), 60 );
  equal( timeNext5mins( 60 ), 60 );
  equal( timeNext5mins( 61 ), 65 );
});

test( "getTimeFromDistance", function() {
  equal( getTimeFromDistance( 150, 0 ), "Tarkista lentonopeus!" );
  equal( getTimeFromDistance( 75, 150 ), 30 );
  equal( getTimeFromDistance( 300, 150 ), 120 );
});

test( "addPrefixDigits", function() {
  equal( addPrefixDigits( "1", 5, 4 ), "5551" );
  equal( addPrefixDigits( "1", 0, 4 ), "0001" );
  equal( addPrefixDigits( "10", 0, 4 ), "0010" );
  equal( addPrefixDigits( "100", 0, 4 ), "0100" );
  equal( addPrefixDigits( "1000", 0, 4 ), "1000" );
  equal( addPrefixDigits( "10000", 0, 4 ), "10000" );
});

test( "DMS_to_Decimal", function() {
  equal( DMS_to_Decimal("000000N"), "0" );
  equal( DMS_to_Decimal("673613N"), "67.6036111111111" );
  equal( DMS_to_Decimal("673613n"), "67.6036111111111" );
  equal( DMS_to_Decimal("673613S"), "-67.6036111111111" );
  equal( DMS_to_Decimal("673613s"), "-67.6036111111111" );
  equal( DMS_to_Decimal("0235818E"), "23.971666666666668" );
  equal( DMS_to_Decimal("0235818e"), "23.971666666666668" );
  equal( DMS_to_Decimal("0235818W"), "-23.971666666666668" );
  equal( DMS_to_Decimal("0235818w"), "-23.971666666666668" );
});


// "612455N" lon="0233516E" TP
//  <wpt lat="61.5858333" lon="23.7530556"> <name>PALLO</name> 613509N 0234511E 
// <wpt lat="61.4880556" lon="23.3261111">  <name>PURSO</name> 612917N 0231934E 
// <wpt lat="61.3013889" lon="23.7175000">  <name>VIILA</name> 611805N 0234303E
//  630031N" lon="0274740E KU
// 630243N" lon="0214551E VA
test( "Bearing_DMS", function() {
	// north, south, east west
	// short distance
	// long distance
	equal( Bearing_DMS("630031N", "0274740E", "640031N", "0274740E" ),  "0" ); // tp north
	equal( Bearing_DMS("630031N", "0274740E", "620031N", "0274740E" ),  "180" ); // tp south

	equal( Bearing_DMS("630031N", "0274740E", "630031N", "0284740E" ),  "90" ); // tp east

	equal( Bearing_DMS("630031N", "0274740E", "612455N", "0233516E" ),  "231" ); // KU -> TP
	equal( Bearing_DMS("612455N", "0233516E", "630031N", "0274740E" ),  "51" );  // TP -> KU
	
	equal( Bearing_DMS("612455N", "0233516E", "613509N", "0234511E" ),  "25" ); // TP -> PALLO
	equal( Bearing_DMS("612455N", "0233516E", "612917N", "0231934E" ), "300" ); // TP -> PURSO
	equal( Bearing_DMS("612455N", "0233516E", "611805N", "0234303E" ), "151" ); // TP -> VIILA


	equal( Bearing_DMS("612455N", "0233516E", "630243N", "0214551E" ),  "332" );  // TP -> VA
	equal( Bearing_DMS("630243N", "0214551E", "612455N", "0233516E" ),  "152" ); // VA -> TP

});


test( "Metar JSON Parsing", function() {
	var metar_json = '{"result":"success","code":200,"data":{"EFTP":{"station":"EFTP","observation_time":1429642200,"coordinates":{"latitude":"61.42","longitude":"23.62"},"tmp":"5.0","dewpt":"1.0","wind":{"dir":"220","spd":"1","gust":""},"visibility":"6.21","altimeter":"30.088583","pressure":"","quality":{"auto":"TRUE"},"wx_string":"","sky_conditions":[{"sky_cover":"CAVOK"}],"category":"VFR","3hr":{"pressure_change":"","precip":""},"6hr":{"tmp_min":"","tmp_max":"","precip":""},"24hr":{"tmp_min":"","tmp_max":"","precip":""},"precip_sincelast":"","precip_snow":"","type":"METAR","elevation":"","raw":"EFTP 211850Z AUTO 22001KT CAVOK 05\/01 Q1019"}}}';
	var metar = JSON.parse(metar_json);
	equal( metar.result,  "success" );
	//debug_log("METAR: metar.result=" + metar.result);
	equal( metar.code,  200 );
	equal( metar.data.EFTP.station, "EFTP"  );
	equal( metar.data.EFTP.observation_time, 1429642200  );
	equal( metar.data.EFTP.raw, "EFTP 211850Z AUTO 22001KT CAVOK 05\/01 Q1019"  );
	//debug_log("METAR: metar.data.EFTP.raw=" + metar.data.EFTP.raw);

	var sel = "EFTP";
	equal( metar.data[sel].station, "EFTP"  );
});



/*
{
	"data": [{
		"validFrom":  "2015-11-12T00:00:00Z",
		"aerodromes": "data/aerodromes_12NOV2015.xml",
		"zzzzfields": "data/zzzz_fields_28MAY2015.xml",
		"vfrpoints":  "data/EF_VFRREP_12NOV2015.xml"
	}, {
		"validFrom":  "2016-01-01T00:00:00Z",
		"aerodromes": "data/aerodromes_01JAN2016.xml",
		"zzzzfields": "data/zzzz_fields_28MAY2015.xml",
		"vfrpoints":  "data/EF_VFRREP_12NOV2015.xml"
	}]
} 
 */

test( "JSON validity check", function( assert ) {
	var done = assert.async();
	var expectedFileCount = 0;
	var actualValidFileCount = 0;
	
	$.getJSON(DATA_VALIDITY_JSON_FILE, 
		function(data, textStatus, jqXHR) {
			console.log( "success" );
			//var today = new Date("2016-01-06T00:00:00Z"); // This is for testing
			
			var today = new Date();

			VFRPortFilename = "";
			AerodromesFilename = "";
			ZZZZFieldsFilename = "";
			AirspaceFilename = "";
			EE_AerodromesFilename = "";
			FirPointsFilename = "";
			
			var prevDate = new Date();
			var firstDateWithinRange = 0;
			
			expectedFileCount = data.data.length * 3; // 3 files / date
			for (var i=0; i<data.data.length; ++i) {
				
				notEqual(data.data[i].validFrom, "", "validFrom not empty (during loop)");
				notEqual(data.data[i].validFrom, undefined, "validFrom exists (during loop)");

				var dateOfUpdate = new Date(data.data[i].validFrom);
				console.log( "dateOfUpdate: " + dateOfUpdate);
				notEqual(dateOfUpdate, "Invalid Date" , "dateOfUpdate is valid (during loop)");
				
				if (i == 0) {
					ok(today.getTime() >= dateOfUpdate.getTime(), "First date in file should be before today");
					prevDate = dateOfUpdate;
				} else {
					ok(prevDate.getTime() < dateOfUpdate.getTime(), "Dates should be in increasing order");
					prevDate = dateOfUpdate;
				}

				if (today.getTime() >= dateOfUpdate.getTime()) {
					firstDateWithinRange = 1;
					
					console.log( "set filenames" );
					VFRPortFilename = "";
					AerodromesFilename = "";
					ZZZZFieldsFilename = "";
					AirspaceFilename = "";
					EE_AerodromesFilename = "";
					FirPointsFilename = "";

					AerodromesFilename = data.data[i].aerodromes;
					ZZZZFieldsFilename = data.data[i].zzzzfields;
					VFRPortFilename = data.data[i].vfrpoints;
					AirspaceFilename = data.data[i].airspace;
					EE_AerodromesFilename = data.data[i].EE_aerodromes;
					FirPointsFilename = data.data[i].FirPoints;
					console.log( "file1: " + AerodromesFilename);
					console.log( "file2: " + ZZZZFieldsFilename);
					console.log( "file3: " + VFRPortFilename);
					console.log( "file4: " + AirspaceFilename);
					console.log( "file5: " + EE_AerodromesFilename);
					console.log( "file6: " + FirPointsFilename);
				}
				else { 
					equal(firstDateWithinRange, 1, "First date should be included in ranges");
				}
				notEqual(data.data[i].vfrpoints, "", "vfrpoints not empty (during loop)");
				notEqual(data.data[i].aerodromes, "", "aerodromes not empty (during loop)");
				notEqual(data.data[i].EE_aerodromes, "", "EE_aerodromes not empty (during loop)");
				notEqual(data.data[i].zzzzfields, "", "zzzzfields not empty (during loop)");
				notEqual(data.data[i].airspace, "", "airspace not empty (during loop)");
				notEqual(data.data[i].FirPoints, "", "FirPoints not empty (during loop)");

				notEqual(data.data[i].vfrpoints, undefined, "vfrpoints exists (during loop)");
				notEqual(data.data[i].aerodromes, undefined, "aerodromes exists (during loop)");
				notEqual(data.data[i].EE_aerodromes, undefined, "EE_aerodromes exists (during loop)");
				notEqual(data.data[i].zzzzfields, undefined, "zzzzfields exists (during loop)");
				notEqual(data.data[i].airspace, undefined, "airspace exists (during loop)");
				notEqual(data.data[i].FirPoints, undefined, "FirPoints exists (during loop)");
				
				// Check that file actually founds
				$.get(data.data[i].vfrpoints, 
					function(data, textStatus, jqXHR) {
						console.log( "vfrpoints success" );
						actualValidFileCount++;
						if (actualValidFileCount == expectedFileCount) {
							done();
						}
					}).fail(function() {
						ok( 0 == "1", "Failure in vfrpoints file loading." );
					});
				$.get(data.data[i].aerodromes, 
					function(data, textStatus, jqXHR) {
						console.log( "aerodromes success" );
						actualValidFileCount++;
						if (actualValidFileCount == expectedFileCount) {
							done();
						}
					}).fail(function() {
						ok( 0 == "1", "Failure in aerodromes file loading." );
					});
				$.get(data.data[i].EE_aerodromes, 
					function(data, textStatus, jqXHR) {
						console.log( "EE_aerodromes success" );
						actualValidFileCount++;
						if (actualValidFileCount == expectedFileCount) {
							done();
						}
					}).fail(function() {
						ok( 0 == "1", "Failure in EE_aerodromes file loading." );
					});
				$.get(data.data[i].FirPoints, 
					function(data, textStatus, jqXHR) {
						console.log( "FirPoints success" );
						actualValidFileCount++;
						if (actualValidFileCount == expectedFileCount) {
							done();
						}
					}).fail(function() {
						ok( 0 == "1", "Failure in FirPoints file loading." );
					});
				$.get(data.data[i].zzzzfields, 
					function(data, textStatus, jqXHR) {
						console.log( "zzzzfields success" );
						actualValidFileCount++;
						if (actualValidFileCount == expectedFileCount) {
							done();
						}
					}).fail(function() {
						ok( 0 == "1", "Failure in zzzzfields file loading." );
					});
				$.get(data.data[i].airspace, 
					function(data, textStatus, jqXHR) {
						console.log( "airspace success" );
						actualValidFileCount++;
						if (actualValidFileCount == expectedFileCount) {
							done();
						}
					}).fail(function() {
						ok( 0 == "1", "Failure in airspace file loading." );
					});
				
			}
			console.log( "check filenames are not empty" );
			notEqual(VFRPortFilename, "", "VFR port filename is not empty (after selection)");
			notEqual(AerodromesFilename, "", "Aerodromes filename is not empty (after selection)");
			notEqual(EE_AerodromesFilename, "", "EE_AerodromesFilename filename is not empty (after selection)");
			notEqual(ZZZZFieldsFilename, "", "ZZZZ fields filename is not empty (after selection)");
			notEqual(AirspaceFilename, "", "Airspace filename is not empty (after selection)");
			notEqual(FirPointsFilename, "", "FirPoints filename is not empty (after selection)");

			notEqual(VFRPortFilename, undefined, "VFR port filename exists (after selection)");
			notEqual(AerodromesFilename, undefined, "Aerodromes filename exists (after selection)");
			notEqual(EE_AerodromesFilename, undefined, "EE_Aerodromes filename exists (after selection)");
			notEqual(ZZZZFieldsFilename, undefined, "ZZZZ fields filename exists (after selection)");
			notEqual(AirspaceFilename, undefined, "Airspace filename exists (after selection)");
			notEqual(FirPointsFilename, undefined, "FirPoints filename exists (after selection)");

			console.log( "check filenames check done" );

		}).fail(function() {
			ok( 0 == "1", "Failure in json file loading. File not found or syntax error." );
		}).always(function() {
			console.log( "always" );
			//done();
		});
   
});

//test( "createTESTdata", function() {
//  equal( createTESTdata(), "0" );
//});


//var outcode_TOP_LEFT 	= 0x1;
//var outcode_TOP_RIGHT 	= 0x2;
//var outcode_BOTTOM_LEFT	= 0x4;
//var outcode_BOTTOM_RIGHT= 0x8;

test( "getOutcode", function() {
	equal( getOutcode(10, 10, 15, 15), outcode_TOP_RIGHT );
	equal( getOutcode(10, 10, 5, 15),  outcode_TOP_LEFT );
	equal( getOutcode(10, 10, 5, 5),   outcode_BOTTOM_LEFT );
	equal( getOutcode(10, 10, 15, 5),  outcode_BOTTOM_RIGHT );
	//equal( getOutcode(10, 10, 10, 10), outcode_BOTTOM_LEFT );
	equal( getOutcode(10, 10, 10, 10), 0 );
});



// function getHorisontalAlignment(outcode)
test( "getHorisontalAlignment", function() {
	equal( getHorisontalAlignment(outcode_TOP_LEFT|outcode_TOP_RIGHT|outcode_BOTTOM_LEFT|outcode_BOTTOM_RIGHT), "left" ); // default if all directions are reserved

	equal( getHorisontalAlignment(outcode_TOP_LEFT|                  outcode_BOTTOM_LEFT|outcode_BOTTOM_RIGHT), "left" );
	equal( getHorisontalAlignment(                 outcode_TOP_RIGHT|outcode_BOTTOM_LEFT|outcode_BOTTOM_RIGHT), "right" );

	equal( getHorisontalAlignment(outcode_TOP_LEFT|outcode_TOP_RIGHT|                    outcode_BOTTOM_RIGHT), "right" );
	equal( getHorisontalAlignment(outcode_TOP_LEFT|outcode_TOP_RIGHT|outcode_BOTTOM_LEFT                     ), "left" );
	equal( getHorisontalAlignment(                                   outcode_BOTTOM_LEFT|outcode_BOTTOM_RIGHT), "center" );
	equal( getHorisontalAlignment(outcode_TOP_LEFT|outcode_TOP_RIGHT                                         ), "center" );
	equal( getHorisontalAlignment( 0                                                                         ), "center" );
});

// getVerticalAlignment(outcode)
test( "getVerticalAlignment", function() {
	equal( getVerticalAlignment(outcode_TOP_LEFT|outcode_TOP_RIGHT|outcode_BOTTOM_LEFT|outcode_BOTTOM_RIGHT), 1 );
	equal( getVerticalAlignment(                 outcode_TOP_RIGHT|outcode_BOTTOM_LEFT|outcode_BOTTOM_RIGHT), -1 );
	equal( getVerticalAlignment(outcode_TOP_LEFT|                  outcode_BOTTOM_LEFT|outcode_BOTTOM_RIGHT), -1 );
	equal( getVerticalAlignment(outcode_TOP_LEFT|outcode_TOP_RIGHT|                    outcode_BOTTOM_RIGHT), 1 );
	equal( getVerticalAlignment(outcode_TOP_LEFT|outcode_TOP_RIGHT|outcode_BOTTOM_LEFT                     ), 1 );
	equal( getVerticalAlignment(                                   outcode_BOTTOM_LEFT|outcode_BOTTOM_RIGHT), -1 );
	equal( getVerticalAlignment(outcode_TOP_LEFT|outcode_TOP_RIGHT                                          ), 1 );
	equal( getVerticalAlignment(                 outcode_TOP_RIGHT                                          ), 1 );
	equal( getVerticalAlignment(outcode_TOP_LEFT                                                            ), 1 );
});

// getCountryByICAO(icao)
test( "getCountryByICAO", function() {
	equal( getCountryByICAO('EFTP'), 'EF' );
	equal( getCountryByICAO('EFTS'), 'EF' );
	equal( getCountryByICAO('EERI'), 'EE' );
	equal( getCountryByICAO('ESST'), 'ES' );
	equal( getCountryByICAO('ZZZZ'), 'EF' );

	equal( getCountryByICAO('efts'), 'EF' );
	equal( getCountryByICAO('eeri'), 'EE' );
	equal( getCountryByICAO('esst'), 'ES' );
	equal( getCountryByICAO('zzzz'), 'EF' );

	//equal( getCountryByICAO('zzz'), 'EF' );
});

// get_ACC_STR_by_country(country)
test( "get_ACC_STR_by_country", function() {
	equal( get_ACC_STR_by_country('EF'), 'EFIN' );
	equal( get_ACC_STR_by_country('EE'), 'TALLINN ACC' );
	//equal( get_ACC_STR_by_country('ES'), 'ACC' );
});


// get_ACC_STR_WITH_PHONE_by_country(country)
test( "get_ACC_STR_WITH_PHONE_by_country", function() {
	equal( get_ACC_STR_WITH_PHONE_by_country('EF'), 'EFIN +35832865172 ' );
	equal( get_ACC_STR_WITH_PHONE_by_country('EE'), 'TALLINN ACC +3726258254 ' );
	//equal( get_ACC_STR_WITH_PHONE_by_country('ES'), 'ACC +35832865172 ' );
});




// Helper for testing floats. Rounding for 3 decimals.
function about(val) {
	var accuracy = 1000;
	return Math.round(val*accuracy)/accuracy;
}

// getAngle()
test( "getAngle", function() {
	equal( about(getAngle(0, 0, 5, 0)), 0 ); // horizontal
	equal( about(getAngle(0, 0, 0, 5)), 90 ); //vertical
	
	equal( about(getAngle(0, 0, 5, 5)), 45 ); // easy one
	equal( about(getAngle(0, 0, 5, -5)), -45 ); // easy to down
	
	equal( about(getAngle(10, 10, 15, 15)), 45 ); // not starting from zero
	
	equal( about(getAngle(0, 0, -5, 5)), 90+45 ); // over 90 deg
	equal( about(getAngle(0, 0, -5, 0)), 90+90 ); // over 90 deg
	equal( about(getAngle(0, 0, -5, -5)), 90+90+45 ); // over 90 deg

	equal( about(getAngle(0, 0, 1, 5)), 78.690 ); // near but less than 90
	equal( about(getAngle(0, 0, -1, 5)), 180-78.690 ); // near but over 90
});

var CANVAS_SIZE = 400;
var SCALE_SIZE = 20;

// Helper for testing
function drawLine(x1, y1, x2, y2, linestyle) {
	var c = document.getElementById("canvas");
	var ctx = c.getContext("2d");

	x1 *= SCALE_SIZE;
	y1 *= -SCALE_SIZE;
	x2 *= SCALE_SIZE;
	y2 *= -SCALE_SIZE;
	
	x1 += CANVAS_SIZE/2;
	y1 += CANVAS_SIZE/2;
	x2 += CANVAS_SIZE/2;
	y2 += CANVAS_SIZE/2;
	
	ctx.beginPath();
	ctx.moveTo(x1,y1);
	ctx.lineTo(x2,y2);
	ctx.closePath();
	ctx.strokeStyle = linestyle;
	ctx.stroke();
	//ctx.globalAlpha=1.0;
	
}

// Helper for testing
function clearCanvas() {
	var c = document.getElementById("canvas");
	var ctx = c.getContext("2d");

	c.width = CANVAS_SIZE;
	c.height = CANVAS_SIZE;
	
	// Clear screen
	ctx.clearRect(0,0,CANVAS_SIZE,CANVAS_SIZE);
}


// Helper for testing
function visualizeCheckReject(p1x, p1y, p2x, p2y, b1x, b1y, b2x, b2y) {
	drawLine(p1x, p1y, p2x,p2y, 'blue');
	var linestyle = 'lightgreen';
	if (isCrossing(p1x, p1y, p2x, p2y, b1x, b1y, b2x, b2y)) {
		linestyle = 'red';
	}
	
	drawLine(b1x, b1y, b2x,b2y, linestyle);
}

// checkReject()
test( "checkReject", function() {
	
	equal( checkReject(0,0, 5,0,  5,0, 0,5), false );
	equal( checkReject(0,0, 5,0,  0,5, 5,0), false );
	equal( checkReject(0,0, 5,5,  5,0, 0,5), false );

	equal( checkReject(0,0, 4,2,  5,1, 5,3), false );
	equal( checkReject(0,0, 4,2,  6,1, 6,3), false );
	equal( checkReject(0,0, 4,2,  7,1, 7,3), true );

	equal( checkReject(0,4, 4,2,  5,1, 5,3), false );
	equal( checkReject(0,4, 4,2,  6,1, 6,3), false );
	equal( checkReject(0,4, 4,2,  7,1, 7,3), true );

	equal( checkReject(0,0, 4,2,  1,0, 1,3), false );
	equal( checkReject(0,0, 4,2,  2,0, 2,3), false );
	equal( checkReject(0,0, 4,2,  3,0, 3,3), false );
	
	equal( checkReject(0,0, 4,2,  -1,1, -1,-1), true );
	equal( checkReject(0,0, 4,2,  -2,1, -2,-1), true );
	equal( checkReject(0,0, 4,2,  -3,1, -3,-1), true );

	clearCanvas();
	/*visualizeCheckReject(0,0, 4,2,  -3,-1, -3,3);
	visualizeCheckReject(0,0, 4,2,  -2,-1, -2,3);
	visualizeCheckReject(0,0, 4,2,  -1,-1, -1,3);
	visualizeCheckReject(0,0, 4,2,  0,-1, 0,3);
	visualizeCheckReject(0,0, 4,2,  1,-1, 1,3);
	visualizeCheckReject(0,0, 4,2,  2,-1, 2,3);
	visualizeCheckReject(0,0, 4,2,  3,-1, 3,3);
	visualizeCheckReject(0,0, 4,2,  4,-1, 4,3);
	visualizeCheckReject(0,0, 4,2,  5,-1, 5,3);
	visualizeCheckReject(0,0, 4,2,  6,-1, 6,3);
	visualizeCheckReject(0,0, 4,2,  7,-1, 7,3);
*/
	equal( checkReject(0,0, 4,2,  6, 1, -1, -1), true );
	
	//debug_log("random test   ------------------------- ");

	//visualizeCheckReject(0,0, 4,2,  6.594984004111872, -0.752569929246576, -9.306045700727609, -6.364890641735252);
	//visualizeCheckReject(0,0, 4,2,  6, 1, -4, -2); // fail
	//visualizeCheckReject(0,0, 4,2,  6, 1, -1, -1);

	var px1 = Math.random()*20 - 10;
	var py1 = Math.random()*20 - 10;
	var px2 = Math.random()*20 - 10;
	var py2 = Math.random()*20 - 10;
	for (var i=0; i<20; ++i) {
		var x1 = Math.random()*20 - 10;
		var y1 = Math.random()*20 - 10;
		var x2 = Math.random()*20 - 10;
		var y2 = Math.random()*20 - 10;
		//visualizeCheckReject(0,0, 4,2,  x1,y1,x2,y2);
		visualizeCheckReject(px1,py1, px2,py2,  x1,y1,x2,y2);
	}

});



// Helper function for testing. Draws lines to canvas
function DrawNumOfCrossingLines(p1x, p1y, p2x, p2y, coordinates) {
	drawLine(p1x, p1y, p2x, p2y, 'red');

	var count = 0;
	for (var coord=1; coord<coordinates.length; ++coord) {
		var b1x = coordinates[coord-1][0];
		var b1y = coordinates[coord-1][1];
		var b2x = coordinates[coord][0];
		var b2y = coordinates[coord][1];
		drawLine(b1x, b1y, b2x,b2y, 'blue');
		
		var crossing = isCrossing(p1x, p1y, p2x, p2y, b1x, b1y, b2x, b2y);
		if (crossing) {
			count++;
		}
	}
	
	return count;
}

test( "numOfCrossingLines", function() {
	//clearCanvas();

	var airspace = {
		"type" : "FeatureCollection",
		"features" : [{
			"type" : "Feature",
			"properties" : {
				"name" : "EFTP CTR",
				"top" : "2000 FT MSL",
				"bottom" : "SFC"
			},
			"geometry" : {
				"type" : "Polygon",
				"coordinates" : [[[0, 0], [5, 1], [4, 6], [-1, 5], [0, 0]]]
			}
		}]
	};

	equal( numOfCrossingLines(1,2, 5,0,  airspace.features[0].geometry.coordinates[0]), 1 );
	equal( numOfCrossingLines(-2,4, 6,3,  airspace.features[0].geometry.coordinates[0]), 2 );
	equal( numOfCrossingLines(-1,-1, 1,1,  airspace.features[0].geometry.coordinates[0]), 1 );
	
	equal( numOfCrossingLines(2.5,1, 2.5,0.5,  airspace.features[0].geometry.coordinates[0]), 1 );
	equal( numOfCrossingLines(1,2.5, -0.5,2.5,  airspace.features[0].geometry.coordinates[0]), 1 );
	equal( numOfCrossingLines(1.5,5, 1.5,5.5,  airspace.features[0].geometry.coordinates[0]), 0 ); // not hitting line at this side
	equal( numOfCrossingLines(4,3.5, 4.5,3.5,  airspace.features[0].geometry.coordinates[0]), 0 ); // not hitting line at this side

});





test( "getCrossedAirspaces", function() {
	var airspace = {
		"type" : "FeatureCollection",
		"features" : [{
			"type" : "Feature",
			"properties" : {
				"name" : "EFTP CTR",
				"top" : "2000 FT MSL",
				"bottom" : "SFC"
			},
			"geometry" : {
				"type" : "Polygon",
				"coordinates" : [[[0, 0], [5, 1], [4, 6], [-1, 5], [0, 0]]]
			}
		},
		{
		"type": "Feature",
		"properties": {
			"name": "EFTP TMA EAST",
			"top": "FL 95",
			"bottom": "2000 FT MSL"
		},
		"geometry": {
		"type": "Polygon",
		"coordinates": [[[-2, -2], [7, -2], [5, 8], [-4, 6], [-2, -2]]]
		}
		},
		{
		"type": "Feature",
		"properties": {
		"name": "EFHA CTR",
		"top": "2000 FT MSL",
		"bottom": "SFC"
		},
		"geometry": {
		"type": "Polygon",
		"coordinates": [[[0, -8], [5, -8], [4, -3], [-1, -4], [0, -8]]]
		}
		},
		]
	};
	//clearCanvas();

	equal( getCrossedAirspaces(1,2, 5,0,  airspace), "EFTP" );
	var a = getCrossedAirspaces(-5,5, 8,0,  airspace);
	equal( a.length, 2 );
	equal( a[0], "EFTP" );
	equal( a[1], "EFTP" );
	a = getCrossedAirspaces(2,2, 3,-7,  airspace);
	equal( a.length, 3 );
	equal( a[0], "EFTP" );
	equal( a[1], "EFTP" );
	equal( a[2], "EFHA" );

	/*equal( getCrossedAirspaces(1,2, 5,0,  airspace), "EFTP CTR" );
	var a = getCrossedAirspaces(-5,5, 8,0,  airspace);
	equal( a.length, 2 );
	equal( a[0], "EFTP CTR" );
	equal( a[1], "EFTP TMA EAST" );
	a = getCrossedAirspaces(2,2, 3,-7,  airspace);
	equal( a.length, 3 );
	equal( a[0], "EFTP CTR" );
	equal( a[1], "EFTP TMA EAST" );
	equal( a[2], "EFHA CTR" );
	*/

/* TODO
 EFTP VIILA PETOT KÄRDLA hakee EFTU CTA:n mukaan...
 - check (from map) should it be? problem in own map?
 */



});







