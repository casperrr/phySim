const canvas = document.querySelector('canvas');
const c = canvas.getContext("2d");

var barNum = 10;
var bars = [];

class Bar{
    constructor(height,color){
        this.height = height;
        this.color = color;
    }
}

function init(){
    for(var i = 0; i < barNum; i++){
        bars.push(new Bar(i,"test"));
    }
}

init();