class Footprint {

  constructor(file, maxLevel) {
    if (!isNaN(file)) {
      this.soundFilePath = file //if it is a sine wave. Also needs to be audible.
    } else {
      this.soundFilePath = 'works_audio/' + EXPERIENCE_NAME + '/' + file + ".mp3"
    }
    this.maxLevel = maxLevel
    this.parentWork = EXPERIENCE_NAME
    this.isFadingOff = false
    this.targetValues = []
    this.isloaded = false
    this.isPlaying = false
  }

  addToMap() {
    this.shape.addTo(mymap);
  }

  // used for the legwork
  updateAudioForLocation(lat, lng) {}

  //used to kill all sound
  mute() {
    this.soundFile.volume = 0
  }

  loadAudio() {
    var me = this;
    if (me.soundFilePath.startsWith("works_audio")) {
      this.soundFile = new Pizzicato.Sound({
        source: 'file',
        options: {
          path: this.soundFilePath,
          volume: 1,
          loop: true,
        }
      }, function() {
        me.isloaded = true
        songsActuallyLoaded += 1
        console.log("this thing" + me.soundFilePath + " is loaded.")
      });
    } else {
      me.soundFile = new Pizzicato.Sound({
        source: 'wave',
        options: {
          frequency: parseFloat(this.soundFilePath)
        }
      });
      me.isloaded = true
      songsActuallyLoaded += 1
      console.log("this thing " + me.soundFilePath + " is a wave.")
    }

  }

  makeLive() {
    if (ALL_PLAY_ALL_THE_TIME) {
      if (this.isloaded) {
        this.soundFile.play(0, 0)
        this.soundFile.volume = 0
        this.isPlaying = true
      }
    }
  }

  makeDead() {
    this.soundFile.stop()
    this.isPlaying = false
  }

  _getparam(param) {
    if (param == "vol") {
      return this.soundFile.volume
    }
  }

  _setparam(param, val) {
    if (param == "vol") {
      this.soundFile.volume = val
    }
  }

  _fade(param, target, duration) {
    var me = this;
    var startTime = new Date().getTime();
    var startParam = me._getparam(param)
    var endTime = startTime + duration

    me.targetValues[param] = [startParam, target, startTime, endTime]

    var myInterval = setInterval(function() {
      var currTime = new Date().getTime();
      var currentDuration = me.targetValues[param][3] - me.targetValues[param][2]
      var timeDiff = currTime - me.targetValues[param][2] + 0.0;
      var ratio = timeDiff / currentDuration
      if (ratio > 1) {
        ratio = 1
      }
      var totalSpan = me.targetValues[param][1] - me.targetValues[param][0]
      var finalVol = ratio * totalSpan + me.targetValues[param][0]
      me._setparam(param, finalVol)

      if (currTime >= endTime) {
        clearInterval(myInterval);
      }
    }, 5);

  }
}


class FPCircle extends Footprint {

  constructor(file, maxLevel, color, geoInfo) {
    super(file, maxLevel)
    this.shape = L.circle(geoInfo[0], {
      color: color,
      fillColor: color,
      fillOpacity: 0.1,
      radius: geoInfo[1]
    });
    this.lat = geoInfo[0][0]
    this.lng = geoInfo[0][1]
    this.radius = geoInfo[1]
  }

  updateAudioForLocation(lat, lng) {
    var distanceFromCenter = getDistanceFromLatLonInM(lat, lng, this.lat, this.lng)
    if (distanceFromCenter < this.radius) {
      if (!(ALL_PLAY_ALL_THE_TIME) && !(this.isPlaying) && (IS_LIVE)) {
        // start the sound file playing
        this.soundFile.play(0, 0)
        this.soundFile.volume = 0;
        this.isPlaying = true;
      }
      var ratio = (this.radius - distanceFromCenter) / this.radius
      this._fade("vol", ratio * this.maxLevel, GLOBAL_TIMESTEP - FADE_BUFFER)
      this.isFadingOff = false
    } else {
      if (this.isFadingOff == false) {
        this._fade("vol", 0, GLOBAL_TIMESTEP - FADE_BUFFER)
        this.isFadingOff = true
        var self = this;
        setTimeout(function() {
          self.soundFile.stop();
          self.isPlaying = false;
        }, GLOBAL_TIMESTEP + FADE_BUFFER * 2);
      }
    }
  }
}


class FPPoly extends Footprint {

  constructor(file, maxLevel, color, geoInfo) {
    super(file, maxLevel)
    this.shape = L.polygon(geoInfo, {
      color: color,
      fillColor: color,
      fillOpacity: 0.1,
    });
    this.geoInfo = geoInfo
    this.fadeTime = 2 // in SECONDS
    this.isFadingOn = false
  }

  updateAudioForLocation(lat, lng) {
    if (inside(lat, lng, this.shape)) {
      if (this.isFadingOn == false) {
        if (!ALL_PLAY_ALL_THE_TIME) {
          this.soundFile.play(0, 0)
          this.soundFile.volume = 0;
          this.isPlaying = true;
        }
        this._fade("vol", this.maxLevel, this.fadeTime * 1000 - FADE_BUFFER)
        this.isFadingOn = true
        this.isFadingOff = false
      }
    } else {
      if (this.isFadingOff == false) {
        this._fade("vol", 0, this.fadeTime * 1000 - FADE_BUFFER)
        this.isFadingOn = false
        this.isFadingOff = true
        var self = this;
        setTimeout(function() {
          self.soundFile.stop();
          self.isPlaying = false;
        }, this.fadeTime * 1000 + FADE_BUFFER * 2);
      }
    }
  }
}



class FPPolyEcho extends Footprint {

  constructor(file, maxLevel, color, geoInfo, timingProbs) {
    super(file, maxLevel)
    this.shape = L.polygon(geoInfo, {
      color: color,
      fillColor: color,
      fillOpacity: 0.1,
    });
    this.geoInfo = geoInfo
    this.fadeTime = 2 // in SECONDS
    this.isFadingOn = false
    this.timingProbs = timingProbs
    this.currentTimeout = 0
  }


  stochasticPlay() {
    var me = this
    console.log(me)
    if (me.isInside== true) {
      me.soundFile.stop()
      me.soundFile.play(0, 0)
    }
    var howlongtowait = Math.floor(Math.random() * me.timingProbs[1]) + me.timingProbs[0]
    me.currentTimeout = setTimeout(function() {
      me.stochasticPlay()
    }, howlongtowait)

  }

  makeLive() {
    console.log("added it!")
    this.soundFile.loop = false
    this.soundFile.on('end', this.stochasticPlay())
    this.isInside = false
    this.stochasticPlay()
  }

  makeDead() {
    clearTimeout(this.currentTimeout)
  }

  updateAudioForLocation(lat, lng) {
    if (inside(lat, lng, this.shape)) {
      this.isInside = true
    } else {
      this.isInside = false
    }
  }


}