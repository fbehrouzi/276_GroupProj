function mathCheck() {
  document.getElementById("score").innerHTML = "You Scored:";
  var a = 0;
  var q1 = document.getElementsByName('q1');
  if (q1[1].checked) {
    a++;
  }
  var q2 = document.getElementsByName('q2');
  if (q2[0].checked) {
    a++;
  }
  var q3 = document.getElementsByName('q3');
  if (q3[0].checked) {
    a++;
  }
  var q4 = document.getElementsByName('q4');
  if (q4[2].checked) {
    a++;
  }
  document.getElementById("res").innerHTML = a+"/4";
  document.getElementById("submit").innerHTML = "No more submitting";
  if ( a < 3 ){
    document.getElementById("message").innerHTML = "Better Luck Next Time";
  }
  else {
    document.getElementById("message").innerHTML = "Great Job!";
  }
  document.getElementById("coinResult").innerHTML = "You Earned "+a*5+" Coins &#128176;";
}

function geographyCheck() {
  document.getElementById("score").innerHTML = "You Scored:";
  var a = 0;
  var q1 = document.getElementsByName('q1');
  if (q1[2].checked) {
    a++;
  }
  var q2 = document.getElementsByName('q2');
  if (q2[3].checked) {
    a++;
  }
  var q3 = document.getElementsByName('q3');
  if (q3[1].checked) {
    a++;
  }
  var q4 = document.getElementsByName('q4');
  if (q4[3].checked) {
    a++;
  }
  document.getElementById("res").innerHTML = a+"/4";
  document.getElementById("submit").innerHTML = "No more submitting";
  if ( a < 3 ){
    document.getElementById("message").innerHTML = "Better Luck Next Time";
  }
  else {
    document.getElementById("message").innerHTML = "Great Job!";
  }
  document.getElementById("coinResult").innerHTML = "You Earned "+a*5+" Coins &#128176;";
}

function historyCheck() {
  document.getElementById("score").innerHTML = "You Scored:";
  var a = 0;
  var q1 = document.getElementsByName('q1');
  if (q1[1].checked) {
    a++;
  }
  var q2 = document.getElementsByName('q2');
  if (q2[0].checked) {
    a++;
  }
  var q3 = document.getElementsByName('q3');
  if (q3[3].checked) {
    a++;
  }
  var q4 = document.getElementsByName('q4');
  if (q4[2].checked) {
    a++;
  }
  document.getElementById("res").innerHTML = a+"/4";
  document.getElementById("submit").innerHTML = "No more submitting";
  if ( a < 3 ){
    document.getElementById("message").innerHTML = "Better Luck Next Time";
  }
  else {
    document.getElementById("message").innerHTML = "Great Job!";
  }
  document.getElementById("coinResult").innerHTML = "You Earned "+a*5+" Coins &#128176;";
}

function scienceCheck() {
  document.getElementById("score").innerHTML = "You Scored:";
  var a = 0;
  var q1 = document.getElementsByName('q1');
  if (q1[1].checked) {
    a++;
  }
  var q2 = document.getElementsByName('q2');
  if (q2[3].checked) {
    a++;
  }
  var q3 = document.getElementsByName('q3');
  if (q3[2].checked) {
    a++;
  }
  var q4 = document.getElementsByName('q4');
  if (q4[2].checked) {
    a++;
  }
  document.getElementById("res").innerHTML = a+"/4";
  document.getElementById("submit").innerHTML = "No more submitting";
  if ( a < 3 ){
    document.getElementById("message").innerHTML = "Better Luck Next Time!";
  }
  else {
    document.getElementById("message").innerHTML = "Great Job!";
  }
  document.getElementById("coinResult").innerHTML = "You Earned "+a*5+" Coins &#128176;";
}
