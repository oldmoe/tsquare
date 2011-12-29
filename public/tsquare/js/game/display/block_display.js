var BlockDisplay = Class.create(EnemyDisplay, {
  
  initialize : function($super, owner){

    this.imgWidth = 0;
    this.imgHeight = 0;
    
    
    $super(owner);
    var self = this;
    
    if(Math.random() <= 0.5)this.showText();
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
    this.playAudio();
  },

  playAudio : function(repeat){
    var self = this;
    var volume = (this.owner.options.columns * this.owner.options.rows) / 27 * 150;
    this.owner.scene.audioManager.play(Loader.sounds['sfx']['Police-march.mp3'], {volume : volume, onfinish: function(){
      self.playAudio(true);
    }}, repeat);
  },
  
  destroyAudio: function(){
    this.owner.scene.audioManager.mute(Loader.sounds['sfx']['Police-march.mp3'], false);
  },
  
  showText: function(){
    this.baloonImg = Loader.images.gameElements['bubble.png']
    this.sprites.baloon = new DomImgSprite(this.owner, {img : this.baloonImg},{
      width: this.baloonImg.width,
      height: this.baloonImg.height,
      shiftY:-180,
      shiftX:0
    })
    
    this.sprites.text = new DomTextSprite(this.owner,"textInfo", {
        width: 150,
        height: 100,
        centered: true,
        shiftY: -150,
        shiftX: 10,
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
