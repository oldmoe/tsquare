var FlashingHandler = Class.create({
  
  counter : 0,
  delay: 0,
  lastDelay: 0,
  noOfBeats : 8,
  initialize : function(scene){
    this.scene = scene
        
    // this.delay = 3600/8;
    // this.lastDelay = 3600/8+72;
  
    // this.grayList = ['#000000', '#222222', '#444444', '#666666', '#888888', '#aaaaaa', '#cccccc', '#eeeeee', '#ffffff'];
    
    this.grayList = ['#000000', '#222222', '#888888', '#cccccc', '#ffffff'];
      
    this.delay = this.scene.reactor.timeToTicks(3600/8);
    this.lastDelay = this.scene.reactor.timeToTicks(3600/8+72);
    
    this.fadeIndex = 0;
    
    this.div = $('beatFlash')
  },
  
  run: function(){
    this.sound = this.scene.audioManager.nowPlaying[0]
    this.flash();
  },
  
  flash : function(){
    if(this.counter*this.sound.duration/this.noOfBeats > this.sound.position){
      this.counter = (this.counter+1) % this.noOfBeats
      this.fadeIn()
      this.fadeOut()
    }    
    var self = this
    this.scene.reactor.push(1,function(){self.flash()})  
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
    this.scene.reactor.push(0, this.fadeOut, this);
  }
  
})
