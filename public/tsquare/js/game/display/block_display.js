var BlockDisplay = Class.create(EnemyDisplay, {
  
  initialize : function($super, owner){

    this.imgWidth = 0;
    this.imgHeight = 0;
    
    $super(owner);
    var self = this;
    
    if(!owner.noMessage){
      if(Math.random() <= 0.5)this.showText();
    }
    
  },
  
  getWidth : function(){
    if(!this.owner.elements[0] || !this.owner.elements[0][0])return 0
    return this.owner.elementWidth * this.owner.elements.length + (this.owner.elements[0][0].imgWidth - this.owner.elementWidth)  
  },
  
  getHeight : function(){
    if(!this.owner.elements[0]  || !this.owner.elements[0][0])return 0
    return this.owner.elementHeight * this.owner.elements.length + (this.owner.elements[0][0].imgHeight - this.owner.elementHeight)
  },
  
  initAudio : function(){
    var reactor = this.owner.scene.reactor
    var self = this
    reactor.pushEvery(reactor.everySeconds(Math.round(Math.random()*5)), reactor.everySeconds(8), function(){
      return self.playAudio();
    })
  },

  playAudio : function(repeat){
    if (this.audioDestroyed) {
      return false;
    }
    var volume = (this.owner.options.columns * this.owner.options.rows) / 27 * 80;
    Loader.sounds['sfx']['Police-march.mp3'].play({volume: volume});
  },
  
  destroyAudio: function(){
     this.audioDestroyed = true;
  },
  
  showText: function(){
    this.baloonImg = Loader.images.gameElements['bubble_inverted.png']
    this.sprites.baloon = new DomImgSprite(this.owner, {img : this.baloonImg},{
      width: this.baloonImg.width,
      height: this.baloonImg.height,
      shiftY:-180,
      shiftX:-100
    })
    
    this.sprites.text = new DomTextSprite(this.owner,"textInfo", {
        width: 255,
        height: 70,
        centered: true,
        shiftY: -175,
        shiftX: -90,
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
    $super()
  },
  
  destroy : function($super, shallow){
    $super();
    if(!shallow){
      for (var i = 0; i < this.owner.elements.length; i++) {
        for (var j = 0; j < this.owner.elements[i].length; j++) {
          this.owner.elements[i][j].destroy();
        }
      }
    }
  }
      
})
