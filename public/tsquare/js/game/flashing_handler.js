var FlashingHandler = Class.create({
  
  counter : 0,
  noOfBeats : 8,
  colors : {'black': 0, 'green': 1, 'red': 2},
  borderColor: 0,
  colorChanged : false,
  initialize : function(scene){
    this.scene = scene
    this.fadeIndex = 0;
    this.div = $('beatFlash');
    var self = this;
    this.scene.observe('correctArrow', function(){
      self.borderColor = self.colors.green;
      self.colorChanged = true;
    })
    this.scene.observe('wrongArrow', function(){
      self.borderColor = self.colors.red;
      self.colorChanged = true;
    })
  },
  
  run: function(){
    this.scene.observe('beatStart', function(){
      
    })
    this.sound = this.scene.audioManager.nowPlaying[0]
    this.flash();
    this.running = true
  },
  
  flash : function(){
    var self = this
    var beatDuration = this.sound.duration / 4
    var soundFraction = ((this.sound.position % beatDuration)/beatDuration)
    var color = Math.round(soundFraction * 255)
    if (color != this.borderColor) {
       switch(this.borderColor){
        case this.colors.black:
          this.div.style.borderColor = "rgb(" + color + "," + color + "," + color + ")"
          break;
        case this.colors.green:
          this.div.style.borderColor = "rgb(" + color + "," + Math.min(color+128, 255) + "," + color + ")"
          if(color > 252 || (color < this.currentColor && !this.colorChanged)) this.borderColor = this.colors.black;
          break;
        case this.colors.red:
          this.div.style.borderColor = "rgb(" + Math.min(color+128, 255) + "," + color + "," + color + ")"
          if(color > 252 || (color < this.currentColor && !this.colorChanged) ) this.borderColor = this.colors.black;
          break;
        default:
          break; 
       }
      this.currentColor = color;
      this.colorChanged = false; 
    }
  }  
})
