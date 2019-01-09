

class Footprint {

	// used for the legwork
	updateAudioForLocation(lat,lng){}
	
	//used to kill all sound
	mute(){}

}


class FPCircle extends Footprint{
  
  constructor(lat,lng,diameter,color,file,maxLevel) {
  	super()
  	this.shape = L.circle([lat, lng], {
	    color: color,
	    fillColor: color,
	    fillOpacity: 0.5,
	    radius: diameter
	}).addTo(mymap);
  	this.lat = lat
  	this.lng = lng
  	this.diameter = diameter
  	this.soundFilePath = file
  	this.maxLevel = maxLevel

  	console.log("hi?")
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

  loadAudio(){
  	this.soundFile = loadSound(this.soundFilePath)
  }

  makeLive(){
  	console.log("we are live!")
  	this.soundFile.setVolume(0)
  	this.soundFile.loop()
  }
}