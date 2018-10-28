var trackId = null;
//Store positions
var locations =[];

var map;

var markers = [];

var infoWindow;

var service;

var currentCoords = {};

function displayLocation(position) {

	var latitude = position.coords.latitude;
	var longitude = position.coords.longitude;

	/*/
	var pTime = document.getElementById("time");
	t2 = Date.now();
	pTime.innerHTML += "<br>Computed in " + (t2-t1) + "milliseconds";

	//Store position in a google object
	var googleLoc = new google.maps.LatLng(position.coords.latitude,position.coords.longitude);
	locations.push(googleLoc);
	/*/

	var pLocation = document.getElementById("location");
	pLocation.innerHTML +=  latitude + "," + longitude + "<br>";

	/*/
	var pInfo = document.getElementById("info");
	var date = new Date(position.timestamp);
	pInfo.innerHTML = "Location timestamp:" + date + "<br>";
	pInfo.innerHTML += "Accuracy of location:" + position.coords.accuracy + "meters<br>";
	/*/

/*/



	var pInfo = document.getElementById("info");
	var date = new Date(position.timestamp);
	pInfo.innerHTML = "Location timestamp:" + date + "<br>";
	pInfo.innerHTML += "Accuracy of location:" + position.coords.accuracy + "meters<br>";

	if(position.coords.altitude){
		pInfo.innerHTML += "Altitude: " + position.coords.altitude;
	}
	else {
		console.log("Altitude: ", position.coords.altitude);
	}

    if(position.coords.altitudeAccuracy){
		pInfo.innerHTML += "with accuracy: " + position.coords.altitudeAccuracy + "in meters";
	}
	else {
		console.log("Altitude accuracy: ", position.coords.altitudeAccuracy);
	}
	pInfo.innerHTML+="<br>";

	if(position.coords.heading){
		pInfo.innerHTML += "Heading: " + position.coords.heading+ "<br>";
	}
	else {
		console.log("Heading is : ", position.coords.heading);
	}

    if(position.coords.speed){
		pInfo.innerHTML += "Speed: " + position.coords.speed + "<br>";
	}
	else {
		console.log("Speed is: ", position.coords.speed);
	}


	/*/

	showMap(position.coords);



}

function showMap(coords){

	currentCoords.latitude = coords.latitude;
	currentCoords.longitude = coords.longitude;

	var googleLatLong = new google.maps.LatLng(coords.latitude,coords.longitude);

	var mapOptions = {

		zoom:11,
		center: googleLatLong,
		mapTypeId: google.maps.MapTypeId.ROADMAP
	};

	var mapDiv= document.getElementById("map");
	map = new google.maps.Map(mapDiv, mapOptions);
	service = new google.maps.places.PlacesService(map);
	infoWindow = new google.maps.InfoWindow();

	google.maps.event.addListener(map, "click", function(event){

	var latitude = event.latLng.lat();	
	var longitude = event.latLng.lng();

	currentCoords.latitude = latitude;
	currentCoords.longitude = longitude;

	var pLocation = document.getElementById("location");
	pLocation.innerHTML =  latitude + "," + longitude;
	map.panTo(event.latLng);
	

	});

	showForm();

}

function makePlacesRequest(lat, lng) {
	var query = document.getElementById("query").value;
	if (query) {
		var placesRequest = {
			location: new google.maps.LatLng(lat, lng),
			radius: 1000,
			keyword: query
		};
		service.nearbySearch(placesRequest, function(results, status) {
			if (status == google.maps.places.PlacesServiceStatus.OK) {
				results.forEach(function(place) {
					createMarker(place);
					//console.log(place);
				});
			} 
		});

	} else {
		console.log("No query entered for places search");
	}
} 

function createMarker (place) { 

	var markerOptions = {

		position:place.geometry.location,
		map:map,
		clickable:true

	};

	var marker = new google.maps.Marker(markerOptions);
	markers.push(marker);

	google.maps.event.addListener(marker,"click",function(place,marker){
		
		return function(){
			if(place.vicinity){
				infoWindow.setContent(place.name + "<br>" + place.vicinity);
			}else {
				infoWindow.setContent(place.name);
			}
			infoWindow.open(map,marker);
		};
	}(place,marker));

}

function displayError(error){ 

	var errors = ["Unknow error","Permission denied by user", "Position not available", "Timeout error"];
	var message = errors[error.code];
	console.warn("Error in getting your location" + message, error.message);

	var pError =document.getElementById('error');
	pError.innerHTML = "Error in getting your location: " + message + ", " + error.message;
}

function clearMarkers(){ 
	markers.forEach(function(marker){marker.setMap(null);});
	markers = [];
}

function showForm(){
	var searchForm = document.getElementById("search");
	searchForm.style.visibility = "visible";

	var button = document.querySelector("button");
	button.onclick = function(e){
		e.preventDefault();
		clearMarkers();
		//Make a places search request
		makePlacesRequest(currentCoords.latitude,currentCoords.longitude);

		//Make a places search request
		//console.log("Clicked the search button");
	};
}

function trackMe(){
	trackId = navigator.geolocation.watchPosition(displayLocation,displayError);
}

function clearTracking(){
	if(trackId){
		navigator.geolocation.clearWatch(trackId);
		trackId=null;
	}
}

//Compute the total distance 
function computeTotalDistance(){
	var totalDistance =0;

	if(locations.length>1){
		for (var i = 1; i< locations.length; i++) {
			totalDistance+=google.maps.geometry.spherical.computeDistanceBetween(locations[i-1],locations[i]);
		}
	}
	return totalDistance;
}

var t1=0, t2=0;

window.onload = function() {



	/*/

	var pTime = document.getElementById("time");
	pTime.innerHTML = "Timeout: 5000, maximunAge: 0"

	t1 = Date.now();
	navigator.geolocation.getCurrentPosition(displayLocation,displayError,{enableHighAccuracy:true,timeout:5000,maximunAge:0});

	/*/


/*/

	//Get elements from the dom
	var pDistance = document.getElementById("distance");
	var trackButton = document.querySelector("button");
	//Handle onClick event for the button
	trackButton.onclick = function(e) {
		//Prevent submit
		e.preventDefault();
		//Change text when someone click on
		if(trackButton.innerHTML==="Start"){
			trackButton.innerHTML = "Stop";
			trackMe();
		}
		else{
			trackButton.innerHTML = "Start";
			//Clean tracking
			clearTracking();
			//Print distance
			var d = computeTotalDistance();
			if(d>0){
				d=Math.round(d*1000)/1000;
				pDistance.innerHTML="Total distance traveled: " + d + "km";
			}
			else {
				pDistance.innerHTML="You didn't travel anywhere at all.";
			}
		}
	}

/*/

	

	if (navigator.geolocation){
		
		navigator.geolocation.getCurrentPosition(displayLocation, displayError);
	}
	else {
		alert("Sorry, this browser doesn't support geolocation!");
	}
	

}