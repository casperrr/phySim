//Refrences to HTML elements.
const canvas = document.querySelector('canvas');
const c = canvas.getContext("2d");
const inputs = document.querySelector(".element__container");

// Global Variables
var abortController = true;
var barNum = 10;
var barNumInp = 80;
var leftGap = 10;
var speed = 200;
var dist = canvas.width/barNum;
var hdist = canvas.height/barNum;
var bars = []; //Main Array of bar objects
//Color class
var Color = function(r,g,b){
    this.r = r;
    this.g = g;
    this.b = b;
}
var colorA = new Color(255,54,144);
var colorB = new Color(0,186,214);


//Event listner for inputs (Range slider only.)
inputs.addEventListener("input", function(e){
    if (e.target !== e.currentTarget){
        var inputChanged = e.target;
        console.log(inputChanged.id, inputChanged.value, inputChanged.type);
        if(`${inputChanged.type}` == "range"){
            window[inputChanged.id] = inputChanged.value;
            console.log(`#${inputChanged.id}__val`);
            document.querySelector(`#${inputChanged.id}__val`).innerHTML = inputChanged.value;
        }else if(`${inputChanged.type}` == "button"){
            
        }
    }
    e.stopPropagation;
},false);

//event handler for the buttons
document.querySelector(".element__btn__container").addEventListener("click",function(e){
    if(e.target !== e.currentTarget){
        var btnClicked = e.target;
        //Use button ID for case.
        switch(btnClicked.id){
            case "btnStart":
                abortController = true;
                selectionSort(bars);
                break;
            case "btnShuffle":
                abortController = false;
                shuffle(bars);
                bg();
                drawBars(bars);
                break;
            case "btnGen":
                barNum = barNumInp;
                abortController = false;
                bars = [];
                bg();
                init();
                drawBars(bars);
                break;
        }
    }
    e.stopPropagation();
},false)

//Bar class
class Bar{
    constructor(height,color){
        this.height = height;
        this.color = color;
    }
}

//Init function
function init(){
    bars = [];
    dist = canvas.width/barNum;
    hdist = canvas.height/barNum;
    //calculate gap between bars based on bar number
    leftGap = 5+((1-5)/(200-4))*(barNum-4);
    //fill bars array with bar objects of increasing height and color
    for(var i = 0; i < barNum; i++){
        bars.push(new Bar(i+1,colorLerp(colorA,colorB,i/barNum)));
    }
}

//Background function
//Clears Background
function bg(){
    c.fillStyle = '#181818';
    c.fillRect(0,0,canvas.width,canvas.height);
}

//Will draw an array of bar objects to canvas
function drawBars(arr){
    for (i in arr){
        var height = arr[i].height;
        drawBar(i*dist,canvas.height+5,canvas.width/barNum-leftGap,height*-hdist,arr[i].color)
    }
}

//Draws a single bar
function drawBar(x,y,width,height,color){
    c.fillStyle = `rgb(${color.r},${color.g},${color.b})`;
    c.beginPath();
    c.roundRect(x,y,width,height,5);
    c.fill();
}

//Shuffle an array
function shuffle(arr){
    arr.sort(() => Math.random() - 0.5);
}

//color interpolation, I interpolate each r,g,b value to get a gradient.
function colorLerp(a,b,n){
    return new Color(
    a.r + (b.r - a.r) * n,
    a.g + (b.g - a.g) * n,
    a.b + (b.b - a.b) * n);
}

//Will delay the script for the time passed in.
function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

//Selection Sort function
async function selectionSort(arr){
    for(let i = 0; i<arr.length; i++){
      //find min number in subarray 
      //and place it at ith position
        let minptr = i;
        for(let j = i+1; j<arr.length; j++){
            if(abortController){
                if(arr[minptr].height > arr[j].height){
                    minptr = j;
                }
            }else{
                return;
            }
        }
      //swap
        let temp = arr[i];
        arr[i] = arr[minptr];
        arr[minptr] = temp;
        //draw
        bg();
        drawBars(bars);
        await sleep(1000-speed)
    }
}


init();
drawBars(bars);
