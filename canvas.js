
const canvas = document.querySelector('canvas');
const c = canvas.getContext('2d');

const lenSlid = document.getElementById("length");
const lenOut = document.getElementById("len__val");
lenOut.innerHTML = "Length = "+lenSlid.value;

const width = canvas.width;
const height = canvas.height;
var vecLenMult = 150;

function setup(){
    //c.translate(width/2,0);
    
}

lenSlid.oninput = function(){
    lenOut.innerHTML = "Length = "+this.value;
}

//animation loop
function animate(){
    requestAnimationFrame(animate)
    c.clearRect(0,0,width,height);
    pen.getSlider();
    pen.update();
    pen.draw();
}

//setup();
class Pendulum{
    constructor(len,mass,angle){
        this.bob = new Vector(0,0);
        this.origin = new Vector(width/2,0);
        this.angle = 0;
        this.acc = 0;
        this.vel = 0;
        this.dampening;
        this.grav = new Vector(0,0.5);
        this.len = len;
        this.mass = mass;
        this.angle = angle;
        this.force = new Vector(0,0);
        this.armVec = new Vector(0,0);

    }

    draw(){
        // set the vector of bob to the end of the string.
        this.bob.x = this.len*Math.sin(this.angle);
        this.bob.y = this.len*Math.cos(this.angle);
        //move the bob to the offset of the origin.
        this.bob.add(this.origin);

        //Draw String/Line
        c.beginPath();
        c.moveTo(this.origin.x,this.origin.y);
        c.lineTo(this.bob.x,this.bob.y);
        c.strokeStyle = '#ffffff';
        c.stroke();

        //Draw bob
        c.beginPath();
        c.arc(this.bob.x,this.bob.y,this.mass,0,Math.PI*2);
        c.fillStyle = '#ff0099';
        c.fill();

        //draw vectors
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

    update(){

        this.armVec.copy(this.bob);
        this.armVec.sub(this.origin);
        // this.armVec.mult(-1);
        this.armVec.setMag(this.grav.y);
        this.force = new Vector(this.grav.x-this.armVec.x,this.grav.y-this.armVec.y);


        var temp = this.grav.y*Math.sin(this.angle);
        this.acc = (temp*-1)/this.len;
        this.vel += this.acc;
        this.angle += this.vel;

    }

    getSlider(){
        this.len = lenSlid.value;
    }
}
var pen = new Pendulum(350,40,0.7);
animate();


