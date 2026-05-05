var canvas, lienzo;

// IMÁGENES
var imgBody = new Image();
var imgFood = new Image();
var imgWall = new Image();

// SONIDOS
var sndChomp = new Audio();
var sndDie = new Audio();

// cargar recursos
imgBody.src = "imgs/body.png";
imgFood.src = "imgs/fruit.png";
imgWall.src = "imgs/wall.png";

sndChomp.src = "sounds/chomp.ogg";
sndDie.src = "sounds/dies.ogg";

var body = [];
var wall = [];
var wallDir = [];
var food;

var score = 0;
var pause = false;
var gameover = false;

const ARRIBA = 0;
const DERECHA = 1;
const ABAJO = 2;
const IZQUIERDA = 3;

var dir = DERECHA;
var lastPress = null;

const KEY_UP = 38;
const KEY_RIGHT = 39;
const KEY_DOWN = 40;
const KEY_LEFT = 37;
const KEY_P = 80;
const KEY_ENTER = 13;

function Rectangle(x,y,width,height){
    this.x=x;
    this.y=y;
    this.width=width;
    this.height=height;

    this.draw=function(img){
        lienzo.drawImage(img, this.x, this.y, this.width, this.height);
    }

    this.intersects=function(rect){
        return(
            this.x < rect.x + rect.width &&
            this.x + this.width > rect.x &&
            this.y < rect.y + rect.height &&
            this.y + this.height > rect.y
        );
    }
}

function random(max){
    return Math.floor(Math.random()*max);
}

function reset(){

    score = 0;
    dir = DERECHA;
    gameover = false;

    body = [];

    body.push(new Rectangle(40,40,10,10));
    body.push(new Rectangle(30,40,10,10));
    body.push(new Rectangle(20,40,10,10));

    food = new Rectangle(200,100,10,10);

    wall = [];
    wallDir = [];

    wall.push(new Rectangle(100,50,10,10));
    wall.push(new Rectangle(100,100,10,10));
    wall.push(new Rectangle(200,50,10,10));
    wall.push(new Rectangle(200,100,10,10));

    for(var i=0;i<wall.length;i++){
        wallDir.push(random(4));
    }
}

function act(){

    if(lastPress == KEY_P){
        pause = !pause;
        lastPress = null;
    }

    if(gameover && lastPress == KEY_ENTER){
        reset();
    }

    if(pause || gameover) return;

    if(lastPress == KEY_UP && dir != ABAJO) dir = ARRIBA;
    if(lastPress == KEY_RIGHT && dir != IZQUIERDA) dir = DERECHA;
    if(lastPress == KEY_DOWN && dir != ARRIBA) dir = ABAJO;
    if(lastPress == KEY_LEFT && dir != DERECHA) dir = IZQUIERDA;

    // mover cuerpo
    for(var i=body.length-1;i>0;i--){
        body[i].x = body[i-1].x;
        body[i].y = body[i-1].y;
    }

    // mover cabeza
    if(dir == DERECHA) body[0].x += 10;
    if(dir == IZQUIERDA) body[0].x -= 10;
    if(dir == ARRIBA) body[0].y -= 10;
    if(dir == ABAJO) body[0].y += 10;

    // atravesar bordes
    if(body[0].x >= 500) body[0].x = 0;
    if(body[0].x < 0) body[0].x = 490;
    if(body[0].y >= 300) body[0].y = 0;
    if(body[0].y < 0) body[0].y = 290;

    // comer comida
    if(body[0].intersects(food)){
        score++;
        sndChomp.play(); // 🔊 sonido

        body.push(new Rectangle(0,0,10,10));
        food.x = random(49)*10;
        food.y = random(29)*10;
    }

    // chocar consigo misma
    for(var i=1;i<body.length;i++){
        if(body[0].intersects(body[i])){
            gameover = true;
            sndDie.play(); // 🔊 sonido muerte
        }
    }

    // mover paredes
    for(var i=0;i<wall.length;i++){

        wallDir[i] = random(4);

        if(wallDir[i] == ARRIBA) wall[i].y -= 10;
        if(wallDir[i] == DERECHA) wall[i].x += 10;
        if(wallDir[i] == ABAJO) wall[i].y += 10;
        if(wallDir[i] == IZQUIERDA) wall[i].x -= 10;

        // límites
        if(wall[i].x < 0) wall[i].x = 0;
        if(wall[i].x > 490) wall[i].x = 490;
        if(wall[i].y < 0) wall[i].y = 0;
        if(wall[i].y > 290) wall[i].y = 290;
    }

    // choque con paredes
    for(var i=0;i<wall.length;i++){
        for(var j=0;j<body.length;j++){
            if(body[j].intersects(wall[i])){
                gameover = true;
                sndDie.play();
            }
        }
    }
}

function paint(){

    var grad = lienzo.createLinearGradient(0,0,0,300);
    grad.addColorStop(0,"blue");
    grad.addColorStop(1,"black");

    lienzo.fillStyle = grad;
    lienzo.fillRect(0,0,500,300);

    lienzo.fillStyle = "white";
    lienzo.font = "12px Arial";
    lienzo.fillText("Score: " + score,10,15);

    // dibujar serpiente
    for(var i=0;i<body.length;i++){
        body[i].draw(imgBody);
    }

    // comida
    food.draw(imgFood);

    // paredes
    for(var i=0;i<wall.length;i++){
        wall[i].draw(imgWall);
    }

    if(gameover){
        lienzo.fillText("GAME OVER",210,150);
    }

    if(pause){
        lienzo.fillText("PAUSE",230,150);
    }
}

function run(){
    setTimeout(run,120);
    act();
    paint();
}

function iniciar(){
    canvas = document.getElementById("lienzo");
    lienzo = canvas.getContext("2d");

    reset();
    run();
}

window.addEventListener("load", iniciar);

document.addEventListener("keydown", function(e){
    lastPress = e.keyCode;
});