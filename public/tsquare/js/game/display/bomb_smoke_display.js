var BombSmokeDisplay = Class.create(Display,{
  initialize : function($super, owner){
    this.img = Loader.images.gameElements['smoke'+ owner.id +'.png']
    this.imgWidth = this.img.width
    this.imgHeight = this.img.height
    $super(owner)
  },
  
  createSprites : function(){
    this.sprites.smoke = new DomImgSprite(this.owner, {
      img: this.img,
      noOfFrames: 1
    }, {
      width: this.owner.maxScale * this.imgWidth,
      height: this.owner.maxScale * this.imgWidth,
      imgScale: this.owner.scale,
      zIndex : this.owner.coords.y - 20,
    })
  },
  
  render : function($super){
      $super()
      if(this.owner.finished){
        this.owner.removed = true
        this.destroy()
      }
      this.sprites.smoke.setOpacity(this.owner.opacity)
      this.sprites.smoke.setImgWidth(this.owner.scale * this.imgWidth)
  }
  
})
