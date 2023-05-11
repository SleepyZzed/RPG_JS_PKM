const canvas = document.querySelector('canvas');

const ctx = canvas.getContext('2d');
console.log(collisions);
canvas.width = 1024;
canvas.height = 576;

const collisionsMap = []
for (let i = 0; i < collisions.length; i += 70) {
  collisionsMap.push(collisions.slice(i, 70 + i))
}

class Boundary {
    static width = 48
    static height = 48
    constructor({ position }) {
      this.position = position
      this.width = 48
      this.height = 48
    }
  

    draw(){
        ctx.fillStyle= 'rgba(255,0,0,0)';
        ctx.fillRect(this.position.x, this.position.y, this.width, this.height);
    }
}
const offset = {
    x: -735,
    y: -650
}
const boundaries = [];


collisionsMap.forEach((row, i) => {
    row.forEach((symbol, j) => {
      if (symbol === 1025)
        boundaries.push(
          new Boundary({
            position: {
              x: j * Boundary.width + offset.x,
              y: i * Boundary.height + offset.y
            }
          })
        )
    })
  })


const image = new Image();
image.src = './assets/tiles/Pellet Town.png';

const playerImage = new Image();
playerImage.src = './assets/tiles/playerDown.png';

class Sprite{
    constructor({position,velocity, image, frames = {max: 1}}){
        this.position = position
        this.image = image
        this.frames = frames
        this.image.onload = () =>{
            this.width = this.image.width / this.frames.max
            this.height = this.image.height 
        }
        
    }

    draw(){
        
        ctx.drawImage(this.image,
            0,
            0,
            this.image.width / this.frames.max,
            this.image.height,
            this.position.x,
            this.position.y,
            this.image.width / this.frames.max,
            this.image.height
    
         );
    }
}


const player = new Sprite({
    position:{
        x: canvas.width / 2 - 192 / 8,
        y: canvas.height / 2 - 68 / 2
    },
    image: playerImage,
    frames: {
        max: 4
    }
})


const background = new Sprite({position:{
    x: offset.x,
    y: offset.y
    },
    image: image
})
const keys = {
    w: {
        pressed: false
    },
    a: {
        pressed: false
    },
    s: {
        pressed: false
    },
    d: {
        pressed: false
    }

}

const movables = [background, ...boundaries ];

function rectangularCollision({rectangle1, rectangle2}){
    return(
        rectangle1.position.x + rectangle1.width >= rectangle2.position.x &&
        rectangle1.position.x <= rectangle2.position.x + rectangle2.width &&
        rectangle1.position.y <= rectangle2.position.y + rectangle2.height &&
        rectangle1.position.y + rectangle1.height >= rectangle2.position.y

    )
}


function animate(){
    window.requestAnimationFrame(animate)
    background.draw();
    boundaries.forEach(boundary =>{
        boundary.draw();

        
    })

   
    player.draw();

   


    let moving = true;

    if(keys.w.pressed && lastKey === 'w'){
        
        for(let i = 0; i < boundaries.length; i++ )
        {   const boundary = boundaries[i];
            if(rectangularCollision({
                rectangle1: player,
                rectangle2: {...boundary, position:{
                    x: boundary.position.x,
                    y: boundary.position.y + 3
                }}
            })){
                console.log('colliding');
                moving = false;
                break
            }
        }
        if(moving){
        movables.forEach(movable => {movable.position.y += 1}) 
        }
    }
    else if(keys.s.pressed && lastKey === 's'){
        for(let i = 0; i < boundaries.length; i++ )
        {   const boundary = boundaries[i];
            if(rectangularCollision({
                rectangle1: player,
                rectangle2: {...boundary, position:{
                    x: boundary.position.x,
                    y: boundary.position.y - 3
                }}
            })){
                console.log('colliding');
                moving = false;
                break
            }
        }
        if(moving){
        movables.forEach(movable => {movable.position.y += -1})
        }
    }
    else if(keys.a.pressed && lastKey === 'a'){
        for(let i = 0; i < boundaries.length; i++ )
        {   const boundary = boundaries[i];
            if(rectangularCollision({
                rectangle1: player,
                rectangle2: {...boundary, position:{
                    x: boundary.position.x + 3,
                    y: boundary.position.y
                }}
            })){
                console.log('colliding');
                moving = false;
                break
            }
        }
        if(moving){
        movables.forEach(movable => {movable.position.x += 1})
        }
    }
    else if(keys.d.pressed && lastKey === 'd'){
        for(let i = 0; i < boundaries.length; i++ )
        {   const boundary = boundaries[i];
            if(rectangularCollision({
                rectangle1: player,
                rectangle2: {...boundary, position:{
                    x: boundary.position.x - 3,
                    y: boundary.position.y
                }}
            })){
                console.log('colliding');
                moving = false;
                break
            }
        }
        if(moving){
        movables.forEach(movable => {movable.position.x += -1})
        }
    }
}
animate();
let lastKey = '';
let velocity = {
    x: 0,
    y: 0
  };
document.body.addEventListener('keydown', keyDown);
function keyDown(event){
    //Up arrow
    if(event.keyCode == 87){
        keys.w.pressed = true;
        lastKey = 'w';
      }
    //dpwn arrow
    if(event.keyCode == 83){
        keys.s.pressed = true;
        lastKey = 's';
      }
      //left arrow
      if(event.keyCode == 65){
        keys.a.pressed = true;
        lastKey = 'a';
      }
      // right arrow
      if(event.keyCode == 68){
        keys.d.pressed = true;
        lastKey = 'd';
        
      }
      console.log(lastKey); 
      
}
document.body.addEventListener('keyup', keyUp);
function keyUp(event){
    //Up arrow
    if(event.keyCode == 87){
        keys.w.pressed = false;
        
      }
    //dpwn arrow
    if(event.keyCode == 83){
        keys.s.pressed = false;
      }
      //left arrow
      if(event.keyCode == 65){
        keys.a.pressed = false;
      }
      // right arrow
      if(event.keyCode == 68){
        keys.d.pressed = false;
        
      }
      console.log(keys);
      
    
      
       
      
}




