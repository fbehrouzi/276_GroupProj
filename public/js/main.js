
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

// Crops timer
var timer = setInterval(() => {
	for (let i = 0; i <= 3; i++) {
		var t = document.getElementById("timer" + (i + 1))
		let sec = str2sec(t.textContent)
		if (sec > 0) {
			sec--
			t.textContent = sec2str(sec)
		} else {
			t.textContent = "00:00"
			clearInterval(timer)
		}
	}
}, 1000)

