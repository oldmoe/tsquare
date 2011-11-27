var TearGasBombDisplay = Class.create(Display,{
  initialize : function($super,owner){
    this.img = Loader.images.enemies['tear_gas_bomb.png']
    this.imgWidth = this.img.width
    this.imgHeight = this.img.height
    $super(owner)
  },
  createSprites : function(){
    this.sprites.bomb = new DomImgSprite(this.owner, {img : this.img, noOfFrames :1})
  },
  render : function($super){
    $super()
  }
  
})
