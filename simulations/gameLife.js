const canvas = document.querySelector('canvas');
const c = canvas.getContext("2d");
const inputs = document.querySelector(".element__container");


//Event listner for inputs (Range slider only.)
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
        switch(btnClicked.id){
            case "btnStart":
                abortController = true;
                insertSort(bars);
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

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}


function init(){

}

function bg(){
    c.fillStyle = '#181818';
    c.fillRect(0,0,canvas.width,canvas.height);
}

