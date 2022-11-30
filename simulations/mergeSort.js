const canvas = document.querySelector('canvas');
const c = canvas.getContext("2d");
const inputs = document.querySelector(".element__container");

var abortController = true;
var barNum = 8;
var leftGap = 10;
var speed = 200;
var dist = canvas.width/barNum;
var hdist = canvas.height/barNum;
var bars = [];
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
        switch(btnClicked.id){
            case "btnStart":
                abortController = true;
                mergeSort(bars);
                break;
            case "btnShuffle":
                abortController = false;
                shuffle(bars);
                bg();
                drawBars(bars);
                break;
            case "btnGen":
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

class Bar{
    constructor(height,color){
        this.height = height;
        this.color = color;
    }
}

function init(){
    bars = [];
    dist = canvas.width/barNum;
    hdist = canvas.height/barNum;
    leftGap = 5+((1-5)/(200-4))*(barNum-4);
    for(var i = 0; i < barNum; i++){
        bars.push(new Bar(i+1,colorLerp(colorA,colorB,i/barNum)));
    }
    //shuffle(bars);
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

//color interpolation, I interpolate each r,g,b value to get a gradient.
function colorLerp(a,b,n){
    return new Color(
    a.r + (b.r - a.r) * n,
    a.g + (b.g - a.g) * n,
    a.b + (b.b - a.b) * n);
}

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

function sleep2(milliseconds) {
    const start = Date.now();
    while (Date.now() - start < milliseconds);
  }

async function bubbleSort(arr){
    for (var j = 0; j < arr.length - 1; j++){
        for(var i = 0; i < arr.length - j - 1; i++){
            if(abortController){
                if (arr[i].height > arr[i + 1].height){
                    [arr[i],arr[i+1]] = [arr[i+1],arr[i]];
                }
                //console.log(arr);
                //update frame here
                await sleep(1000-speed);
                bg();
                drawBars(bars);
                //requestAnimationFrame();
            }else{
                return;
            }
        }
    }
}

var count = 8;
var displayBars = bars;


function mergeSort(arr,start){
    let len = arr.length;
    if (len <= 1) return arr;

    let mid = Math.floor(len / 2);
    //console.log(arr);

    let left = mergeSort(arr.slice(0,mid),start);
    let right = mergeSort(arr.slice(mid),mid+start);
    console.log(start);
    
    return merge(left,right,start);
    
    
}


function merge(left,right,start){
    let sortedArr = [];
    sleep2(10);
    console.log([left,right])
    
    
    // bg();
    // drawBars(sortedArr);
    let index = 0;
    let len = (left.length+right.length)
    let l = 0;
    let r = 0;
    for(var i = 0; i < len;i++){
        console.log([index,l,r])
        if (l >= left.length){
            displayBars[start+index] = right[r];
            sortedArr[index] = right[r];
            r++
        }else if(r >= right.length){
            displayBars[start+index] = left[l];
            sortedArr[index] = left[l];
            l++
        }else{ 

            if (left[l].height < right[r].height){
                displayBars[start+index] = left[l];
                // sortedArr.push(left[l]);
                sortedArr[index] = left[l];
                l++;
            }else {
                displayBars[start+index] = right[r];
                // sortedArr.push(right[r]);
                sortedArr[index] = right[r];
                r++;
            }
        }
        index++;
    }

    console.log(displayBars);
    console.log(sortedArr);


    //console.log([...sortedArr, ...left,...right])
    //return [...sortedArr, ...left,...right];
    return sortedArr;
}


init();
//shuffle(bars);
drawBars(bars);
//bubbleSort(bars);
//loop();