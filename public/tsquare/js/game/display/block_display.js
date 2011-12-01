var BlockDisplay = Class.create(EnemyDisplay, {
  
  initialize : function($super, owner){
    $super(owner);
    var self = this;
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
  
  destroy : function($super, shallow){
    $super();
    this.owner.handler.objects[this.owner.lane].remove(this.owner)
    if(!shallow){
      for (var i = 0; i < this.owner.elements.length; i++) {
        for (var j = 0; j < this.owner.elements[i].length; j++) {
          this.owner.elements[i][j].destroy();
        }
      }
    }
    this.owner.dead = true;     
  }
      
})
