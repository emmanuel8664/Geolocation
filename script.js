var trackId = null;
//Store positions
var locations =[];

function displayLocation(position) {

	var latitude = position.coords.latitude;
	var longitude = position.coords.longitude;

	//Store position in a google object
	var googleLoc = new google.maps.LatLng(position.coords.latitude,position.coords.longitude);
	locations.push(googleLoc);
	

	var pLocation = document.getElementById("location");
	pLocation.innerHTML +=  latitude + "," + longitude + "<br>";


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


}

function displayError(error){ 

	var errors = ["Unknow error","Permission denied by user", "Position not available", "Timeout error"];
	var message = errors[error.code];
	console.warn("Error in getting your location" + message, error.message);
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

window.onload = function() {

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
	/*/

}