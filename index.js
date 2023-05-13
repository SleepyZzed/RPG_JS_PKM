const canvas = document.querySelector('canvas');





const ctx = canvas.getContext('2d');

canvas.width = 1024;
canvas.height = 576;

const collisionsMap = []
for (let i = 0; i < collisions.length; i += 70) {
  collisionsMap.push(collisions.slice(i, 70 + i))
}

const battleZonesMap = []
for (let i = 0; i < battleZonesData.length; i += 70) {
  battleZonesMap.push(battleZonesData.slice(i, 70 + i))
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

const battleZones = []
battleZonesMap.forEach((row, i) => {
    row.forEach((symbol, j) => {
      if (symbol === 1025)
        battleZones.push(
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

const foregroundObjects = new Image();
foregroundObjects.src = './assets/tiles/ForegroundObjects.png';

const playerDownImage = new Image();
playerDownImage.src = './assets/tiles/playerDown.png';
const playerUpImage = new Image();
playerUpImage.src = './assets/tiles/playerUp.png';
const playerLeftImage = new Image();
playerLeftImage.src = './assets/tiles/playerLeft.png';
const playerRightImage = new Image();
playerRightImage.src = './assets/tiles/playerRight.png';




const player = new Sprite({
    position:{
        x: canvas.width / 2 - 192 / 8,
        y: canvas.height / 2 - 68 / 2
    },
    image: playerDownImage,
    frames: {
        max: 4,
        hold: 40
    },
    sprites: {
        up: playerUpImage,
        down: playerDownImage,
        left: playerLeftImage,
        right: playerRightImage
    }
})


const background = new Sprite({position:{
    x: offset.x,
    y: offset.y
    },
    image: image
})

const foreground = new Sprite({position:{
    x: offset.x,
    y: offset.y
    },
    image: foregroundObjects
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

const movables = [background, ...boundaries, foreground, ...battleZones ];

function rectangularCollision({rectangle1, rectangle2}) {
    // Calculate the height to be considered for collision (half of rectangle1's height)
    const collisionHeight = rectangle1.height / 2;

    return (
        rectangle1.position.x + rectangle1.width >= rectangle2.position.x &&
        rectangle1.position.x <= rectangle2.position.x + rectangle2.width &&
        rectangle1.position.y + collisionHeight <= rectangle2.position.y + rectangle2.height &&
        rectangle1.position.y + rectangle1.height >= rectangle2.position.y
    );
}
const battle =  {
    initiated: false
}


function animate(){
    const animationId = window.requestAnimationFrame(animate);

    background.draw();
    boundaries.forEach(boundary =>{
        boundary.draw();

        
    })

   battleZones.forEach(battleZones =>{
    battleZones.draw();
   })
    player.draw();
    foreground.draw();

    let moving = true;
    player.animate = false;

    if(battle.initiated) return

    if(keys.w.pressed  || keys.a.pressed || keys.s.pressed || keys.d.pressed)
    {
        for(let i = 0; i < battleZones.length; i++ )
        {   const battleZone = battleZones[i];
            const overlappingArea =
            (Math.min(
            player.position.x + player.width,
            battleZone.position.x + battleZone.width
            ) -
            Math.max(player.position.x, battleZone.position.x)) *
            (Math.min(
            player.position.y + player.height,
            battleZone.position.y + battleZone.height *2
            ) -
            Math.max(player.position.y, battleZone.position.y))


            if(rectangularCollision({
                rectangle1: player,
                rectangle2: battleZone
            
                }) && 
                    overlappingArea > (player.width * player.height) / 2 && 
                    Math.random() < 0.01
                ){

                window.cancelAnimationFrame(animationId);

                audio.Map.stop();
                audio.initBattle.play();
                audio.battle.play();
                battle.initiated = true;
                gsap.to('#cover', {
                    opacity: 1,
                    repeat: 4,
                    yoyo: true,
                    duration: .2,
                    onComplete() {
                        gsap.to('#cover', {
                            opacity: 1,
                            duration: .2,
                            onComplete(){
                                initBattle();
                                animateBattle();
                                gsap.to('#cover', {
                                    opacity: 0,
                                    duration: .2,
                                    
                                })
                            }
                        })
                    }
                    
                })
                break
            }
        }
    }

 
    if(keys.w.pressed && lastKey === 'w'){
        player.animate = true;
        player.image = player.sprites.up;
        for(let i = 0; i < boundaries.length; i++ )
        {   const boundary = boundaries[i];
            if(rectangularCollision({
                rectangle1: player,
                rectangle2: {...boundary, position:{
                    x: boundary.position.x,
                    y: boundary.position.y + 1
                }}
            })){

                moving = false;
                break
            }
        }
        
        



        if(moving){
        movables.forEach(movable => {movable.position.y += 1}) 
        }
    }
    else if(keys.s.pressed && lastKey === 's'){
        player.animate = true;
        player.image = player.sprites.down;
        for(let i = 0; i < boundaries.length; i++ )
        {   const boundary = boundaries[i];
            if(rectangularCollision({
                rectangle1: player,
                rectangle2: {...boundary, position:{
                    x: boundary.position.x,
                    y: boundary.position.y - 1
                }}
            })){
       
                moving = false;
                break
            }
        }
        


        if(moving){
        movables.forEach(movable => {movable.position.y += -1})
        }
    }
    else if(keys.a.pressed && lastKey === 'a'){
        player.animate = true;
        player.image = player.sprites.left;
        for(let i = 0; i < boundaries.length; i++ )
        {   const boundary = boundaries[i];
            if(rectangularCollision({
                rectangle1: player,
                rectangle2: {...boundary, position:{
                    x: boundary.position.x + 1,
                    y: boundary.position.y
                }}
            })){
            
                moving = false;
                break
            }
        }
        if(moving){
        movables.forEach(movable => {movable.position.x += 1})
        }
    }
    else if(keys.d.pressed && lastKey === 'd'){
        player.animate = true;
        player.image = player.sprites.right;
        for(let i = 0; i < boundaries.length; i++ )
        {   const boundary = boundaries[i];
            if(rectangularCollision({
                rectangle1: player,
                rectangle2: {...boundary, position:{
                    x: boundary.position.x - 1,
                    y: boundary.position.y
                }}
            })){
             
                moving = false;
                break
            }
        }
        if(moving){
        movables.forEach(movable => {movable.position.x += -1})
        }
    }
}

//animate();

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
}

let clicked = false
addEventListener('click', () =>{
    if(!clicked){
        audio.Map.play();
        clicked = true;
    }
})




