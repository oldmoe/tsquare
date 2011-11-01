var AmbulanceDisplay = Class.create(Display,{
  
  noOfFrames : 7,
  
  initialize : function($super,owner){
    this.img = Loader.images.enemies['ambulance.png']
    this.shadowImg = Loader.images.effects['ambulance_shadow.png'];

    this.imgHeight = this.img.height / this.noOfFrames
    this.imgWidth = this.img.width
    $super(owner)
  },
  
  createSprites : function(){
    this.sprites.shadow = new DomImgSprite(this.owner, {img : this.shadowImg,noOfFrames : 1}, {
      width: this.shadowImg.width,
      height: this.shadowImg.height,
      shiftX : -(this.shadowImg.width-this.img.width),
      shiftY : -10
    })    
    this.sprites.ambulance = new DomImgSprite(this.owner,{img:this.img, noOfFrames:7})

  },
  
  render : function($super){
    if (this.owner.doneProtection) {
      this.sprites.ambulance.currentAnimationFrame = (this.sprites.ambulance.currentAnimationFrame + 1) % this.noOfFrames
    }
    $super()
  }
})
