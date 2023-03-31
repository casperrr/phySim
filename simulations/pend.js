//Refrences to HTML elements.
const canvas = document.querySelector('canvas');
const c = canvas.getContext('2d');

//Global variables
const width = canvas.width;
const height = canvas.height;
var origin = new Vector(width/2,0);
var vecLenMult = 150;
var mouseDown = false;

//----Variables for input elements----
//Sliders
const lenSlid = document.getElementById("length");
const lenOut = document.getElementById("len__val");
lenOut.innerHTML = lenSlid.value;

const massSlid = document.getElementById("mass");
const massOut = document.getElementById("mass__val");
massOut.innerHTML = massSlid.value;

const gravSlid = document.getElementById("gravity");
const gravOut = document.getElementById("grav__val");
gravOut.innerHTML = gravSlid.value/10;

const sizeSlid = document.getElementById("size");
const sizeOut = document.getElementById("size__val");
sizeOut.innerHTML = sizeSlid.value;

const dampSlid = document.getElementById("damp");
const dampOut = document.getElementById("damp__val");
dampOut.innerHTML = dampSlid.value/100;

//Buttons
lenSlid.oninput = function(){
    lenOut.innerHTML = this.value;
}
massSlid.oninput = function(){
    massOut.innerHTML = this.value;
}
gravSlid.oninput = function(){
    gravOut.innerHTML = this.value/10;
}
sizeSlid.oninput = function(){
    sizeOut.innerHTML = this.value;
}
dampSlid.oninput = function(){
    dampOut.innerHTML = this.value/100;
}

//Mouse position event
captureMouse = function(element){
    var mouse = {x:0, y:0, event:null};
    canvas.addEventListener("mousemove", (event)=> {
        mouse.x = event.pageX;
        mouse.y = event.pageY;
        mouse.event = event;
    },false);
}

//Mouse down event with mouse up and mouse move events
canvas.addEventListener("mousedown", function(){
    mouseDown = true;
    canvas.addEventListener("mouseup", onMouseUp, false);
    canvas.addEventListener("mousemove", onMouseMove, false); 
},false);

//Mouse up function
function onMouseUp(){
    mouseDown = false;
    canvas.removeEventListener("mouseup", onMouseUp, false);
    canvas.removeEventListener("mousemove", onMouseMove , false);
}

//Mouse event handler
function onMouseMove(event){
    let mousePosArr = getMousePos(event);
    var mousePos = new Vector(mousePosArr[0],mousePosArr[1]);
    var mouseAng = Math.atan2(origin.y - mousePos.y,origin.x - mousePos.x);
    pen.moveToMouse(-mouseAng - Math.PI/2);
}

//get mouse positon relative to canvas
function getMousePos(e) {
    var rect = canvas.getBoundingClientRect();
    return [
        (e.clientX - rect.left) / (rect.right - rect.left) * canvas.width,
        (e.clientY - rect.top) / (rect.bottom - rect.top) * canvas.height]
} 

//animation loop
function animate(){
    requestAnimationFrame(animate);
    c.clearRect(0,0,width,height);
    pen.getSlider();
    if(!mouseDown){
        pen.update();}
    pen.draw();
}

//Pendulum class
class Pendulum{
    constructor(len,mass,angle){
        this.bob = new Vector(0,0);
        //this.origin = new Vector(width/2,0);
        this.angle = 0;
        this.acc = 0;
        this.vel = 0;
        this.damp = 0;
        this.grav = new Vector(0,0.5);
        this.len = len;
        this.mass = mass;
        this.size = 60;
        this.angle = angle;
        this.force = new Vector(0,0);
        this.armVec = new Vector(0,0);

    }

    draw(){
        // set the vector of bob to the end of the string.
        this.bob.x = this.len*Math.sin(this.angle);
        this.bob.y = this.len*Math.cos(this.angle);
        //move the bob to the offset of the origin.
        this.bob.add(origin);

        //Draw String/Line
        c.beginPath();
        c.moveTo(origin.x,origin.y);
        c.lineTo(this.bob.x,this.bob.y);
        c.strokeStyle = '#ffffff';
        c.stroke();

        //Draw bob
        c.beginPath();
        c.arc(this.bob.x,this.bob.y,this.size,0,Math.PI*2);
        c.fillStyle = '#ff0099';
        c.fill();

        //draw vectors (not in use)
        if (false){
            //gravity vector
            c.save();
            c.translate(this.bob.x,this.bob.y);
            c.beginPath();
            c.moveTo(0,0);
            c.lineTo(this.grav.x*vecLenMult,this.grav.y*vecLenMult);
            c.strokeStyle = '#00ff00';
            c.stroke();
            c.restore();
            
            //force on bob vector
            c.save();
            c.translate(this.bob.x,this.bob.y);
            c.beginPath();
            c.moveTo(0,0);
            c.lineTo(this.force.x*vecLenMult,this.force.y*vecLenMult);
            c.strokeStyle = '#0000ff';
            c.stroke();
            c.restore();
        }
    }

    //calculate new pendulum position
    update(){
        this.armVec.copy(this.bob);
        this.armVec.sub(origin);
        // this.armVec.mult(-1);
        this.armVec.setMag(this.grav.y);
        this.force = new Vector(this.grav.x-this.armVec.x,this.grav.y-this.armVec.y);

        var temp = (this.grav.y*this.mass/100)*Math.sin(this.angle);

        this.acc = (temp*-1)/this.len;
        this.vel += this.acc;
        this.angle += this.vel;
        this.vel *= 1-this.damp;
    }

    //move pendulum to the mouse position
    moveToMouse(ang){
        this.vel = 0;
        this.acc = 0;
        this.angle = ang;
    }

    //update values with slider values
    getSlider(){
        this.len = lenSlid.value;
        this.mass = massSlid.value;
        this.grav.y = gravSlid.value/70;
        this.size = sizeSlid.value;
        this.damp = dampSlid.value/10000;
    }
}
//Pendulum object
var pen = new Pendulum(350,massSlid,0.7);
animate();


