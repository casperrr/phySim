const canvas = document.querySelector('canvas');
const c = canvas.getContext("2d");

var barNum = 10;
var leftGap = 10;
var dist = canvas.width/barNum;
var hdist = canvas.height/barNum;
var bars = [];
var Color = function(r,g,b){
    this.r = r;
    this.g = g;
    this.b = b;
}
var colorA = new Color(255,0,144);
var colorB = new Color(0,186,214);

class Bar{
    constructor(height,color){
        this.height = height;
        this.color = color;
    }
}

function init(){
    for(var i = 0; i < barNum; i++){
        bars.push(new Bar(i+1,colorLerp(colorA,colorB,i/barNum)));
    }
}

function bg(){
    c.fillStyle = '#181818';
    c.fillRect(0,0,canvas.width,canvas.height);
}

function loop(){
    bg();
    drawBars(bars);

    requestAnimationFrame(loop);
}

function drawBars(arr){
    for (i in arr){
        var height = arr[i].height;
        drawBar(i*dist,canvas.height+5,canvas.width/barNum-leftGap,height*-hdist,arr[i].color)
    }
}

function drawBar(x,y,width,height,color){
    c.fillStyle = `rgb(${color.r},${color.g},${color.b})`;
    c.beginPath();
    c.roundRect(x,y,width,height,5);
    c.fill();
}

function shuffle(arr){
    arr.sort(() => Math.random() - 0.5);
}

function colorLerp(a,b,n){
    return new Color(
    a.r + (b.r - a.r) * n,
    a.g + (b.g - a.g) * n,
    a.b + (b.b - a.b) * n);
}


init();
shuffle(bars);
loop();