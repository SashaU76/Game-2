// Canvas setup
const canvas = document.getElementById('canvas1')
const ctx = canvas.getContext('2d')
canvas.width =800;
canvas.height= 500;
ctx.font = '50px Georgia';
let score = 0;
let gameFrame = 0;

let gameSpeed = 1;
let gameOver=false;
let SecondPlayerSprite=false;
let ThirdPlayerSprite=false;
let musicOn=true;

let againBtn=document.getElementById('againBtn')

//Mouse interactivity
let canvasPosition = canvas.getBoundingClientRect();
const mouse = {
    x: canvas.width/2,
    y: canvas.height/2,
    click: false
}
canvas.addEventListener('mousedown', function(event){
    mouse.x= event.x - canvasPosition.left;
    mouse.y = event.y - canvasPosition.top;
})
canvas.addEventListener('mouseup', function(){
    mouse.click = false;
})
//Player
const playerLeft =new Image();
playerLeft.src = 'sprites/klipartz.png'
const playerRight =new Image();
playerRight.src = 'sprites/imgonline2.png'

class Player {
    constructor(){
        this.x = canvas.width;
        this.y = canvas.height/2;
        this.radius = 50;
        this.angle =0;
        this.frameX = 0;
        this.frameY = 0;
        this.frame = 0;
        this.spriteWidth = 75;
        this.spriteHeight= 72;
    }
    update(){
        const dx = this.x- mouse.x;
        const dy = this.y- mouse.y;
        let theta = Math.atan2(dy,dx);
        this.angle = theta;
        if(mouse.x != this.x){
            this.x -=dx/30;
        }
        if(mouse.y != this.y){
            this.y -=dy/30;
        }
    }
    draw(){
        if(mouse.click){
            ctx.loneWidth = 0.002;
            ctx.beginPath();
            ctx.moveTo(this.x, this.y);
            ctx.lineTo(mouse.x, mouse.y);
            ctx.stroke();
        }
        ctx.fillStyle = 'red';
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius/2, 0, Math.PI *2);
        ctx.fill();
        ctx.closePath();
        ctx.save();
        ctx.translate(this.x, this.y);
        if(this.x>=mouse.x){
            ctx.rotate(this.angle);
        }
        if(this.x<=mouse.x){
            ctx.rotate(this.angle+9.6);
        }

        if(this.x>=mouse.x){
            if(SecondPlayerSprite){
                ctx.drawImage(playerLeft, this.frameX * this.spriteWidth+1015, 
                this.frameY*this.spriteHeight, this.spriteWidth, this.spriteHeight+5,
                0-40, 0-40, this.spriteWidth, this.spriteHeight+5)
            }else if(ThirdPlayerSprite){
                ctx.drawImage(playerLeft, this.frameX * this.spriteWidth+940, 
                this.frameY*this.spriteHeight, this.spriteWidth, this.spriteHeight+5,
                0-45, 0-40, this.spriteWidth, this.spriteHeight+5)
            } else{
                ctx.drawImage(playerLeft, this.frameX * this.spriteWidth+940, 
                this.frameY*this.spriteHeight+164, this.spriteWidth, this.spriteHeight-5,
                0-40, 0-40, this.spriteWidth, this.spriteHeight)
            }
        } else {
            if(SecondPlayerSprite){
                ctx.drawImage(playerRight, this.frameX * this.spriteWidth+187, 
                this.frameY*this.spriteHeight, this.spriteWidth, this.spriteHeight+5,
                0-35, 0-40, this.spriteWidth, this.spriteHeight+5)
            }else if(ThirdPlayerSprite){
                ctx.drawImage(playerRight, this.frameX * this.spriteWidth+262, 
                this.frameY*this.spriteHeight, this.spriteWidth, this.spriteHeight+5,
                0-35, 0-40, this.spriteWidth, this.spriteHeight+5)
            } else{
                ctx.drawImage(playerRight, this.frameX * this.spriteWidth+260, 
                this.frameY*this.spriteHeight+162, this.spriteWidth, this.spriteHeight-3,
                0-40, 0-40, this.spriteWidth, this.spriteHeight)
            }
        }
        
        
        ctx.restore();
    }
    
}
const player = new Player();

//Bubles
const GriHead = new Image();
GriHead.src = 'sprites/gri.png'

const bubblesArray = [];
class Bubble {
    constructor(){
        this.x = Math.random() * canvas.width;
        this.y = canvas.height +50;
        this.radius = 23;
        this.speed = Math.random() * 5 + 1;
        this.distance;
        this.counted = false;
        this.sound = Math.random() <= 0.5 ? 'sound1' : 'sound2';
    }
    update(bubblesArray){
        this.y -= this.speed;
        const dx = this.x - player.x;
        const dy = this.y - player.y;
        this.distance = Math.sqrt(dx*dx + dy*dy)
    }
    draw(){
        ctx.fillStyle = 'blue';
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fill();
        ctx.closePath();
        ctx.stroke();
        if(flag==true){
            ctx.drawImage(playerLeft, 532, 120, 40, 40, this.x-32, this.y-29, 60, 60);
        }
        if(flag==false && flag2==true){
            ctx.drawImage(playerLeft, 968, 565, 45, 45, this.x-23, this.y-30, 52, 52);
        }
        if(flag==false && flag2==false){
            ctx.drawImage(GriHead, 300,300, 850, 880, this.x-30, this.y-30, 64, 59);
        }
    }
}

var bubblePop1 = new Audio();
bubblePop1.src ="audio/pomidor9.mp3";
var death = new Audio();
death.src ="audio/voi.mp3";
var winSound = new Audio();
winSound.src ="audio/win.mp3";
var perehod = new Audio();
perehod.src ="audio/perehod.mp3";
var main = new Audio();
main.src ="audio/supernewforgame.mp3";

function handleBubbles(){
    if(gameFrame % 50 == 0){
        bubblesArray.push(new Bubble())
        SecondPlayerSprite=false
    }
    for( let i = 0; i < bubblesArray.length; i++){
        bubblesArray[i].update(bubblesArray[i].distance);
        bubblesArray[i].draw();
        if(bubblesArray[i].distance<120){
            if(bubblesArray[i].distance<90){
                ThirdPlayerSprite=true
                SecondPlayerSprite=false
            } else {
                SecondPlayerSprite=true; 
                ThirdPlayerSprite=false
            } 
        } 
        if(bubblesArray[i].y < 0 -bubblesArray[i].radius*2){
            bubblesArray.splice(i, 1);
            i--;
        } else if(bubblesArray[i].distance < bubblesArray[i].radius + player.radius-23){
            bubblePop1.play()
            SecondPlayerSprite=false; 
            ThirdPlayerSprite=false;
            if(!bubblesArray[i].counted){
                score++
                bubblesArray[i].counted=true
                bubblesArray.splice(i,1);
                i--;
            }
        
        }
        
    }
}
//Repeating backgrounds
const background = new Image();
//background.src = 'sprites/kosmos.jpg'
background.src = 'sprites/zvezda2.jpg'
const BG = {
    x1: 0,
    x2: canvas.width,
    y:0,
    width: canvas.width,
    height:canvas.height
}

function handleBackground(){
    BG.x1-= gameSpeed;
    if(BG.x1 < -BG.width)BG.x1= BG.width;
    BG.x2-= gameSpeed;
    if(BG.x2 < -BG.width)BG.x2= BG.width;
    ctx.drawImage(background, BG.x1, BG.y, BG.width+5, BG.height)
    ctx.drawImage(background, BG.x2, BG.y, BG.width+5, BG.height)
}

//Enemies
const enemySprite = new Image();
enemySprite.src = 'sprites/enemy.png'

class Enemy{
    constructor(){
        this.x = canvas.width+200;
        this.y = Math.random()*(canvas.height - 150)+90;
        this.radius= 20;
        this.speed = (Math.random()*2+3)*gameSpeed/2;
        this.frame =0 ;
        this.frame = 0;
        this.frameX = 0;
        this.frameY = 0;
        this.spriteWidth = 418;
        this.spriteHeight = 397;
        this.angle =0;
    }
    draw(){
        /* шар для коллизий
        ctx.fillStyle = 'red';
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI*2);
        //ctx.rect(50,50,50,50)
        ctx.fill(); */
        //ctx.drawImage(playerLeft, 473, 296, 42, 42, this.x-32, this.y-29, 70, 70);
        // Сохраняем настройки канваса до всяких манипуляций с ним
        ctx.save();
        // Сдвигаем все адресованные пиксели на указанные значения
        ctx.translate(this.x, this.y);
        // Поворачиваем на `degrees` наш градус
        ctx.rotate(this.angle/18); 
        //ctx.drawImage(playerLeft, 473, 296, 42, 42, this.x-32, this.y-29, 70, 70)
        ctx.drawImage(enemySprite,-24,-25,50,50)
        // Возвращаем значения осей
        //ctx.translate(-this.x, -this.y);
        // Рисуем повернутую картинку
        // Восстанавливаем настройки на момент когда делали `ctx.save`
        // то бишь до `ctx.translate` и `ctx.rotate`. Рисунок при этом сохраняется.
        ctx.restore();
    }
    update(){
        this.x -= this.speed;
        this.angle++;
        if(this.x < 0 - this.radius *2){
            this.x = canvas.width +200;
            this.y = Math.random()* (canvas.height-150)+90;
            this.speed = Math.random()*2+2;
        }
        //Collisian
        const dx = this.x - player.x;
        const dy = this.y - player.y;
        const distance = Math.sqrt(dx*dx+dy*dy)
        if(distance<this.radius+player.radius-19){
            handleGameOver()
        }
    }
}

const enemies = [];
enemies.push(new Enemy())

function handleEnemies(){
    for (i=0; i< enemies.length;i++){
    enemies[i].draw();
    enemies[i].update();
    }
};


function handleGameOver(){
    death.play()
    ctx.fillStyle= 'white';
    ctx.fillText('you score: '+ score, 270, 250);
    gameOver=true;
    againBtn.style.visibility= 'visible';
}
function win(){
    winSound.play()
    ctx.fillStyle= 'white';
    ctx.fillText('you are winner!', 260, 250);
    gameOver=true;
    againBtn.style.visibility= 'visible';
}
function again(){
    score = 0;
    player.x=10
    player.y=canvas.height/2
    mouse.x=70
    mouse.y=canvas.height/2
    gameFrame = 0;
    gameSpeed = 1;
    gameOver=false;
    SecondPlayerSprite=false;
    ThirdPlayerSprite=false;
    flag= true
    flag2= true
    console.log('zanovo');
    animate()
    againBtn.style.visibility= 'hidden';
}
let flag= true
let flag2= true

//Animation loop
function animate(){
    ctx.clearRect(0,0, canvas.width,canvas.height)
    handleBackground();
    handleBubbles();
    player.update();
    player.draw();
    handleEnemies();
    ctx.fillStyle = 'red'
    ctx.fillText('score: '+ score, 10, 50)
    gameFrame++;
    if(!gameOver){
        requestAnimationFrame(animate)
    }
    if(score>49&& flag===true){
        perehod.play()
        gameSpeed=2
        enemies.push(new Enemy())
        flag=false

    }
    if(score>99&& flag2===true){
            perehod.play()
            gameSpeed=4
            enemies.push(new Enemy())
            flag2=false
        }
    if(score>149){
        win()
    }
    if(musicOn==true){
        main.play()
    }
}
animate();


window.addEventListener('resize', function(){
    canvasPosition = canvas.getBoundingClientRect();
})

function toggleMusic(){
    main.pause()
    musicOn=!musicOn
}