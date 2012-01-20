var FlashingHandler = Class.create({
  
  counter : 0,
  delay: 0,
  lastDelay: 0,
  noOfBeats : 8,
  initialize : function(scene){
    this.scene = scene
        
    // this.delay = 3600/8;
    // this.lastDelay = 3600/8+72;
  
    //this.grayList = ['#000000', '#222222', '#444444', '#666666', '#888888', '#aaaaaa', '#cccccc', '#eeeeee', '#ffffff'];
    this.grayList = ['#000000', '#111111', '#444444', '#cccccc', '#eeeeee', '#ffffff'];
    
    //this.grayList = ['#000000', '#222222', '#888888', '#cccccc', '#ffffff'];
    //this.grayList = ['20px', '30px', '40px', '50px', '60px', '70px'];  
    this.delay = this.scene.reactor.timeToTicks(3600/8);
    this.lastDelay = this.scene.reactor.timeToTicks(3600/8+72);
    
    this.fadeIndex = 0;
    
    this.div = $('beatFlash');
     
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
    //var color = this.grayList[Math.round(soundFraction * this.grayList.length)]
    var color = Math.round(soundFraction * 255)
    //console.log(color)
    //document.body.style.backgroundColor = color
    if (color != this.color) {
      this.div.style.borderColor = "rgb(" + color + "," + color + "," + color + ")"
      this.color = color
    }
//    this.scene.reactor.push(0,function(){self.flash()})  
  },
  
  flash2 : function(){

    this.fadeIn();
    this.fadeOut();

    var self = this
    
    if (this.counter == 8) {
      this.counter = 0
      
      this.scene.reactor.push(this.lastDelay, this.flash, this)
      // setTimeout(function(){self.flash()}, this.lastDelay);
    }else{
      this.counter++
      this.scene.reactor.push(this.delay, this.flash, this)
      // setTimeout(function(){self.flash()}, this.lastDelay);
    }
  },
  
  fadeIn: function(){
    this.div.style.borderColor =  "#000";
  },
  
  fadeOut: function(){

    if(this.fadeIndex == 5){
      this.fadeIndex = 0;
      return;
    }
    
    this.div.style.borderColor = this.grayList[this.fadeIndex];
    this.fadeIndex++;
    
    var self = this;
    //window.setTimeout(function(){self.fadeOut()}, 15);
    this.scene.reactor.push(0, this.fadeOut, this);
  }
  
})
