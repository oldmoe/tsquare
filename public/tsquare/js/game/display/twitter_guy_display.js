var TwitterGuyDisplay = Class.create(Display,{
  noOfFrames : 7,
  initialize : function($super,owner){
    this.img = Loader.images.enemies['twitter_guy.png']
    this.imgHeight = this.img.height / this.noOfFrames
    this.imgWidth = this.img.width
    $super(owner)
  },
  createSprites : function(){
    this.sprites.twitterguy = new DomImgSprite(this.owner,{img:this.img, noOfFrames:this.noOfFrames}, {shiftY:10})
  },
  render : function($super){
      this.sprites.twitterguy.currentAnimationFrame = (this.sprites.twitterguy.currentAnimationFrame + 1) % this.noOfFrames
      $super()
  }
})
