//Refrences to HTML elements.
const canvas = document.querySelector('canvas');
const c = canvas.getContext("2d");
const inputs = document.querySelector(".element__container");

//Global Variables
var gridSizeColInp;
var gridSizeCol = 80;
var gridSizeRow = gridSizeCol*2;
var cellArr;
var paused = false;
var speed;
var drawCellArr; //array that holds the pixels to be drawn too
var mDown = false;
var mPos = [0,0]; //Mouse position (x , y)

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
document.querySelector(".element__btn__container").addEventListener("click",function(e){
    if(e.target !== e.currentTarget){
        var btnClicked = e.target;
        //Use button ID for case.
        switch(btnClicked.id){
            case "btnUpdate":
                gridSizeCol = parseInt(gridSizeColInp);
                gridSizeRow = gridSizeCol*2;
                init();
                break;
            case "btnClear":
                cellArr = Array(gridSizeCol).fill(null).map(()=>Array(gridSizeRow).fill(0));
                break;
            case "btnPause":
                paused = !paused;
                if(paused){
                    btnClicked.innerHTML = "Play";
                }else{
                    btnClicked.innerHTML = "Pause";
                }
                break;
            case "btnFill":
                init();
                break;
        }
    }
    e.stopPropagation();
},false)

//Delay function using prommises
function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

//Delay function using time
//Causes whole program to stop until delay over
function sleep2(milliseconds) {
    const start = Date.now();
    while (Date.now() - start < milliseconds);
}

//Main loop function
//Will continously run
async function loop(){
    if(!paused) nextGen();
    cellPaint(mPos[0],mPos[1]);
    bg();
    drawGrid(cellArr);
    if(mDown){
        drawGrid(drawCellArr);
    }
    await sleep(speed);
    requestAnimationFrame(loop);
}



//Init function
//Initialises cellArr and fills randomly
function init(){
    cellArr = makeArray(gridSizeCol,gridSizeRow);
    for(let i = 0; i < gridSizeCol; i++){
        for(let j = 0; j < gridSizeRow; j++){
            cellArr[i][j] = Math.floor(Math.random()*2);
        }
    }
}

//Background function
//Clears Background
function bg(){
    c.fillStyle = '#181818';
    c.fillRect(0,0,canvas.width,canvas.height);
}

//Draws grid of cells to canvas
function drawGrid(arr){
    let w = canvas.width/gridSizeRow;
    let h = canvas.height/gridSizeCol;
    for(let i = 0; i < gridSizeCol; i++){
        for(let j = 0; j < gridSizeRow; j++){
            if(arr[i][j] == 1) drawCell(j*w,i*h,w,h);
        }
    }
}

//Draws a single cell
function drawCell(x,y,w,h){
    c.fillStyle = "rgb(255,10,100)"; //Cell color
    c.strokeStyle = "#181818";
    c.lineWidth = 1;
    c.beginPath();
    c.roundRect(x,y,w,h,4);
    c.fill();
    c.stroke();
}

//Returns a 2D array of given dimensions
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

/*
Rules:
1. Any live cell with two or three live neighbours survives.
2. Any dead cell with three live neighbours becomes a live cell.
3. All other live cells die in the next generation. Similarly, all other dead cells stay dead.
*/
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

//---drawing section---

//Function called on mouse down
canvas.addEventListener("mousedown", function(e){
    drawCellArr = makeArray(gridSizeRow,gridSizeCol);
    mDown = true;
},false);

//Function called on mouse up
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

//Function called on mouse move
canvas.addEventListener("mousemove",function(e){
    //getMousePos(e)
    mPos = getMousePos(e);
},false)

//Adds cell to drawCellArr at given x,y pos
function cellPaint(x,y){
    if(mDown){
        var cell = 
            [Math.floor(gridSizeRow/canvas.width*x),
            Math.floor(gridSizeCol/canvas.height*y)];
        console.log(cell);
        drawCellArr[cell[1]][cell[0]] = 1;
    }
}

//Calculate mouse pos relative to canvas.
function getMousePos(e) {
    var rect = canvas.getBoundingClientRect();
    return [
        (e.clientX - rect.left) / (rect.right - rect.left) * canvas.width,
        (e.clientY - rect.top) / (rect.bottom - rect.top) * canvas.height]
}

//Initial function calls. Run on startup.
init();
drawGrid(cellArr);
loop();
