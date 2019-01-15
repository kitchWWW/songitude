

class Footprint {

  constructor(file,maxLevel){
    this.soundFilePath = file
    this.maxLevel = maxLevel
    console.log("hi?")
  }

	// used for the legwork
	updateAudioForLocation(lat,lng){}
	
	//used to kill all sound
	mute(){}

  loadAudio(){
    this.soundFile = loadSound(this.soundFilePath)
  }

  makeLive(){
    console.log("we are live!")
    this.soundFile.setVolume(0)
    this.soundFile.loop()
  }

}


class FPCircle extends Footprint{
  
  constructor(lat,lng,diameter,color,file,maxLevel) {
    super(file,maxLevel)
    this.shape = L.circle([lat, lng], {
      color: color,
      fillColor: color,
      fillOpacity: 0.1,
      radius: diameter
  }).addTo(mymap);
    this.lat = lat
    this.lng = lng
    this.diameter = diameter
  
  }

  updateAudioForLocation(lat,lng){
    var distanceFromCenter = getDistanceFromLatLonInM(lat,lng,this.lat,this.lng)
    if(distanceFromCenter < this.diameter){
      var ratio = (this.diameter - distanceFromCenter) / this.diameter
      this.soundFile.setVolume(ratio * this.maxLevel,(GLOBAL_TIMESTEP/1000.0))
    }else{
      this.soundFile.setVolume(0,1)
    }
  }
}


class FPPoly extends Footprint{
  
  constructor(latlngs,fadeTime,color,file,maxLevel) {
    super(file,maxLevel)
    this.shape = L.polygon(latlngs, {
      color: color,
      fillColor: color,
      fillOpacity: 0.1,
  }).addTo(mymap);
    this.latlngs = latlngs
    this.fadeTime = fadeTime

  }

  updateAudioForLocation(lat,lng){
    if(inside(lat,lng,this.shape)){
      this.soundFile.setVolume(this.maxLevel,this.fadeTime)
    }else{
      this.soundFile.setVolume(0,this.fadeTime)
    }
  }
}





