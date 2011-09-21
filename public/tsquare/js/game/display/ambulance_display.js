var AmbulanceDisplay = Class.create(Display,{
  initialize : function($super,owner){
    this.img = Loader.images.enemies['ambulance.png']
    $super(owner)
  },
  createSprites : function(){
    this.sprites.ambulance = new DomeImgSprite(owner,{img:this.img, noOfFrames:7})
  }
})
