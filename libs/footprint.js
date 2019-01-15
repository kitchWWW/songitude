

class Footprint {

  constructor(file,maxLevel){
    this.soundFilePath = 'works_audio/' + EXPERIENCE_NAME + '/' + file + ".mp3"
    this.maxLevel = maxLevel
    this.parentWork = EXPERIENCE_NAME
  }

	// used for the legwork
	updateAudioForLocation(lat,lng){}
	
	//used to kill all sound
	mute(){
    this.soundFile.setVolume(0)
  }

  loadAudio(){
    this.soundFile = loadSound(this.soundFilePath)
  }

  makeLive(){
    console.log("we are live! from "+this.parentWork)
    this.soundFile.setVolume(0)
    this.soundFile.loop()
  }

}


class FPCircle extends Footprint{
  
  constructor(file,maxLevel,color,geoInfo) {
    super(file,maxLevel)
    this.shape = L.circle(geoInfo[0], {
      color: color,
      fillColor: color,
      fillOpacity: 0.1,
      radius: geoInfo[1]
  }).addTo(mymap);
    this.lat = geoInfo[0][0]
    this.lng = geoInfo[0][1]
    this.radius = geoInfo[1]
  }

  updateAudioForLocation(lat,lng){
    console.log(this.parentWork)
    var distanceFromCenter = getDistanceFromLatLonInM(lat,lng,this.lat,this.lng)
    if(distanceFromCenter < this.radius){
      var ratio = (this.radius - distanceFromCenter) / this.radius
      console.log(this.maxLevel)
      this.soundFile.setVolume(ratio * this.maxLevel,(GLOBAL_TIMESTEP/1000.0))
    }else{
      this.soundFile.setVolume(0,1)
    }
  }
}


class FPPoly extends Footprint{
  
  constructor(file,maxLevel,color,geoInfo) {
    super(file,maxLevel)
    this.shape = L.polygon(geoInfo, {
      color: color,
      fillColor: color,
      fillOpacity: 0.1,
  }).addTo(mymap);
    this.geoInfo = geoInfo
    this.fadeTime = 1

  }

  updateAudioForLocation(lat,lng){
    if(inside(lat,lng,this.shape)){
      this.soundFile.setVolume(this.maxLevel,this.fadeTime)
    }else{
      this.soundFile.setVolume(0,this.fadeTime)
    }
  }
}





