function CountdownTimer(){
  var counter = 500;
  var interval = setInterval(() => {
    counter--;
    if(counter < 0 ){
      clearInterval(interval);
    };
		document.getElementById("time").innerHTML = counter;
  }, 1000);
};
