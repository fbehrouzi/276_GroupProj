function buyItems() {
  var s1 = document.getElementById("s1").value;
  var s2 = document.getElementById("s2").value;
  var s3 = document.getElementById("s3").value;
  var s4 = document.getElementById("s4").value;
  var s5 = document.getElementById("s5").value;
  var s6 = document.getElementById("s6").value;
  var s7 = document.getElementById("s7").value;
  var s8 = document.getElementById("s8").value;
  var s9 = document.getElementById("s9").value;
  var s10 = document.getElementById("s10").value;
  var s11 = document.getElementById("s11").value;
  var s12 = document.getElementById("s12").value;
  var cost = ((s1*1 + s2*1 + s3*1 + s4*1 + s5*1 + s6*1 + s7*1 + s8*1 + s9*1)*5) + ((s10*1 + s11*1 + s12*1)*10);
  document.getElementById("cost").innerHTML = cost;
}
