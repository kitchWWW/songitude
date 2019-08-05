DEBUG_ENABLED = false;
GLOBAL_TIMESTEP = 200;
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
  console.log("beginning")
  console.log(EXPERIENCE_NAME)
  makeAllLive()
  document.getElementById("beginExperience").style.display="none"
  document.getElementById("exitExperience").style.display="inline"

}

function exit(){
  console.log(EXPERIENCE_NAME)
  document.getElementById("beginExperience").style.display="inline"
  document.getElementById("exitExperience").style.display="none"
  makeAllDead(EXPERIENCE_NAME)
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


// now we can set up the thing where we choose which experience we want:
songsToLoad = 0
songsActuallyLoaded = 0
EXPERIENCE_NAME = 'default'
function loadAllAudio(){
  for(i = 0; i < ALL_SONGS[EXPERIENCE_NAME].length; i++){
    ALL_SONGS[EXPERIENCE_NAME][i].loadAudio()
    console.log("loading....")
    songsToLoad += 1
  }
}


function displayLoading(){
  console.log(songsToLoad +" "+ songsActuallyLoaded)
  document.getElementById("myProgressBar").style.width = ((songsActuallyLoaded * 100.0) / songsToLoad) +"%"
  if(songsActuallyLoaded == songsToLoad){
    document.getElementById("loadingText").innerHTML = "Loaded!"
    clearInterval(refreshIntervalId);
    document.getElementById("allLoading").style.display="none"
    document.getElementById("beginExperience").style.display="inline"

  }
}

function startDisplayLoading(){
  refreshIntervalId = setInterval(displayLoading, 100);
}


window.onload = function() {
  EXPERIENCE_NAME = getUrlVars()['experience']
  loadAllAudio();
  startDisplayLoading();
  for(i = 0; i < ALL_SONGS[EXPERIENCE_NAME].length; i++){
    ALL_SONGS[EXPERIENCE_NAME][i].addToMap()
  }
};

function makeAllDead(key){
  for(i = 0; i < ALL_SONGS[key].length; i++){
    ALL_SONGS[key][i].makeDead()
  }
}


function makeAllLive(){
  group = new Pizzicato.Group();
  console.log("We are live wowowowowl")
  for(i = 0; i < ALL_SONGS[EXPERIENCE_NAME].length; i++){
    ALL_SONGS[EXPERIENCE_NAME][i].makeLive()
    try{
      group.addSound(ALL_SONGS[EXPERIENCE_NAME][i].soundFile)
    }catch{
      // if we are going back and the sounds are already there.
    }
  }
  IS_LIVE = true;

  var compressor = new Pizzicato.Effects.Compressor({
      threshold: -24,
      ratio: 12,
      mix:1
  });
  group.addEffect(compressor)

}

function doDebug(){
  console.log(document.getElementById("debugEnableCheckbox").value)
  DEBUG_ENABLED = !DEBUG_ENABLED
  console.log(DEBUG_ENABLED)
}


function fetchHeader(url, wch) {
    try {
        var req=new XMLHttpRequest();
        req.open("HEAD", url, false);
        req.send(null);
        if(req.status== 200){
            res= req.getResponseHeader(wch);
            document.getElementById("lastUpdated").innerHTML = "Last updated: " + res
        }
        else return false;
    } catch(er) {
        return er.message;
    }
}

fetchHeader('start.js','Last-Modified');

window.onclick = function(){
  let context = Pizzicato.context
  let source = context.createBufferSource()
  source.buffer = context.createBuffer(1, 1, 22050)
  source.connect(context.destination)
  source.start()
}


