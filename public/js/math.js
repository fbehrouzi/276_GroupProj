function mathCheck() {
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
}
