const battleBackgroundImage = new Image();
battleBackgroundImage.src = './assets/tiles/battleBackground.png';
const battleBackground = new Sprite({position:{
    x: 0,
    y: 0
    },
    image: battleBackgroundImage
})

let draggle; 
let emby;
let renderedSprites;
let queue;




let battleAnimationId


function animateBattle(){
    battleAnimationId = window.requestAnimationFrame(animateBattle);
    battleBackground.draw();


    renderedSprites.forEach(sprite =>{
        sprite.draw();
    })
}
function initBattle(){
    document.querySelector('#battle-ui').style.display = 'block';
    document.querySelector('#text-container').style.display = 'none';
    document.querySelector('#enemy').style.width = '100%';
    document.querySelector('#friendly').style.width = '100%';
    document.querySelector('#attack-box').replaceChildren();
    document.querySelector('#friendly').style.background = 'linear-gradient(45deg, #bef0be, #00ff73)';
    document.querySelector('#enemy').style.background = 'linear-gradient(45deg, #bef0be, #00ff73)';
    draggle = new Monster(monsters.Draggle);
    emby = new Monster(monsters.Emby);
    renderedSprites = [draggle, emby];
    queue = []

    emby.attacks.forEach((attack) =>{

     


        
        const button = document.createElement('button');
        button.className = 'attackbtn';
        button.innerHTML = attack.name;
        document.querySelector('#attack-box').append(button);
        
       
    })
    document.querySelectorAll('button').forEach(button =>{
        button.addEventListener('click', (e) =>{
            const selectedAttack = attacks[e.currentTarget.innerHTML]
            if(e.currentTarget.innerHTML == '-') return    
  
            emby.attack({ 
            attack: selectedAttack, 
            recipient: draggle,
            renderedSprites
            
        })
        
        if(draggle.health <= 0)
        {
            queue.push(() => {
               draggle.faint()
            })
            queue.push(() => {
                gsap.to('#cover', {
                    opacity: 1,
                    onComplete: () =>{
                        cancelAnimationFrame(battleAnimationId);
                        animate();
                        document.querySelector('#battle-ui').style.display = 'none'
                        gsap.to('#cover', {
                            opacity: 0
                        })
                        battle.initiated = false;
                        audio.victory.stop();
                        audio.Map.play();
                    }
                })
             })
        }
            
        
        const randomAttack = draggle.attacks[Math.floor(Math.random() *draggle.attacks.length)]
            queue.push(() => {
                draggle.attack({ 
                    attack: randomAttack,
                    recipient: emby,
                    renderedSprites
                })
                
                if(emby.health <= 0)
                {
                queue.push(() => {
                emby.faint()
                queue.push(() => {
                    gsap.to('#cover', {
                        opacity: 1,
                        onComplete: () =>{
                            cancelAnimationFrame(battleAnimationId);
                            animate();
                            document.querySelector('#battle-ui').style.display = 'none'
                            gsap.to('#cover', {
                                opacity: 0
                            })

                            battle.initiated = false;
                            audio.victory.stop();
                            audio.Map.play();
                        }
                    })
                 })
            })
                }
                })
        })
    
        button.addEventListener('mouseenter',  (e) =>{
            const selectedAttack = attacks[e.currentTarget.innerHTML];
            document.querySelector('#type-text').innerHTML = selectedAttack.type;
            document.querySelector('#type-text').style.background = selectedAttack.background;
            document.querySelector('#type-text').style.webkitBackgroundClip  = selectedAttack.backgroundclip;
            document.querySelector('#type-text').style.color  = selectedAttack.color;
        
        })
    })
}
animate();
/* initBattle(); */
/* animateBattle(); */








document.querySelector('#text-container').addEventListener('click', (e) =>{
    if(queue.length > 0)
    {
        queue[0]()
        queue.shift()
    }else {

    e.currentTarget.style.display = 'none';
    }
})