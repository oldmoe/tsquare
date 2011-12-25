var TwitterGuyDisplay = Class.create(Display,{
  noOfFrames : 7,
  initialize : function($super,owner){
    this.img = Loader.images.enemies['twitter_guy.png']
    this.baloonImg = Loader.images.gameElements['bubble.png']
    
    this.imgHeight = this.img.height / this.noOfFrames
    this.imgWidth = this.img.width
    $super(owner)
    
    // this.showText();
    if(Math.random() <= 0.5)this.showText();
  },

  createShadow: function(){
    this.shadowImg = Loader.images.effects['twitter_shadow.png'];
    this.sprites.shadow = new DomImgSprite(this.owner, {img : this.shadowImg,noOfFrames : 1}, {
      width: this.shadowImg.width,
      height: this.shadowImg.height,
      shiftX : -(this.shadowImg.width-this.img.width)-10,
      shiftY : -10
    })    
  },
  
  createSprites : function(){
    this.createShadow();
    this.sprites.twitterguy = new DomImgSprite(this.owner,{img:this.img, noOfFrames:this.noOfFrames}, {shiftY:10})
  },

  showText: function(){
    
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
  
  render : function($super){
      this.sprites.twitterguy.currentAnimationFrame = (this.sprites.twitterguy.currentAnimationFrame + 1) % this.noOfFrames
      $super()
  }
})
