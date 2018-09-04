//Canvas config
var canvas = document.getElementsByTagName('canvas')[0];
var ctx = canvas.getContext('2d');

//testing
//ctx.fillRect (100,100,50,50);


//Variables globales


var bads = []
var interval;
var frames = 0 ;
var images = {
    bg:"./images/fondo-01.png",
    kikiPix: "./images/KIKIright-01.png",
    kikiPixLeft: "./images/KIKIleft.png",

    mePix:"./images/YO.png",
    mobilePix:"./images/CEL.png",
    notesPix: "./images/MUSIC.png",

    hamPix: "./images/JAMON.png",
    bonePix: "./images/HUESO.png",
    beansPix: "./images/FRIJOLES.png",

    heartPixF: "./images/heartFill.png",
    heartPixE: "./images/heartEmpty.png"
    
}




//Clases

class Board{
    constructor(){
        this.x = 0
        this.y = 0
        this.width = canvas.width
        this.height = canvas.height
        this.image = new Image ()
        this.image.src = images.bg
        this.image.onload = function(){
            this.draw()
        }.bind(this)
        this.music = new Audio()
        this.music.src = "./music/Bike_Rides.mp3"
        this.heartFill = new Image ()
        this.heartFill.src = images.heartPixF

        this.heartEmpty = new Image ()
        this.heartEmpty.src = images.heartPixE


    }

    draw(){
        ctx.drawImage(this.image,this.x, this.y, this.width, this.height) 
        ctx.font = "30px Avenir"
        ctx.fillStyle = "white"
        ctx.fillText (Math.floor(frames/60), canvas.width - 760, 40);
        //HEARTS
        ctx.drawImage(this.heartEmpty, canvas.width - 130, 15, 30, 25)
        ctx.drawImage(this.heartEmpty, canvas.width - 90, 15, 30, 25)
        ctx.drawImage(this.heartEmpty, canvas.width - 50, 15, 30, 25)
    }


}


class Kiki{
    constructor(){
        this.x=360
        this.y=300
        this.width = 60
        this.height = 60
        this.image = new Image()
        this.image.src = images.kikiPix
        this.image.onload = () => {
            this.draw()
        }
        this.gravity = 0
        this.crash = new Audio()
        this.crash.src = "./music/kikigru.mov"
    }

    draw (){
        if (this.y < canvas.height -  35) this.y += this.gravity
        ctx.drawImage(this.image,this.x,this.y,this.width,this.height)
    }

    goRight(){
        this.x += 20;
        this.image.src = images.kikiPix;
    }
    
    goLeft(){
        this.x -= 20;
        this.image.src = images.kikiPixLeft;
    }

    crashWith(item){
        var choque =  (this.x < item.x + item.width) &&
                (this.x + this.width > item.x) &&
                (this.y < item.y + item.height) &&
                (this.y + this.height > item.y);
        
        if(choque)this.crash.play()
        return choque
    }

}



class Bad{
    constructor(x){
        this.x = x
        this.y = 0
        this.width = 40
        this.height = 90
        this.image = new Image()
        this.image.src = images.mePix
        this.image.onload = () => {
            this.draw()
        }
    }
    draw(){
        this.y++
        ctx.drawImage(this.image,this.x,this.y,this.width,this.height)    
    }
}



//Instancias
var board = new Board()
var kiki = new Kiki()


//Funciones principales
function update(){

    frames++
    ctx.clearRect(0, 0, canvas.width, canvas.height)
    board.draw()
    kiki.draw()
    generateBads()
    drawBads()
    checkCollitions()

}

function start(){
    if(interval) return
    bads = []
    frames = 0
    interval = setInterval(update,1000/60)
}

function gameOver(){
    clearInterval(interval)
    ctx.font = "80px Avenir"
    ctx.fillText("Game Over", 50, 250)
    ctx.font = "30px Avenir"
    ctx.fillStyle="red"
    ctx.fillText("Press esc to restart", 60, 300)
    interval = null
    board.music.pause()
}


//Funciones Auxiliares


function generateBads(){
    if (frames % 100 === 0){
        const x = Math.floor(Math.random() * 40)
        bads.push(new Bad(x * 50))

    }
}

function drawBads() {
    bads.forEach(function(Bad){
        Bad.draw()
    })
}

function checkCollitions(){
    bads.forEach(function(bad){
        if(kiki.crashWith(bad) ){
            gameOver()

        }

    })

}


//Los observadores (escuchadores)

addEventListener("keydown", (e) => {
    switch (e.keyCode) {
        case 39:
          if (kiki.x > canvas.width -80) return
          kiki.goRight()
          break;
        case 37:
          if (kiki.x < 20) return
          kiki.goLeft()
          break;
        case 27: //enter
          start()
          break;
        case 13: //escape
          start()
          board.music.play()
    }
})