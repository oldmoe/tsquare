var TwitterGuyDisplay = Class.create(Display,{
  noOfFrames : 7,
  initialize : function($super,owner){
    this.img = Loader.images.enemies['twitter_guy.png']
    this.baloonImg = Loader.images.gameElements['bubble_inverted.png']
    
    this.imgHeight = this.img.height / this.noOfFrames
    this.imgWidth = this.img.width
    $super(owner)
  },

  createShadows: function(){
    this.shadowImg = Loader.images.effects['twitter_shadow.png'];
    this.sprites.shadow = new DomImgSprite(this.owner, {img : this.shadowImg,noOfFrames : 1}, {
      width: this.shadowImg.width,
      height: this.shadowImg.height,
      shiftX : -(this.shadowImg.width-this.imgWidth)-10,
      shiftY : -10
    })    
  },
  
  createSprites : function(){
    this.sprites.twitterguy = new DomImgSprite(this.owner,{img:this.img, noOfFrames:this.noOfFrames}, {shiftY:10})
    this.sprites.health = new ImgMeterSprite(this.owner,
    {empty:Loader.images.gameElements['health_meter_empty.png'] ,full:Loader.images.gameElements['health_meter.png']},
     {
      meterFunc: function(){
        return this.owner.hpRatio()
      },
      orientation : 'vertical',
      shiftX : 25,
      shiftY: -10
    });
  },

  showText: function(){
    this.hideText();
    this.sprites.baloon = new DomImgSprite(this.owner, {img : this.baloonImg},{
      width: this.baloonImg.width,
      height: this.baloonImg.height,
      shiftY:-120,
      shiftX:-108
    })
    
    this.sprites.text = new DomTextSprite(this.owner,"textInfo", {
        width: 255,
        height: 70,
        centered: true,
        shiftY: -103,
        shiftX: -100,
        styleClass: '',
        divClass: 'message'
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
  },
  
  destroy : function($super, done){
    if(done){
      return $super()
    }
    this.owner.removed = true      // to remove the display object from render loop
    this.hideText();
    var self = this
    this.sprites.shadow.hide()
    Effects.pulsateFadeUp(this.sprites.twitterguy.div, function(){self.destroy(true)})
  }
})
