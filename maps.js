startLocation = [30.288220, -97.743252]

myBestKnownLocation = [startLocation[0],startLocation[1]];
mySmoothedLocation = [startLocation[0],startLocation[1]];

var mymap = L.map('mapid').setView(startLocation, 15);

L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token=pk.eyJ1IjoibWFwYm94IiwiYSI6ImNpejY4NXVycTA2emYycXBndHRqcmZ3N3gifQ.rJcFIG214AriISLbB6B5aw', {
  maxZoom: 18,
  attribution: 'songitude',
  id: 'mapbox.streets'
}).addTo(mymap);

myBestLocationMarker = L.marker(myBestKnownLocation).addTo(mymap)
mySmoothedLocationMarker = L.marker(mySmoothedLocation).addTo(mymap)


function loopingLocationUpdate() {
  // do some math to update the current location to be closer to the new one
  mySmoothedLocation[0] = mySmoothedLocation[0] + .1 * (myBestKnownLocation[0] -mySmoothedLocation[0])
  mySmoothedLocation[1] = mySmoothedLocation[1] + .1 * (myBestKnownLocation[1] -mySmoothedLocation[1])
  // update the audio to match
  if(IS_LIVE && EXPERIENCE_NAME in ALL_SONGS){
    for(i = 0; i < ALL_SONGS[EXPERIENCE_NAME].length; i++){
      ALL_SONGS[EXPERIENCE_NAME][i].updateAudioForLocation(mySmoothedLocation[0],mySmoothedLocation[1])
    }    
  }
  // and update the map to look like it
  updateMap()
}

function updateMap() {
  mymap.removeLayer(myBestLocationMarker)
  myBestLocationMarker = L.marker(myBestKnownLocation).addTo(mymap)

  mymap.removeLayer(mySmoothedLocationMarker)
  mySmoothedLocationMarker = L.marker(mySmoothedLocation).addTo(mymap)
}

function onMapClick(e) {
  if(DEBUG_ENABLED){
    myBestKnownLocation = [e.latlng.lat, e.latlng.lng];
    console.log(myBestKnownLocation);    
  }
}

mymap.on('click', onMapClick);





