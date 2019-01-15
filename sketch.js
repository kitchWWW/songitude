var sound, reverb;


function preload() {
	for(var key in  ALL_SONGS){
		for(j = 0; j < ALL_SONGS[key].length; j++){
			ALL_SONGS[key][j].loadAudio()
		}		
	}
}

function setup(){
	
}

function makeAllLive(){
	for(i = 0; i < ALL_SONGS[EXPERIENCE_NAME].length; i++){
		ALL_SONGS[EXPERIENCE_NAME][i].makeLive()
	}
	IS_LIVE = true;
}

function mousePressed() {
	console.log('pressed!')
	if(IS_LIVE == false){
		for(var key in ALL_SONGS){
			for(i = 0; i < ALL_SONGS[key].length; i++){
				ALL_SONGS[key][i].makeLive()
			}			
		}
		IS_LIVE = true;
	}
	
}

function draw() {
}
