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
  var s13 = document.getElementById("s13").value;
  var s14 = document.getElementById("s14").value;
  if(s1 < 0){
    s1 = 0;
  }
  if(s2 < 0){
    s2 = 0;
  }
  if(s3 < 0){
    s3 = 0;
  }
  if(s4 < 0){
    s4 = 0;
  }
  if(s5 < 0){
    s5 = 0;
  }
  if(s6 < 0){
    s6 = 0;
  }
  if(s7 < 0){
    s7 = 0;
  }
  if(s8 < 0){
    s8 = 0;
  }
  if(s9 < 0){
    s9 = 0;
  }
  if(s10 < 0){
    s10 = 0;
  }
  if(s11 < 0){
    s11 = 0;
  }
  if(s12 < 0){
    s12 = 0;
  }
  if(s13 < 0){
    s13 = 0;
  }
  if(s14 < 0){
    s14 = 0;
  }
  var cost = ((s1*1 + s2*1 + s3*1 + s4*1 + s5*1 + s6*1 + s7*1 + s8*1 + s9*1 + s10*1 + s11*1)*5) + ((s12*1 + s13*1 + s14*1)*10);
  var a = 10;
  if ( cost > a) {
    document.getElementById("error").innerHTML = "Sorry you dont have enough coins your total was " + cost + " but you only have " + a + " coins";
    return;
  }
  //update data base to take away coins
  //insert items into inventory
  if(s1 != 0){
    //insert items into that field
  }
  if(s2 != 0){
    //insert items into that field
  }
  if(s3 != 0){
    //insert items into that field
  }
  if(s4 != 0){
    //insert items into that field
  }
  if(s5 != 0){
    //insert items into that field
  }
  if(s6 != 0){
    //insert items into that field
  }
  if(s7 != 0){
    //insert items into that field
  }
  if(s1 != 0){
    //insert items into that field
  }
  if(s8 != 0){
    //insert items into that field
  }
  if(s9 != 0){
    //insert items into that field
  }
  if(s10 != 0){
    //insert items into that field
  }
  if(s11 != 0){
    //insert items into that field
  }
  if(s12 != 0){
    //insert items into that field
  }
  if(s13 != 0){
    //insert items into that field
  }
  if(s14 != 0){
    //insert items into that field
  }
  a = a-cost;
  document.getElementById("total").innerHTML = "Your total was " + cost + " coins";
  if (cost > 0){
    document.getElementById("invMessage").innerHTML = "Your items are now in your inventory";
    document.getElementById("coinsLeft").innerHTML = "You now have "+ a + " coins left";
  }
  else {
    document.getElementById("invMessage").innerHTML = "No items were bought";
  }



}
