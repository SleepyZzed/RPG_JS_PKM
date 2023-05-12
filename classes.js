class Sprite{
    constructor({position,velocity, image, frames = {max: 1, hold: 40}, sprites, animate = false}){
        this.position = position
        this.image = image
        this.frames = {...frames, val: 0, elapsed: 0}
        this.image.onload = () =>{
            this.width = this.image.width / this.frames.max
            this.height = this.image.height 
        }
        this.animate = animate;
        this.sprites = sprites;
        this.opacity = 1;
    }

    draw(){
        ctx.save();
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
    attack({attack, recipient}){
        const tl = gsap.timeline()
     
        tl.to(this.position, {
            x: this.position.x - 40
        }).to(this.position, {
            x: this.position.x + 160,
            duration: 0.087,
            onComplete() {
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
        ctx.fillStyle= 'rgba(255,0,0,.5)';
        ctx.fillRect(this.position.x, this.position.y, this.width, this.height);
    }
}