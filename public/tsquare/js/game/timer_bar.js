var TimerBar = Class.create({
  
  scene: null,
  seconds: 0,
  stop: false,
  templateManager: null,
  
  initialize: function(scene, templateManager){
    this.scene = scene;
    this.templateManager = templateManager;
    var self = this;
    this.scene.observe("start", function(){self.start()});
  },
  
  tick: function(){
    this.seconds += 1;
    var time = this.getTimeDetails();
    var timerBarHTML =  this.templateManager.load('inGameTimerBar', {hours:time[0]<10?"0"+time[0]:time[0], minutes:time[1]<10?"0"+time[1]:time[1], seconds:time[2]<10?"0"+time[2]:time[2]});
    $('timerBar').replace(timerBarHTML);
    var self = this;
    if(!this.stop)this.scene.reactor.push(this.scene.reactor.everySeconds(1), function(){self.tick()});
  },
  
  start: function(){
    this.stop = false;
    this.tick();
  },
  
  stop: function(){
    this.stop = true;
  },
  
  reset: function(){
    this.seconds = 0;
  },
  
  getTimeDetails: function(){
    var r = [0, 0, 0];
    r[0] = parseInt(this.seconds/(60*60));//hours
    r[1] = parseInt(this.seconds/(60));//minutes
    r[2] = this.seconds%(60);//seconds
    return r;
  }
  
  
});