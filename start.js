
DEBUG_ENABLED = true;
GLOBAL_TIMESTEP = 1000;
FADE_BUFFER = 100;
CATCHUP_SPEED = .2;

ALL_SONGS = []
IS_LIVE = false;
EXPERIENCE_NAME = 'noSelection'

options = {
  enableHighAccuracy: true,
  timeout: 5000,
  maximumAge: 0
};

function begin(){
  var sel = document.getElementById('experienceSelector');
  if(sel.value != 'noSelection'){
    EXPERIENCE_NAME = sel.value
    console.log("chosen: "+EXPERIENCE_NAME)
  }
  makeAllLive()
}


function getLocation() {
  if (navigator.geolocation) {
      navigator.geolocation.watchPosition(showPosition, showError, options);
  } else {
      x.innerHTML = "Geolocation is not supported by this browser.";
  }
}
function showPosition(position) {
	// this is the line that makes it location based and not just clicking arround
  if(!DEBUG_ENABLED){
    myBestKnownLocation = [position.coords.latitude,position.coords.longitude];
  }
	console.log(position.coords.latitude + "," + position.coords.longitude);
}
function showError(error) {
  console.log("error!: "+error)
}

getLocation();
// the "looping location update" is the function where literally everything happens
window.setInterval(loopingLocationUpdate, GLOBAL_TIMESTEP);


function makeAllDead(){
  for(var key in ALL_SONGS){
    for(i = 0; i < ALL_SONGS[key].length; i++){
      ALL_SONGS[key][i].makeDead()
    }
  }
}

function makeAllLive(){
  console.log("We are live wowowowowl")
  for(i = 0; i < ALL_SONGS[EXPERIENCE_NAME].length; i++){
    ALL_SONGS[EXPERIENCE_NAME][i].loadAudio()
    ALL_SONGS[EXPERIENCE_NAME][i].makeLive()
    ALL_SONGS[EXPERIENCE_NAME][i].mute()
  }
  IS_LIVE = true;
}


