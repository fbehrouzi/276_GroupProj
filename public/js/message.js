function loadImage(){
  let msgSet = {
    "You got a tomato" :0,
    "You got a potato" :1,
    "You got a pumpkin" :2, 
    "You got a corn" :3, 
    "You got a cabbage" :4, 
    "You got a carrot" :5, 
    "You got a watermelon" :6
  }
  let msg = document.getElementById('msg').innerHTML;
  console.log(msgSet[msg]); 
  if (msgSet[msg] >= 0 && msgSet[msg] <=6 ){
    setSrc(msgSet[msg]);
    Setdisplay("block")
  }else{
    Setdisplay("none");
  }
}
function setSrc(num){
    let imageSrc = {
    0: "images/tomatodude.png",
    1: "images/potato.png",
    2: "images/evilpumpkin.png",
    3: "images/cornn.png",
    4: "images/cabby.png",
    5: "images/carrosaur.png",
    6: "images/watermelony.png"
  }
  let link = document.getElementById('msgimg');
  if (link.src != imageSrc[num]) {
    link.src = imageSrc[num];
  }
}
function Setdisplay(str){
  let link = document.getElementById('msgimg');
  link.style.display = str;
}