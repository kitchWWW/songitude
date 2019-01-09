var sound, reverb;


function preload() {
	for(i = 0; i < ENTIRE_WORK.length; i++){
		ENTIRE_WORK[i].loadAudio()
	}
}

function setup(){
	
}

function mousePressed() {
	if(IS_LIVE == false){
		for(i = 0; i < ENTIRE_WORK.length; i++){
			ENTIRE_WORK[i].makeLive()
		}
	}
	IS_LIVE = true;
}

function draw() {
}
