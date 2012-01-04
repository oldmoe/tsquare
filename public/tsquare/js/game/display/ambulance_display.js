var AmbulanceDisplay = Class.create(Display,{
  
  noOfFrames : 7,
  
  initialize : function($super,owner){
    this.img = Loader.images.enemies['ambulance.png']
    this.baloonImg = Loader.images.gameElements['bubble.png']
    this.shadowImg = Loader.images.effects['ambulance_shadow.png'];

    this.imgHeight = this.img.height / this.noOfFrames
    this.imgWidth = this.img.width
    $super(owner)
    if(Math.random() <= 0.5)this.showText();
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
    Loader.sounds['sfx']['ambulance.mp3'].play({volume:10})   
    //this.owner.scene.audioManager.play(Loader.sounds['sfx']['ambulance.mp3'], {volume : 10}, true)
  },
  
  destroyAudio: function(){
    this.audioDestroyed = true
  },

  showText: function(){
    
    this.sprites.baloon = new DomImgSprite(this.owner, {img : this.baloonImg},{
      width: this.baloonImg.width,
      height: this.baloonImg.height,
      shiftY:-120,
      shiftX:0
    })
    
    this.sprites.text = new DomTextSprite(this.owner,"textInfo", {
        width: 173,
        height: 100,
        centered: true,
        shiftY: -83,
        shiftX: 25,
        styleClass: '',
        divClass: 'messages'
    });
  },

  hideText: function(){
    if(this.sprites.baloon){
      this.sprites.baloon.destroy();
      this.sprites.text.destroy();
    }  
  },
  
  createSprites : function(){
    this.sprites.shadow = new DomImgSprite(this.owner, {img : this.shadowImg,noOfFrames : 1}, {
      width: this.shadowImg.width,
      height: this.shadowImg.height,
      shiftX : -(this.shadowImg.width-this.img.width),
      shiftY : -10
    })    
    this.sprites.ambulance = new DomImgSprite(this.owner,{img:this.img, noOfFrames:7})

  },
  
  render : function($super){
    if (this.owner.doneProtection) {
      this.sprites.ambulance.currentAnimationFrame = (this.sprites.ambulance.currentAnimationFrame + 1) % this.noOfFrames
    }
    $super()
  }  
})
