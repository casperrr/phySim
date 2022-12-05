const canvas = document.querySelector('canvas');
const c = canvas.getContext("2d");
const inputs = document.querySelector(".element__container");

var gridSizeCol = 80;
// var gridSizeRow = 12;
var gridSizeRow = gridSizeCol*2;
var cellArr;
var speed;
var drawCellArr; //array that holds the pixels to be drawn too
var mDown = false;
var mPos = [0,0];

// Event listner for inputs (Range slider only.)
inputs.addEventListener("input", function(e){
    if (e.target !== e.currentTarget){
        var inputChanged = e.target;
        console.log(inputChanged.id, inputChanged.value, inputChanged.type);
        window[inputChanged.id] = inputChanged.value;
        console.log(`#${inputChanged.id}__val`);
        document.querySelector(`#${inputChanged.id}__val`).innerHTML = inputChanged.value;    }
    e.stopPropagation;
},false);

//event handler for the buttons
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


async function loop(){
    nextGen();
    cellPaint(mPos[0],mPos[1]);
    bg();
    drawGrid(cellArr);
    if(mDown){
        drawGrid(drawCellArr);
    }
    //console.log("RUNNING");

    await sleep(speed);
    requestAnimationFrame(loop);
}




function init(){
    cellArr = makeArray(gridSizeCol,gridSizeRow);
    for(let i = 0; i < gridSizeCol; i++){
        for(let j = 0; j < gridSizeRow; j++){
            cellArr[i][j] = Math.floor(Math.random()*2);
        }
    }
}

function bg(){
    c.fillStyle = '#181818';
    c.fillRect(0,0,canvas.width,canvas.height);
}

function drawGrid(arr){
    let w = canvas.width/gridSizeRow;
    let h = canvas.height/gridSizeCol;
    for(let i = 0; i < gridSizeCol; i++){
        for(let j = 0; j < gridSizeRow; j++){
            if(arr[i][j] == 1) drawCell(j*w,i*h,w,h);
        }
    }
}

function drawCell(x,y,w,h){
    c.fillStyle = "rgb(255,10,100)";
    c.strokeStyle = "#181818";
    c.lineWidth = 1;
    c.beginPath();
    c.roundRect(x,y,w,h,4);
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
            let col = (x+i+gridSizeCol)%gridSizeCol;
            let row = (y+j+gridSizeRow)%gridSizeRow;
            sum += cellArr[col][row];
        }
    }
    sum -= cellArr[x][y]; //we do not count the middle square as itself is not concidered a neighbor.
    return sum;
}

//Creates the next generation of the board using the rules of the game.
function nextGen(){
    let newArry = makeArray(gridSizeCol,gridSizeRow);
    for(let i = 0; i < gridSizeCol; i++){
        for(let j = 0; j < gridSizeRow; j++){
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
    drawCellArr = makeArray(gridSizeRow,gridSizeCol);
    mDown = true;
},false);

canvas.addEventListener("mouseup",function(){
    for(let i = 0; i < gridSizeCol; i++){
        for(let j = 0; j < gridSizeRow; j++){
            if(drawCellArr[i][j] == 1){
                cellArr[i][j] = drawCellArr[i][j];
            }
        }
    }
    mDown = false;
},false)

canvas.addEventListener("mousemove",function(e){
    //getMousePos(e)
    mPos = getMousePos(e);
},false)

function cellPaint(x,y){
    //console.log(x,y)
    if(mDown){
        var cell = 
            [Math.floor(gridSizeRow/canvas.width*x),
            Math.floor(gridSizeCol/canvas.height*y)];
        console.log(cell);
        drawCellArr[cell[1]][cell[0]] = 1;
    }
}
//remeber that to get the cell with mouse you can do gridSizeCol/canvas.width*mousePos



// function getMousePos(e) {
//     var rect = canvas.getBoundingClientRect();
//     cellPaint(
//          (e.clientX - rect.left) / (rect.right - rect.left) * canvas.width,
//          (e.clientY - rect.top) / (rect.bottom - rect.top) * canvas.height);
// }

function getMousePos(e) {
    var rect = canvas.getBoundingClientRect();
    return [
        (e.clientX - rect.left) / (rect.right - rect.left) * canvas.width,
        (e.clientY - rect.top) / (rect.bottom - rect.top) * canvas.height]
}

//REMINDER draw cells ontop of render and then when mouse up do the thing



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
