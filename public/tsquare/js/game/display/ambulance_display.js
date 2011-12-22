var AmbulanceDisplay = Class.create(Display,{
  
  noOfFrames : 7,
  
  initialize : function($super,owner){
    this.img = Loader.images.enemies['ambulance.png']
    this.baloonImg = Loader.images.gameElements['bubble.png']
    this.shadowImg = Loader.images.effects['ambulance_shadow.png'];

    this.imgHeight = this.img.height / this.noOfFrames
    this.imgWidth = this.img.width
    $super(owner)
    // this.showText();
    if(Math.random() <= 0.5)this.showText();
  },
  
  initAudio : function(){
    this.playAudio();
  },

  playAudio : function(repeat){
    var self = this;
    this.owner.scene.audioManager.play(Loader.sounds['sfx']['ambulance.mp3'], {volume : 20, onfinish: function(){
      self.playAudio(true);
    }}, repeat);
  },
  
  destroyAudio: function(){
    this.owner.scene.audioManager.mute(Loader.sounds['sfx']['ambulance.mp3'], true);
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
