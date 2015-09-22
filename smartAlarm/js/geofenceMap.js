var geofenceMap = null;
var distanceWidget;
var executeOnce;
var homeLat =13.0502745;
var homeLng =77.6232895;
var homeLocation = new google.maps.LatLng(homeLat, homeLng);
var geofenceMap = null;
var autocomplete;
var globalMarkerLocation;
var submittedRadius;
var submittedLocation;
var isSubmitted = false;
var randomNumber=1;
var y=0;
var markers = {};
var markerId;
var markerArray = new Array();
var marker;
var isEnteredAddress = false;

function loadMap(radVal)
{
	$('#radius_map_new').val(radVal);
	console.log("loading map");
	console.log("jump , geofenceMap ="+geofenceMap);
	if(geofenceMap == null)
	{
		var mapDiv = document.getElementById('map-canvas');
		geofenceMap = new google.maps.Map(mapDiv, {
			zoom:15,
			panControl:false,
			zoomControl:false,
			mapTypeControl:true,
			scaleControl:false,
			streetViewControl:false,
			overviewMapControl:false,
			rotateControl:false,
			mapTypeId: 'roadmap'
		});
	    google.maps.event.addListener(geofenceMap, "idle", function()
	    {
		  google.maps.event.trigger(geofenceMap, 'resize');
		  geofenceMap.setZoom(geofenceMap.getZoom());
	    });
	}
	if(isEnteredAddress)
	{
		refreshMap(globalMarkerLocation,radVal);
	}
	else
	{
		if(globalMarkerLocation == null)
			{
				refreshMap(homeLocation,radVal);
				clickedonMap(homeLocation);
			}
		else
			{
				refreshMap(globalMarkerLocation,radVal);
				clickedonMap(globalMarkerLocation);
			}
	}
	
	google.maps.event.addListener(geofenceMap, 'click', function(event) {
		/*distanceWidget = new DistanceWidget(simulateScreenMap,event.latLng);
		displayAddress(distanceWidget);*/
		clickedonMap(event.latLng);
		refreshMap(event.latLng,globalRadius);
	});
}
function handleMapEvents(loc,radVal)
{
	distanceWidget = new DistanceWidget(geofenceMap,loc,radVal);
	google.maps.event.addListener(distanceWidget, 'distance_changed', function() {
		 $('#radius_map_new').val(globalRadius);
		 executeOnce = true;
	     google.maps.event.addListener(sizer,'dragend',function(event) {
	    	 console.log("end drag");
	    	 if(executeOnce)
	    		 {
	    		 executeOnce = false;
	    		 console.log("ended drag: exec once");
	    		 clearAllMarkers();
	    		 handleMapEvents(loc,globalRadius);
	    		 }
	    	 
	     });
	});
}
function enteredRadiusVal()
{
	var checkRad = document.getElementById('radius_map_new').value;
	var numbers = /^[0-9]+$/;  
	if(checkRad > 100 || (checkRad.match(numbers) ==  false))
		{ 
		//error or invalid
		document.getElementById('radius_map_new').blur();
		document.getElementById('radius_map_new').value="";
		//alert("Radius should be in between 1 and 10");
		}
	else
		{
			globalRadius = checkRad;
			refreshMap(globalMarkerLocation ,globalRadius);
		}	
}

function initialize() {
	  // Create the autocomplete object, restricting the search to geographical location types.         
	  autocomplete = new google.maps.places.Autocomplete(
	      /** @type {HTMLInputElement} */(document.getElementById('inputAddressBar')),
	      { types: [] });
	  // When the user selects an address from the dropdown,populate the address fields in the form.
	  google.maps.event.addListener(autocomplete, 'place_changed', function() {
		  isEnteredAddress = true;
		  fillInAddress(autocomplete.getPlace());
	  });
	}

function fillInAddress(temp_place) {
  // Get the place details from the autocomplete object.
	globalAddressObject = temp_place;
  console.log("Selected Address from drop down menu is :"+temp_place.formatted_address);
  // stops execution if address is not selected from the drop down menu
  globalMarkerLocation = temp_place.geometry.location;
  refreshMap(globalMarkerLocation,globalRadius);
 }

function refreshMap(markerLocation,radVal)
{
	randomNumber++;
	marker=new google.maps.Marker({
		  position:markerLocation,
		  markerId:randomNumber,
		  //animation:google.maps.Animation.DROP
		  });
	marker.setMap(geofenceMap);
	 google.maps.event.addListener(geofenceMap, "idle", function()
			    {
				  google.maps.event.trigger(geofenceMap, 'resize');
				  geofenceMap.setZoom(geofenceMap.getZoom());
					geofenceMap.setCenter(markerLocation);
			    });

	handleMarker();
	handleMapEvents(markerLocation,radVal);
}

function handleMarker()
{
	y=y+1;
	markerId = marker.markerId;
	markerArray[y]  = markerId;
	markers[markerId] = marker;
	if(y!=1)
	delMarker(markerId);
	marker =  markers[markerId]  ;
}

var delMarker = function (markerId) {
	y=y-1;
	markerId=markerArray[y];
	marker = markers[markerId];
	marker.setMap(null);
	y=y+1;
};

function clickedonMap(clickedLocation,updateAddrss)
{
	var geocoderAlert = true;
	var geocoder = new google.maps.Geocoder();
	var clickedAddress;
	globalMarkerLocation = clickedLocation;
	geocoder.geocode({'latLng': clickedLocation}, function(results, status) {
	    if (status == google.maps.GeocoderStatus.OK)
	    {
		    if (results[1])
		    {
				geofenceMap.setCenter(clickedLocation);
				clickedAddress = results[0].formatted_address;
				console.log("CLICKED ADDRESS :"+results[0].formatted_address);
//				fillInAddress(results[1]);
				if(updateAddrss)
				{
				$('#inputAddressBar').val('');
				$('#inputAddressBar').val(clickedAddress);
				}
		    }
		    else
		    {
		        alert('No results found');
		    }
	    }
	    else
	    {
	    	if(status == "ERROR")
	    	{
	    		if(geocoderAlert)
	    		{
	    				alert("Geocoder failed due to: ERROR. Problem with internet connectivity");
	    				geocoderAlert = false;
	    		}
	    	}
	    }
	});	
}

function saveMapData()
{
	isSubmitted = true;
	submittedRadius = globalRadius;
	submittedLocation = globalMarkerLocation;
	var radius_Unit = 'Km';	
	if($('#mi_img').hasClass('radio-select')){
		radius_Unit = 'Mi';
	}
	$('#rad_unit').text(radius_Unit);
	$('#geofence_radius').text(globalRadius);
}

function restoreMapData()
{
	if(isSubmitted)
		{
			globalRadius = submittedRadius;
			globalMarkerLocation = submittedLocation;
		}
	else
		{
			globalRadius = startingRadiusVal;
			globalMarkerLocation = homeLocation;
			if($('#mi_img').hasClass('radio-select')){
				$('#mi_img').removeClass('radio-select').addClass('radio-unselect');
		   		$('#km_img').removeClass('radio-unselect').addClass('radio-select');
			}			
		}
}
