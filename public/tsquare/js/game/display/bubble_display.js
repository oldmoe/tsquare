var BubbleDisplay = Class.create(Display,{
  
  initialize : function($super,owner){
    this.baloonImg = null;
    this.baloonImg = Loader.images.gameElements['bubble.png']
    this.imgWidth = this.baloonImg.width/this.noOfFrames
    this.imgHeight = this.baloonImg.height
    $super(owner)
  },
  
  createSprites : function(){
    this.sprites.baloon = new DomImgSprite(this.owner, {img : this.baloonImg},{shiftY:-130,shiftX:25})
    this.sprites.text = new DomTextSprite(this.owner,'textInfo', {
        centered: true,
        width : 255,
        shiftY: -125,
        shiftX: 28,
        styleClass: '',
        divClass: 'message'
    });
  }
  
})
