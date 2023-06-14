window.onload = function() {

   //Links to elements in canvas
    var canvas = document.getElementById("homeCanvasBackground");
    var ctx = canvas.getContext("2d");
   
    //pi constant
    var pi = Math.PI;
 
    var centerX, centerY;
    var part_num = 2000;//number of particles
 
    var mousedown = false;
    var X, Y; //x and y mouse pos decleration

    var P = []; //array of points

    //part class constructor
    var part = function(x, y, vx, vy, r, red, green, blue, alpha, col) {
       this.x = x;
       this.y = y;
       this.vx = vx;
       this.vy = vy;
       this.r = r;
       this.red = red;
       this.green = green;
       this.blue = blue;
       this.alpha = alpha;
       this.col = col;
    };
 
    //generate a random value between min and max
    function rand(min, max) {
       return Math.random() * (max - min) + min;
    }
 
    //Calculate magnitude of vector
    function dist(dx, dy) {
       return Math.sqrt(dx * dx + dy * dy);
    }
 
    //Update size of canvas to the size of window
    function size() {
       canvas.width = window.innerWidth;
       canvas.height = window.innerHeight;
 
       centerX = canvas.width / 2;
       centerY = canvas.height / 2;
    }
    size();
    X = centerX;
    Y = centerY;
 
    //initialise function
    //fills p array with particles
    function init() {
       var x, y, vx, vy, r, red, green, blue, alpha, col;
       for (var i = 0; i < part_num; i++) {
          x = rand(0, canvas.width);
          y = rand(0, canvas.height);
          vx = rand(-1, 1);
          vy = rand(-1, 1);
          r = rand(1, 5);
          red = Math.round(rand(200, 255));
        //   green = Math.round(rand(100, 255));
          green = 0;
          blue = Math.round(rand(50, 200));
          alpha = 1;
          col = "rgba(" + red + "," + green + "," + blue + "," + alpha + ")";
 
          P.push(new part(x, y, vx, vy, r, red, green, blue, alpha, col));
       }
    }
 
    //clear background
    function bg() {
       ctx.fillStyle = "#1818182a";
       ctx.fillRect(0, 0, canvas.width, canvas.height);
    }
 
    //edge detection
    function bounce(b) {
       if (b.x < b.r) {
          b.x = b.r;
          b.vx *= -1;
       }
       if (b.x > canvas.width - b.r) {
          b.x = canvas.width - b.r;
          b.vx *= -1;
       }
 
       if (b.y - b.r < 0) {
          b.y = b.r;
          b.vy *= -1;
       }
       if (b.y > canvas.height - b.r) {
          b.y = canvas.height - b.r;
          b.vy *= -1;
       }
    }
 
    //calculate new velocity 
    function attract(p) {
       var dx = (p.x - X),
          dy = (p.y - Y),
          dist = Math.sqrt(dx * dx + dy * dy),
          angle = Math.atan2(dy, dx);
 
       //if within a certain distance attract or repel
       if (dist > 10 && dist < 300) {
          if (!mousedown) {
             p.vx -= (40 / (p.r * dist)) * Math.cos(angle);
             p.vy -= (40 / (p.r * dist)) * Math.sin(angle);
          } else if (mousedown) {
             p.vx += (250 / (p.r * dist)) * Math.cos(angle);
             p.vy += (250 / (p.r * dist)) * Math.sin(angle);
          }
       }
 
    }
 
    //draw particles to canvas
    function draw() {
       var p;
       for (var i = 0; i < P.length; i++) {
          p = P[i];
 
          if(mouseover) attract(p);
          bounce(p);
 
          p.x += p.vx;
          p.y += p.vy;
 
          p.vx *= .985;
          p.vy *= .985;
        
          ctx.fillStyle=p.col;
          ctx.beginPath();
          ctx.roundRect(p.x,p.y,p.r,p.r,20);
          ctx.fill();

 
          
       }
    }
 
    //Main loop function
    function loop() {
       bg();
       draw();
 
       window.requestAnimationFrame(loop);
    }
 
    window.onresize = size;
    //----Mouse event listners/handlers----
    //mouse move event handler
    window.onmousemove = function(e) {
      var rect = canvas.getBoundingClientRect();
       X = (e.clientX - rect.left)/(rect.right - rect.left) * canvas.width;
       Y = (e.clientY - rect.top)/(rect.bottom - rect.top) * canvas.height;
    }
    
    //mouse down event handler
    window.onmousedown = function() {
       mousedown = true;
    }
    
    //mouse up event handler
    window.onmouseup = function() {
       mousedown = false;
    }
    
    var mouseover=false;
    
    //mouse over event handler
    window.onmouseover = function() {
       mouseover = true;
    }
    
    //mouse out event handler
    window.onmouseout = function(){
       mouseover=false;
    }
 
    init();
    loop();
 }