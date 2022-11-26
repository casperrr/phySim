const canvas = document.querySelector('canvas');
const c = canvas.getContext("2d");

var barNum = 10;
var dist = canvas.width/barNum;
var hdist = canvas.height/barNum;
var bars = [];

class Bar{
    constructor(height,color){
        this.height = height;
        this.color = color;
    }
}

function init(){
    for(var i = 0; i < barNum; i++){
        bars.push(new Bar(i+1,"test"));
    }
}

function bg(){
    c.fillStyle = '#181818';
    c.fillRect(0,0,canvas.width,canvas.height);
}

function loop(){
    bg();
    drawBars();

    requestAnimationFrame(loop);
}

function drawBars(){
    for (i in bars){
        var height = bars[i].height;
        drawBar(i*dist,canvas.height+5,50,height*-hdist,"w")
    }
}

function drawBar(x,y,width,height,color){
    c.fillStyle = "#ffffff"; //this will be changed to color
    c.beginPath();
    c.roundRect(x,y,width,height,5);
    c.fill();
}

function shuffle(arr){
    arr.sort(() => Math.random() - 0.5);
}


init();
shuffle(bars);
loop();