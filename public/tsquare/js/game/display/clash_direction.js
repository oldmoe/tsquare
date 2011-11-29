var ClashDirection = Class.create(Display,{
  direction : {0:'right', 1:'left' , 2:'up', 3:'down'},
  noOfFrames : 3,
  directionCorrect : false,
  initialize : function($super,owner,direction){
    this.img = Loader.images.game_elements[this.direction[direction]+'_arrow.png']
    this.imgWidth = this.img.width
    this.imgHeight = this.img.height/this.noOfFrames
    $super(owner)    
    this.sprites.direction = new DomImgSprite(owner,{img : this.img, noOfFrames : this.noOfFrames},
    {shiftZ:1000})
  },
  correct : function(){
    this.directionCorrect = true
    this.sprites.direction.currentAnimationFrame = 1
  },
  wrong : function(){
    this.sprites.direction.currentAnimationFrame = 2
  }
})
