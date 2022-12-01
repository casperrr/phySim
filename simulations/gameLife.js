const canvas = document.querySelector('canvas');
const c = canvas.getContext("2d");
const inputs = document.querySelector(".element__container");

var gridSize = 70;
var cellArr;
var mDown = false;

//Event listner for inputs (Range slider only.)
// inputs.addEventListener("input", function(e){
//     if (e.target !== e.currentTarget){
//         var inputChanged = e.target;
//         console.log(inputChanged.id, inputChanged.value, inputChanged.type);
//         window[inputChanged.id] = inputChanged.value;
//         console.log(`#${inputChanged.id}__val`);
//         document.querySelector(`#${inputChanged.id}__val`).innerHTML = inputChanged.value;    }
//     e.stopPropagation;
// },false);

// //event handler for the buttons
// document.querySelector(".element__btn__container").addEventListener("click",function(e){
//     if(e.target !== e.currentTarget){
//         var btnClicked = e.target;
//         switch(btnClicked.id){
//             case "btnStart":
//                 abortController = true;
//                 insertSort(bars);
//                 break;
//             case "btnShuffle":
//                 abortController = false;
//                 shuffle(bars);
//                 bg();
//                 drawBars(bars);
//                 break;
//             case "btnGen":
//                 barNum = barNumInp;
//                 abortController = false;
//                 bars = [];
//                 bg();
//                 init();
//                 drawBars(bars);
//                 break;
//         }
//     }
//     e.stopPropagation();
// },false)


//REMEBER TO USE STROKE AS PADDING.




function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

function sleep2(milliseconds) {
    const start = Date.now();
    while (Date.now() - start < milliseconds);
}


function loop(){
    nextGen();
    bg();
    drawGrid(cellArr);
    //console.log("RUNNING");

    sleep2(5);
    requestAnimationFrame(loop);
}




function init(){
    cellArr = makeArray(gridSize,gridSize);
    for(let i = 0; i < gridSize; i++){
        for(let j = 0; j < gridSize; j++){
            cellArr[i][j] = Math.floor(Math.random()*2);
        }
    }
}

function bg(){
    c.fillStyle = '#181818';
    c.fillRect(0,0,canvas.width,canvas.height);
}

function drawGrid(arr){
    let w = canvas.width/gridSize;
    for(let i = 0; i < gridSize; i++){
        for(let j = 0; j < gridSize; j++){
            if(arr[i][j] == 1) drawCell(j*w,i*w,w,w);
        }
    }
}

function drawCell(x,y,w,h){
    c.fillStyle = "rgb(255,10,100)";
    c.strokeStyle = "#181818";
    c.lineWidth = 1;
    c.beginPath();
    c.roundRect(x,y,w,h,10);
    c.fill();
    c.stroke();
}

function makeArray(cols, rows){
    let array = new Array(cols);
    for(let i = 0; i < cols; i++){
        array[i] = new Array(rows);
    }
    return array;
}

//Sum of cells imediate neighbors:
function nSum(x,y){
    let sum = 0;
    for(let i = -1; i < 2; i++){
        for(let j = -1; j < 2; j++){
            let col = (x+i+gridSize)%gridSize;
            let row = (y+j+gridSize)%gridSize;
            sum += cellArr[col][row];
        }
    }
    sum -= cellArr[x][y]; //we do not count the middle square as itself is not concidered a neighbor.
    return sum;
}

//Creates the next generation of the board using the rules of the game.
function nextGen(){
    let newArry = makeArray(gridSize,gridSize);
    for(let i = 0; i < gridSize; i++){
        for(let j = 0; j < gridSize; j++){
            if(cellArr[i][j] == 1){
                if(nSum(i,j) < 2 || nSum(i,j) > 3){
                    newArry[i][j] = 0;
                }else{
                    newArry[i][j] = 1;
                }
            }else{
                if(nSum(i,j) == 3){
                    newArry[i][j] = 1;
                }else {
                    newArry[i][j] = 0;
                }
            }
        }
    }
    cellArr = newArry;
}

//drawing section
canvas.addEventListener("mousedown", function(e){
    mDown = true;
},false);

canvas.addEventListener("mouseup",function(){
    mDown = false;
},false)

canvas.addEventListener("mousemove",function(e){
    getMousePos(e)
},false)

function cellPaint(x,y){
    if(mDown){
        var cell = 
            [Math.floor(gridSize/canvas.width*x),
            Math.floor(gridSize/canvas.height*y)];
        console.log(cell);
    }
}
//remeber that to get the cell with mouse you can do gridSize/canvas.width*mousePos


function getMousePos(e) {
    var rect = canvas.getBoundingClientRect();
    cellPaint(
         (e.clientX - rect.left) / (rect.right - rect.left) * canvas.width,
         (e.clientY - rect.top) / (rect.bottom - rect.top) * canvas.height);
}
// function getMousePos(e) {
//     var rect = canvas.getBoundingClientRect();
//     return {
//         x: (e.clientX - rect.left) / (rect.right - rect.left) * canvas.width,
//         y: (e.clientY - rect.top) / (rect.bottom - rect.top) * canvas.height
//     };
// }

init();
drawGrid(cellArr);
loop();
