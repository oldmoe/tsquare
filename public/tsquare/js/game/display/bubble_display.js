var BubbleDisplay = Class.create(Display,{
  
  initialize : function($super,owner){
    this.baloonImg = null;
    if(owner.oneMessage)
      this.baloonImg = Loader.images.gameElements['bubble.png']
    else  
      this.baloonImg = Loader.images.gameElements['bubble_conv.png']
      
    this.imgWidth = this.baloonImg.width/this.noOfFrames
    this.imgHeight = this.baloonImg.height
    $super(owner)
  },
  
  createSprites : function(){
    this.sprites.baloon = new DomImgSprite(this.owner, {img : this.baloonImg},{shiftY:-100,shiftX:25})
    this.sprites.text = new DomTextSprite(this.owner,'textInfo', {
        centered: true,
        width : 173,
        shiftY: -65,
        shiftX: 51,
        styleClass: '',
        divClass: 'messages'
    });
  }
})
