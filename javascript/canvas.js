var canvas = document.getElementById("canvas_skill"),
    skill_list = Array.from(document.getElementById("skill_list").getElementsByTagName("li")).map(e=>e.id);
    ctx = canvas.getContext("2d"),
    particles = [],
    text='',
    isFalling=false,
    index=0,
    start=[],
    start_index=0,
    end=[],
    end_index=0,
    time=0;

var screenwidth = window.innerWidth;
var width = canvas.width = screenwidth>600?600:screenwidth;
var height = canvas.height = width/3;
var Req;
var isClean = false;

function Particle(x,y,text){
    this.groundx = width*Math.random();
    this.groundy = height*1.2;

    this.x = this.groundx;
    this.y = this.groundy;
    this.dest = {
        x : x,
        y : y
    };
    this.r =  1.5;
    this.vx = 0;
    this.vy = 0;
    this.sign=(Math.random()>0.5 ? 1 : -1);
    this.accX = 0;
    this.accY = 0;
    this.frictionx = Math.random()*0.04+0.9;
    this.frictiony = Math.random()*0.09+0.85;
    this.count=0;
    this.text=text;

    this.color = 'white'
    // colors[Math.floor(Math.random()*colors.length)];
}

Particle.prototype.render = function(text) {    
    if (this.text===text){
        if (this.count<this.dest.y){
            this.count += 3;
            this.vx=0;
            this.vy=0;
        }else {
            this.accX = (this.dest.x - this.x)/3;
            this.accY = (this.dest.y - this.y)/3;
            this.vx = this.accX;
            this.vy = this.accY;
        }
    } 
    else {
        if(this.count>0){
            this.count -= 2;
            this.vx=0;
            this.vy=0;
        } else {
            this.accX = this.sign*(this.groundy - this.y)*Math.random()*0.01;
            this.accY = (this.groundy - this.y)/100;
            this.vx += this.accX;
            this.vy += this.accY;
            this.vx *= this.frictionx;
            this.vy *= this.frictiony;
        }
    }
    
    if (this.x<0) {
        this.x = -this.x;
        this.vx = -this.vx;
        this.sign = -this.sign;
    } else if(this.x>width) {
        this.x = width-(this.x-width);
        this.vx = -this.vx;
        this.sign = -this.sign;
    }
    this.x += this.vx;
    this.y += this.vy;
    
    ctx.fillStyle = this.color;
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.r, Math.PI * 2, false);
    ctx.fill();
    ctx.closePath();
    
}

function initScene(){
    screenwidth = window.innerWidth;
    width = canvas.width = screenwidth>600?600:screenwidth;
    height = canvas.height = width/3;
    particles=[];
    for (let skill=0;skill<skill_list.length;skill++){
        let word=skill_list[skill];
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        ctx.font = "bold "+width/5+"px arial";
        ctx.textAlign = "center";
        ctx.textBaseline = "top";
        ctx.fillText(word, width/2, 0);

        var data  = ctx.getImageData(0, 0, width, height).data;
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        start.push(particles.length);
        for(let i=0;i<width;i+=4){
            for(let j=0;j<height;j+=4){
                if(data[ ((i + j*width)*4) + 3] == 255 ){
                    particles.push(new Particle(i,j,word));
                }
            }
        }
        end.push(particles.length);
    }
    text = skill_list[Math.floor(Math.random()*(skill_list.length))];
    index = skill_list.indexOf(text);
    start_index = start[index];
    end_index = end[index];
}


function render() {
    setTimeout(function(){
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        for (var i = start_index; i < end_index; i++) {
            particles[i].render(text);
        }
        if (isFalling && time==80) {
            isFalling = false;
            text=skill_list[Math.floor(Math.random()*(skill_list.length))];
            index = skill_list.indexOf(text);
            start_index = start[index];
            end_index = end[index];
            time = 0;
        } else if (isFalling && time < 80){
            time ++;
        } else if (time < 100) {
            time ++;
        } else if (time == 100) {
            isFalling = true; 
            text = '';
            time = 0;
        }
        requestAnimationFrame(render);
    }, 25)
    
};

initScene();
requestAnimationFrame(render);


function debounce(fn, delay) {

    var timer
  
    return function () {
  
      var context = this
      var args = arguments
  
      clearTimeout(timer)
  
      timer = setTimeout(function () {
        fn.apply(context, args)
      }, delay)
    }
}
window.addEventListener("resize", debounce(function(){
    initScene();
    time = 0;
    isFalling=false;
    isClean = true;
},1000));


