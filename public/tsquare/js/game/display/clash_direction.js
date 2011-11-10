var ClashDirection = Class.create(Display,{
  imgWidth:42,
  imgHeight:41,
  direction : {0:'right', 1:'left'},
  initialize : function($super,owner,direction){
    $super(owner)
    this.img = Loader.images.game_elements[this.direction[direction]+'_arrow.png']
    this.sprites.direction = new DomImgSprite(owner,{img : this.img, noOfFrames : 1})
  }
})
