

class Footprint {

  constructor(file,maxLevel){
    this.soundFilePath = 'works_audio/' + EXPERIENCE_NAME + '/' + file + ".mp3"
    this.maxLevel = maxLevel
    this.parentWork = EXPERIENCE_NAME
    this.isFadingOff = false
  }

	// used for the legwork
	updateAudioForLocation(lat,lng){}
	
	//used to kill all sound
	mute(){
    this.soundFile.volume(0)
  }

  loadAudio(){
    this.soundFile = new Howl({
      src: [this.soundFilePath],
      autoplay: false,
      loop: true,
      volume: 0,
    });
  }

  makeLive(){
    console.log("we are live! from "+this.parentWork)
    this.soundFile.play()
    this.soundFile.volume(0)
  }

  makeDead(){
    this.soundFile.stop()
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
    var distanceFromCenter = getDistanceFromLatLonInM(lat,lng,this.lat,this.lng)
    var curVol = this.soundFile.volume()
    if(distanceFromCenter < this.radius){
      console.log("Playing!" + this.soundFilePath)
      var ratio = (this.radius - distanceFromCenter) / this.radius
      this.soundFile.fade(curVol,ratio * this.maxLevel,(GLOBAL_TIMESTEP - FADE_BUFFER))
      this.isFadingOff = false
    }else{
      if(this.isFadingOff == false){
        this.soundFile.fade(curVol,0,GLOBAL_TIMESTEP - FADE_BUFFER)
        this.isFadingOff = true
      }
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
    this.fadeTime = 2 // in SECONDS

    this.isFadingOn = false
  }

  updateAudioForLocation(lat,lng){
    var curVol = this.soundFile.volume()
    if(inside(lat,lng,this.shape)){
      if(this.isFadingOn == false){
        this.soundFile.fade(curVol,this.maxLevel,this.fadeTime*1000 - FADE_BUFFER)
        this.isFadingOn = true
        this.isFadingOff = false
      }
    }else{
      if(this.isFadingOff == false){
        this.soundFile.fade(curVol,0,this.fadeTime*1000 - FADE_BUFFER)
        this.isFadingOn = false
        this.isFadingOff = true
      }

    }
  }
}





