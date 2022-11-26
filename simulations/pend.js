
const canvas = document.querySelector('canvas');
const c = canvas.getContext('2d');


const width = canvas.width;
const height = canvas.height;
var origin = new Vector(width/2,0);
var vecLenMult = 150;
var mouseDown = false;

function setup(){
    //c.translate(width/2,0);
    
}

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


captureMouse = function(element){
    var mouse = {x:0, y:0, event:null};
    canvas.addEventListener("mousemove", (event)=> {
        mouse.x = event.pageX;
        mouse.y = event.pageY;
        mouse.event = event;
    },false);
}

canvas.addEventListener("mousedown", function(){
    mouseDown = true;
    canvas.addEventListener("mouseup", onMouseUp, false);
    canvas.addEventListener("mousemove", onMouseMove, false); 
},false);

function onMouseUp(){
    mouseDown = false;
    canvas.removeEventListener("mouseup", onMouseUp, false);
    canvas.removeEventListener("mousemove", onMouseMove , false);
}

function onMouseMove(event){
    var mousePos = new Vector(event.pageX,event.pageY);
    var mouseAng = Math.atan2(origin.y - mousePos.y,origin.x - mousePos.x);
    //console.log(mouseAng);
    pen.moveToMouse(-mouseAng - Math.PI/2);
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

//setup();
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

        //draw vectors
        if (false){
            c.save();
            c.translate(this.bob.x,this.bob.y);
            c.beginPath();
            c.moveTo(0,0);
            c.lineTo(this.grav.x*vecLenMult,this.grav.y*vecLenMult);
            c.strokeStyle = '#00ff00';
            c.stroke();
            c.restore();
            
            c.save();
            c.translate(this.bob.x,this.bob.y);
            c.beginPath();
            c.moveTo(0,0);
            c.lineTo(this.force.x*vecLenMult,this.force.y*vecLenMult);
            c.strokeStyle = '#0000ff';
            c.stroke();
            c.restore();
            
        // c.save();
        // c.translate(this.bob.x,this.bob.y);
        // c.beginPath();
        // c.moveTo(0,0);
        // c.lineTo(this.armVec.x,this.armVec.y);
        // c.strokeStyle = '#0000ff';
        // c.stroke();
        // c.restore();
        }
    }

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

    moveToMouse(ang){
        this.vel = 0;
        this.acc = 0;
        this.angle = ang;
    }

    getSlider(){
        this.len = lenSlid.value;
        this.mass = massSlid.value;
        this.grav.y = gravSlid.value/70;
        this.size = sizeSlid.value;
        this.damp = dampSlid.value/10000;
    }
}
var pen = new Pendulum(350,massSlid,0.7);
animate();


