const battleBackgroundImage = new Image();
battleBackgroundImage.src = './assets/tiles/battleBackground.png';
const battleBackground = new Sprite({position:{
    x: 0,
    y: 0
    },
    image: battleBackgroundImage
})
const draggleImage = new Image();
draggleImage.src = './assets/tiles/draggleSprite.png';
const draggle = new Sprite({
    position:{
        x: 800,
        y: 100
    },
    image: draggleImage,
    frames:{
        max:4,
        hold: 90
    },
    animate: true,
    isEnemy: true,
    name: 'Draggle'
})

const embyImage = new Image();
embyImage.src = './assets/tiles/embySprite.png';
const emby = new Sprite({
    position:{
        x: 280,
        y: 320
    },
    image: embyImage,
    frames:{
        max:4,
        hold: 90
    },
    animate: true,
    name: 'Emby'
})

const renderedSprites =[draggle, emby]

function animateBattle(){
    window.requestAnimationFrame(animateBattle);
    battleBackground.draw();


    renderedSprites.forEach(sprite =>{
        sprite.draw();
    })
}

animateBattle();

const queue = []




document.querySelectorAll('button').forEach(button =>{
    button.addEventListener('click', (e) =>{
        const selectedAttack = attacks[e.currentTarget.innerHTML]
        if(e.currentTarget.innerHTML == '-') return    
        console.log(selectedAttack);
        emby.attack({ 
        attack: selectedAttack, 
        recipient: draggle,
        renderedSprites
    })
        queue.push(() => {
            draggle.attack({ 
                attack: attacks.Tackle, 
                recipient: emby,
                renderedSprites
            })
        })
    })
})


document.querySelector('#text-container').addEventListener('click', (e) =>{
    if(queue.length > 0)
    {
        queue[0]()
        queue.shift()
    }else {
    document.querySelector('#btn1').style.display = 'inline-block';
    document.querySelector('#btn2').style.display = 'inline-block';
    document.querySelector('#btn3').style.display = 'inline-block';
    document.querySelector('#btn4').style.display = 'inline-block';
    e.currentTarget.style.display = 'none';
    }
})