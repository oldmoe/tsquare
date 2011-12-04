var BombSmokeDisplay = Class.create(Display,{
  noOfFrames : 5,
  animationFreq : 5,
  counter : 0,
  initialize : function($super, owner){
    this.img = Loader.images.gameElements['smoke'+ owner.id +'.png']
    this.imgWidth = this.img.width
    this.imgHeight = this.img.height / this.noOfFrames
    $super(owner)
  },
  
  createSprites : function(){
    this.sprites.smoke = new DomImgSprite(this.owner, {
      img: this.img,
      noOfFrames: this.noOfFrames
    }, {
      width: this.owner.scale * this.imgWidth,
      height: this.owner.scale * this.imgWidth,
      imgScale: this.owner.scale,
      zIndex : this.owner.coords.y - 50,
    })
  },
  
  render : function($super){
    $super()
    if(this.owner.finished){
      this.owner.removed = true
      this.destroy()
    }
//    this.sprites.smoke.setOpacity(this.owner.opacity)
    this.counter++;
    if(this.counter % this.animationFreq == 0){
      this.sprites.smoke.div.setStyle({'width':this.owner.scale * this.imgWidth + "px"})
      this.sprites.smoke.div.setStyle({'height':this.owner.scale * this.imgHeight +"px"})
      this.sprites.smoke.currentAnimationFrame = Math.min(this.noOfFrames, this.sprites.smoke.currentAnimationFrame+1)
    }
    this.sprites.smoke.setImgWidth(this.owner.scale * this.imgWidth)
  }
  
})
