var utterThis;
synth = window.speechSynthesis;
const voiceschanged = () => {
  speechSynthesis.getVoices();
  utterThis = new SpeechSynthesisUtterance("It is time to go!");
  utterThis.voice = synth.getVoices()[11];
  utterThis.volume = 1;
  utterThis.pitch = 2;
}
speechSynthesis.onvoiceschanged = voiceschanged;


function prettyDate2(time){
    let date = new Date(parseInt(time));
    let localeSpecificTime = date.toLocaleTimeString();
    return localeSpecificTime.replace(/:\d+ /, ' ');
}

function findGoodTime() {
    let xhttp = new XMLHttpRequest();
	xhttp.onreadystatechange = function() {
	    if (this.readyState == 4 && this.status == 200) {
	       // set the time to leave
	       time = JSON.parse(xhttp.response).ttl;
	       //document.getElementById("time").innerHTML = prettyDate2(time);
	       
	       // set the countdown
	       let numberOfSeconds = (time - Date.now()) / 1000;
	       console.log(numberOfSeconds);
           display = document.getElementById("countdown");
	       startTimer(numberOfSeconds, display);
	       document.getElementById("button-result").style.display = "block";
	    }
	};
	xhttp.open("GET", "http://10.59.1.205:3000/when", true);
	xhttp.send();
}

function countdownTimer(timer) {
    minutes = parseInt(timer / 60, 10);
    seconds = parseInt(timer % 60);

    //minutes = minutes < 10 ? "0" + minutes : minutes;
    //seconds = seconds < 10 ? "0" + seconds : seconds;

    display.textContent = minutes * 60 + seconds + " seconds";

    if (--timer < 0) {
    	synth.speak(utterThis);
    	window.setTimeout(() => {
    		var audio = new Audio('mk64_finallap.mp3');
		    audio.play();
    	}, 1750);
    	findGoodTime();
    } else {
    	setTimeout(() => { countdownTimer(timer); }, 1000);
    }
}

function startTimer(duration, display) {
    let timer = duration, minutes, seconds;
    countdownTimer(timer);
}