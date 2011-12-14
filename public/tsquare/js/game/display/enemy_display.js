var EnemyDisplay = Class.create(Display,{

  initialize : function($super,owner){
      $super(owner) 
  },
    
  showText: function(text){
    if(text) this.text = text;
    this.baloonImg = Loader.images.gameElements['bubble.png']
    this.sprites.baloon = new DomImgSprite(this.owner, {img : this.baloonImg},{
      width: this.baloonImg.width,
      height: this.baloonImg.height,
      shiftY:-120,
      shiftX:0
    })
    
    this.sprites.text = new DomTextSprite(this.owner,"textInfo", {
        width: 100,
        height: 100,
        centered: true,
        shiftY: -83,
        shiftX: 25,
        styleClass: 'bubbleText'
    });
  },

  hideText: function(){
    if(this.sprites.baloon){
      this.sprites.baloon.destroy();
      this.sprites.text.destroy();
    }  
  },
    
    
});