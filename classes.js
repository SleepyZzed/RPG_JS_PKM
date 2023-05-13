class Sprite{
    constructor({position,velocity, image, frames = {max: 1, hold: 10}, sprites, animate = false, rotation = 0}){
        this.position = position;
        this.image = new Image();
        this.frames = {...frames, val: 0, elapsed: 0};
        this.image.onload = () =>{
            this.width = this.image.width / this.frames.max
            this.height = this.image.height 
        };
        this.image.src = image.src;

        this.animate = animate;
        this.sprites = sprites;
        this.opacity = 1;
        this.rotation = rotation;

    }

    draw(){
        ctx.save();
        ctx.translate(this.position.x + this.width /  2 , this.position.y + this.height / 2);
        ctx.rotate(this.rotation);
        ctx.translate(-this.position.x - this.width /  2 , -this.position.y - this.height / 2);
        ctx.globalAlpha = this.opacity;
        ctx.drawImage(
            this.image,
            this.frames.val * this.width,
            0,
            this.image.width / this.frames.max,
            this.image.height,
            this.position.x,
            this.position.y,
            this.image.width / this.frames.max,
            this.image.height
    
         )
         ctx.restore();
         if(!this.animate)
         {  this.frames.val = 0;
            return
         } 
         if(this.frames.max > 1)
         {
            this.frames.elapsed++
         }
         if(this.frames.elapsed % this.frames.hold === 0){
            if(this.frames.val < this.frames.max - 1) this.frames.val ++
            else this.frames.val = 0
         }
         
         
    }

}


class Monster extends Sprite{
    constructor({
        position,
        velocity,
        image,
        frames = {max: 1, hold: 10},
        sprites, 
        animate = false, 
        rotation = 0,
        isEnemy = false, 
        name,
        attacks,
        cry
        
    })
    {
        super({
            position,
            velocity,
            image,
            frames,
            sprites, 
            animate, 
            rotation,
        })
        this.isEnemy = isEnemy;
        this.name = name;
        this.health = 100;
        this.attacks = attacks;
        this.cry = cry;
        
    }

    faint(){
        document.querySelector('#text-container').innerHTML = this.name + ' Fainted! ';
        gsap.to(this.position, {
            y: this.position.y + 20
        })
        gsap.to(this, {
            opacity: 0
        })
        audio.battle.stop();
        this.cry.play();
        audio.victory.play();
    }

    attack({attack, recipient, renderedSprites}){
        document.querySelector('#text-container').style.display = 'block';

        document.querySelector('#text-container').innerHTML = this.name + ' used ' + attack.name;
      
        let healthBar = '#enemy';
        if(this.isEnemy) healthBar = '#friendly';
        
        let rotation =1;
        if(this.isEnemy) rotation = -2.2;

        recipient.health -= attack.damage;
   
        switch(attack.name){

            case 'Ember':
                audio.initFiireBall.play();
                const emberIamge = new Image();
                emberIamge.src='./assets/tiles/fireball.png';
                const ember = new Sprite({
                    position:{
                        x: this.position.x,
                        y: this.position.y
                    },
                    image: emberIamge,
                    frames: {
                        max: 4,
                        hold: 10
                    },
                    animate: true,
                   rotation
                })

                
                renderedSprites.splice(1, 0, ember);
                gsap.to(ember.position, {
                    x: recipient.position.x,
                    y: recipient.position.y,
                    onComplete:() =>{
                        audio.fireBallHit.play();
                        gsap.to(healthBar, {
                            width: recipient.health + '%',
                            onComplete: () =>{
                                if (recipient.health <= 40) {
                                    gsap.to(healthBar,{
                                        background: 'linear-gradient(to right, #FF4500, #FF8C00)',
                                        duration: 0.09
                                    })
                                  }
                                if (recipient.health <= 70 && recipient.health >= 50) {
                                gsap.to(healthBar,{
                                    background: 'linear-gradient(to right, #ffb600, #FF8C00)',
                                    duration: 0.09
                                })
                                }
                            }
                        })
        
                        gsap.to(recipient.position, {
                           x: recipient.position.x + 15,
                           yoyo: true,
                           repeat: 5,
                           duration: 0.06
                        })
        
                        gsap.to(recipient, {
                            opacity: 0,
                            repeat: 5,
                            yoyo: true,
                            duration: 0.06
        
                        })
                        renderedSprites.splice(1,1,);
                    }
                })

                break;
            case 'Tackle':
                const tl = gsap.timeline();
                
                
                let movementDistance = 40;
                if(this.isEnemy) movementDistance = -40
        
                tl.to(this.position, {
                    x: this.position.x - movementDistance
                }).to(this.position, {
                    x: this.position.x + movementDistance * 4,
                    duration: 0.087,
                    onComplete: () => {
                        audio.tackleHit.play();
                        gsap.to(healthBar, {
                            width: recipient.health + '%',
                            onComplete: () =>{
                                if (recipient.health <= 40) {
                                    gsap.to(healthBar,{
                                        background: 'linear-gradient(to right, #FF4500, #FF8C00)',
                                        duration: 0.09
                                    })
                                  }
                                if (recipient.health <= 70 && recipient.health >= 50) {
                                gsap.to(healthBar,{
                                    background: 'linear-gradient(to right, #ffb600, #FF8C00)',
                                    duration: 0.09
                                })
                                }
                            }
                        })
        
                        gsap.to(recipient.position, {
                           x: recipient.position.x + 15,
                           yoyo: true,
                           repeat: 5,
                           duration: 0.06
                        })
        
                        gsap.to(recipient, {
                            opacity: 0,
                            repeat: 5,
                            yoyo: true,
                            duration: 0.06
        
                        })
                    }
                }).to(this.position, {
                    x: this.position.x
                })
                break;
        }

    }

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