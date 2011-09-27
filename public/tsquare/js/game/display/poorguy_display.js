var PoorguyDisplay = Class.create(Display,{
  noOfFrames : 7,
  initialize : function($super,owner){
    this.img = Loader.images.characters['normal_idle.png']
    this.imgHeight = this.img.height / this.noOfFrames
    this.imgWidth = this.img.width
    $super(owner)
  },
  createSprites : function(){
    this.sprites.poorguy = new DomImgSprite(this.owner,{img:this.img, noOfFrames:this.noOfFrames})
  },
  render : function($super){
    this.sprites.poorguy.currentAnimationFrame = (this.sprites.poorguy.currentAnimationFrame + 1) % this.noOfFrames
    $super()
  }
})
