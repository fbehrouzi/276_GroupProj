
// main.js

function CountdownTimer() {
	var counter = 500;
	var interval = setInterval(() => {
		counter--;
		if(counter < 0 ){
			clearInterval(interval);
		};
		document.getElementById("time").innerHTML = counter;
	}, 1000);
};

// Utility function: convert second to string in the form "xx:xx"
function sec2str(sec) {
	let minutes = Math.floor(sec / 60).toString()
	let seconds = (sec % 60).toString()
	minutes = minutes.length <= 1 ? '0' + minutes : minutes
	seconds = seconds.length <= 1 ? '0' + seconds : seconds
	return minutes + ':' + seconds
}

// Utility function: convert string in the form "xx:xx" to second
function str2sec(str) {
	let arr = str.split(':')
	let seconds = 0
	seconds += parseInt(arr[0]) * 60 + parseInt(arr[1])
	return seconds
}

var timeDisplay = []
for (let i = 0; i <= 3; i++) {
	timeDisplay.push(document.getElementById("timer" + (i + 1)))
}

// Crops timer
var timer = setInterval(() => {
	for (let i = 0; i <= 3; i++) {
		let sec = str2sec(timeDisplay[i].textContent)
		if (sec > 0) {
			sec--
			timeDisplay[i].textContent = sec2str(sec)
		} else {
			timeDisplay[i].textContent = "00:00"
		}
	}
	if (timeDisplay[0] <= 0 && timeDisplay[1] <= 0 && 
		timeDisplay[2] <= 0 && timeDisplay[3] <= 0) {
		clearInterval(timer)
	}
}, 1000)

