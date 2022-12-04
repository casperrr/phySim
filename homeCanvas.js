//window.onload = function() {
    const canvas = document.querySelector('#homeCanvasBackground');
    const c = canvas.getContext("2d");
    
    var part_num = 100;

    var mousedown = false;
    var mPos;

    var Color = function(r,g,b){
        this.r = r;
        this.g = g;
        this.b = b;
    }

    var particles = [];
    var particle = function(pos,vel,rad,col){
        this.pos = pos;
        this.vel = vel;
        this.rad = rad;
        this.col = col;
    };

    

    function rand(min,max){
        return Math.random()*(max-min) + min;
    }

    function size(){
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }

    size();
    mPos = new Vector(canvas.width/2,canvas.height/2);

    function init(){
        var pos, vel, rad, color;
        for(let i = 0; i < part_num; i++){
            pos = new Vector(rand(0,canvas.width),rand(0,canvas.height));
            vel = new Vector(rand(-1,1));
            rad = rand(1,10);
            color = new Color(Math.round(rand(200,255)),0,Math.round(rand(50,200)));

            particles.push(new particle(pos,vel,rad,color));
        }
    }

    function bg(){
        c.fillStyle = "#181818";
        c.fillRect(0,0,canvas.width,canvas.height);
    }

    function wall(b){
        if(b.pos.x > canvas.width || b.pos.x < 0){
            b.vel.x *= -1;
        }
        if(b.pos.y > canvas.height || b.pos.y < 0){
            b.vel.y *= -1;
        }
    }

    function attract(p){
        //console.log("running")
        var mouse = mPos;
        var d = new Vector(p.pos.x - mouse.x, p.pos.y - mouse.y);
        var dist = mouse.getMag(p.pos);
        var angle = d.normalise();

        if(dist > 10 && dist < 300 && mousedown){
            p.vel.sub(angle.mult(40/(r*dist)));
        }
    }

    function draw(){
        var p;
        for(let i = 0; i < particles.length; i++){
            p = particles[i];

            if(mouseover){
                attract(p)
            }
            wall(p);

            p.pos.add(p.vel);
            p.vel.mult(0.975);

            c.beginPath();
            c.fillStyle = `rgb(${p.col.r},${p.col.g},${p.col.b})`;
            c.arc(p.pos.x,p.pos.y,p.rad,0,Math.PI*2);
        }
    }

    function loop(){
        bg();
        draw();

        window.requestAnimationFrame(loop);
    }

    window.onresize = size;

    window.onmousemove = function(e){
        mPos = new Vector(e.clientX, e.clientY);
    }

    window.onmousedown = function(){
        mousedown = true;
    }

    window.onmouseup = function(){
        mousedown = false;
    }

    var mouseover = false;

    // window.onmouseover = function(){
    //     mouseover = true;
    // }

    // window.onmouseout = function(){
    //     mouseover = false;
    // }

    init();
    loop();




//}
