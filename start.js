
DEBUG_ENABLED = true;
GLOBAL_TIMESTEP = 200;

ENTIRE_WORK = []
IS_LIVE = false;


options = {
  enableHighAccuracy: true,
  timeout: 5000,
  maximumAge: 0
};

function getLocation() {
  if (navigator.geolocation) {
      navigator.geolocation.watchPosition(showPosition, showError, options);
  } else {
      x.innerHTML = "Geolocation is not supported by this browser.";
  }
}
function showPosition(position) {
	// this is the line that makes it location based and not just clicking arround
	//myBestKnownLocation = [position.coords.latitude,position.coords.longitude];
	console.log(position.coords.latitude + "," + position.coords.longitude);
}
function showError(error) {
  console.log("error!: "+error)
}

getLocation();
// the "looping location update" is the function where literally everything happens
window.setInterval(loopingLocationUpdate, GLOBAL_TIMESTEP);

