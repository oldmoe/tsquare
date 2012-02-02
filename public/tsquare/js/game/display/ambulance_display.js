var AmbulanceDisplay = Class.create(Display,{
  
  noOfFrames : 7,
  
  initialize : function($super,owner){
    this.img = Loader.images.enemies['ambulance.png']
    this.baloonImg = Loader.images.gameElements['bubble_inverted.png']
    this.shadowImg = Loader.images.effects['ambulance_shadow.png'];

    this.imgHeight = this.img.height / this.noOfFrames
    this.imgWidth = this.img.width
    $super(owner)
    
    // if(Math.random() <= 0.5 && !this.owner.noenemy)this.showText();
  },
  
  initAudio : function(){
    var reactor = this.owner.scene.reactor
    var self = this
    reactor.pushEvery(reactor.everySeconds(Math.round(Math.random()*5)), reactor.everySeconds(8), function(){
      return self.playAudio()
    })
  },

  playAudio : function(){
    if (this.audioDestroyed) {
      return false
    }
    if(!this.mute) Loader.sounds['sfx']['ambulance.mp3'].play({volume:10})   
    //this.owner.scene.audioManager.play(Loader.sounds['sfx']['ambulance.mp3'], {volume : 10}, true)
  },
  
  destroyAudio: function(){
    this.audioDestroyed = true
  },

  showText: function(){
    this.hideText();
    this.sprites.baloon = new DomImgSprite(this.owner, {img : this.baloonImg},{
      width: this.baloonImg.width,
      height: this.baloonImg.height,
      shiftY:-120,
      shiftX:0
    })
    
    this.sprites.text = new DomTextSprite(this.owner,"textInfo", {
        width: 255,
        height: 70,
        centered: true,
        shiftY: -105,
        shiftX: 5,
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

  createShadows : function(){
    this.sprites.shadow = new DomImgSprite(this.owner, {img : this.shadowImg,noOfFrames : 1}, {
      width: this.shadowImg.width,
      height: this.shadowImg.height,
      shiftX : -(this.shadowImg.width-this.imgWidth),
      shiftY : -10
    })    
  },
    
  createSprites : function(){
    this.sprites.ambulance = new DomImgSprite(this.owner,{img:this.img, noOfFrames:7})
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
  
  render : function($super){
    if (this.owner.doneProtection) {
      this.sprites.ambulance.currentAnimationFrame = (this.sprites.ambulance.currentAnimationFrame + 1) % this.noOfFrames
    }
    $super()
  }, 
  
  destroy : function($super, done){
    if(done){
      return $super()
    }
    this.owner.removed = true      // to remove the display object from render loop
    var self = this
    this.hideText();
    this.sprites.shadow.hide()
    Effects.pulsateFadeUp(this.sprites.ambulance.div, function(){self.destroy(true)})
  }  
})
