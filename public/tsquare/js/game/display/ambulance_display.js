var AmbulanceDisplay = Class.create(Display,{
  noOfFrames : 7,
  initialize : function($super,owner){
    this.img = Loader.images.enemies['ambulance.png']
    this.imgHeight = this.img.height / this.noOfFrames
    this.imgWidth = this.img.width
    $super(owner)
  },
  createSprites : function(){
    this.sprites.ambulance = new DomImgSprite(this.owner,{img:this.img, noOfFrames:7})
  },
  render : function($super){
    if (this.owner.doneProtection) {
      this.sprites.ambulance.currentAnimationFrame = (this.sprites.ambulance.currentAnimationFrame + 1) % this.noOfFrames
    }
    $super()
  }
})
