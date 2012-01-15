var MovementManager = Class.create({
  
  RIGHT : 0, LEFT : 1,UP : 2, DOWN : 3, SPACE : 4, ENTER: 5,
  move : [],
  movements : [],
  direction : 0,
  ticksPassed : 0,
  totalMoveTicks : 0,
  lastMoveClicked : false,
  beatDelay : 15,
  moves : null,
  beatMoving: false,
  comboStart: false,
  currentCombos: 0,
  counter:0,
  tolerance :250,
  beatTime : 0,  
  beatsPerAudio : 4,
  modes : {"normal" : 0, "clash": 1, "conversation" : 2},
  currentMode : 0,
  currentCommand: "",
  
  initialize : function(scene){
    this.scene = scene
    this.moves = {
      march:{code:[0,0,1,0],index:0},
      retreat:{code:[1,1,0,1],index:1},
      circle:{code:[0,1,0,1],index:2}, 
      hold:{code:[7],index:3},
      hit:{code:[2,3,2,3],index:5},
      push:{code:[2,2,0,0],index:6}
    }
    this.keyText = {}
    this.keyText.en = ['right', 'left', 'up', 'down']
    this.keyText.ar = ['يمين', 'شمال', 'فوق', 'تحت']
  },
  
  run: function(){
    this.time = new Date().getTime()
    this.move = []
    this.sound = this.scene.audioManager.nowPlaying[0]
    var self = this
    this.keydownHandler = function(e){
      if (e.keyCode == 27) {
        self.scene.fire('togglePause');
        return;
      }
//      if (e.keyCode < 37 || e.keyCode > 40){
//        return;
//      }
      if (e.preventDefault)e.preventDefault();
      self.sound = self.scene.audioManager.nowPlaying[0]
      
      if(self.beatMoving){
        self.reset()
        return
      }
      var click = -1
      if (e.keyCode == 39) {
        click = self.RIGHT
      }else if (e.keyCode == 37) {
          click = self.LEFT
      }else if (e.keyCode == 32) {
          click = self.SPACE
      }else if(e.keyCode == 38){
          click = self.UP
      }else if (e.keyCode == 40){
          click = self.DOWN
      }
      
      if (self.currentMode == self.modes.normal){
        if(click == -1){
          //fire wrong key
          self.scene.fire("keypressed", [click, self.move.length])
          self.reset();
          return
        }
        self.scene.fire("keySound", [click])
        self.process(click)
      } else if (self.currentMode == self.modes.clash){
        self.scene.clashDirectionsGenerator.processDirection(click)
      } else if (self.currentMode == self.modes.conversation){
        if(click == self.SPACE){
          self.scene.fire("continueConversation");
        }  
      }

    };
    this.registerListeners()
    
  },
  
  reset : function(){
    this.time = new Date().getTime()
    this.beatMoving = false;
    this.comboStart = false;
    this.currentCombos = 0
    if(this.move.length > 0){
      this.scene.fire('firstWrongMove');
    }
    this.scene.fire('wrongMove');
    this.move = []; 
    this.checkDelay(this.counter, this.beatTime)
  },
  
  registerListeners : function(){
    var self = this
    document.stopObserving('keydown', this.keydownHandler)
    document.observe('keydown', this.keydownHandler)
    /* When play ends : stop observing movement */
    this.scene.observe('end', function(params){
      document.stopObserving('keydown', self.keydownHandler)
    });
    this.scene.observe('clashCrowdsBack',function(){
      self.currentMode = self.modes.clash
    })
     this.scene.observe('clashCrowdsBack',function(){
      self.currentMode = self.modes.clash
    })
    this.scene.observe('rescueMissionStart',function(){
      self.currentMode = self.modes.clash
    })
    this.scene.observe('clashEnd',function(){
      self.currentMode = self.modes.normal
    })
  },
  
  process : function(click){
      var self = this
      if(self.scene.currentSpeed > 0){
        self.comboStart = true
      }
      if(!this.sound)return
      var beatTime  = this.sound.duration/this.beatsPerAudio
      
      var position = this.sound.position % beatTime
      this.beatTime = beatTime
      var found = false
      var now = new Date().getTime()
      var timeDiff = 0
      if(this.move.length == 0){
          if(position > beatTime - this.tolerance){
              timeDiff = beatTime - position
              found = true;
          }else if(position < this.tolerance){
              timeDiff = -position
              found = true
          }else {
            for(var i=1;i<this.beatsPerAudio;i++){
              if(position > beatTime*i - this.tolerance && position < beatTime*i + this.tolerance){
                found = true;
                this.time = now + beatTime*i - position
                timeDiff = beatTime*i - position
                break;
              }
            }
           }
           if(found){//button clicked at the right time 
              this.move.push(click)
              this.counter++
              this.checkDelay(this.counter, beatTime + this.tolerance+ timeDiff)
              this.time = now + timeDiff
            }else{//but not clicked on the right time
              this.scene.fire("keypressed", [click, self.move.length, 1])
            }
      }else{
        if(now > this.time + beatTime - this.tolerance){
          this.move.push(click)
          this.counter++
          var delayDiff = this.time + beatTime - now
          if(this.move.length != 4){
            this.checkDelay(this.counter,beatTime + this.tolerance + delayDiff)
          }
          this.time = this.time + beatTime
        }
        else{
          this.scene.fire("keypressed", [click, this.move.length, 1])
          this.reset()
        }
      }
      if(this.checkMove()){
        this.stopAction(beatTime*4 - this.tolerance + delayDiff)
      }
  },
  
  stopAction : function(delay){
    var self = this
    this.scene.reactor.setTimeout(function(){
      self.beatMoving = false;
      self.moveEnd()
      self.checkDelay(self.counter,self.beatTime + self.tolerance)
    }, delay)
   },
  checkDelay : function(counter,delay){
      var self = this
      this.scene.reactor.setTimeout(function(){self.doCheckDelay(counter)}, delay)
   },
  doCheckDelay : function(counter){
      if (this.counter == counter) {
        if(this.move.length>0)
          this.scene.fire("pressLate")
        this.reset()
      }
  },  
  
  checkMove : function(){
  	var index = 0
    var found = false
    var moveIndex = 0;
    var self = this
    var found  = true
    var command = this.moves[this.currentCommand];

    for (var i = 0; i < self.move.length; i++) {
     if (self.move[i] != command.code[i]) {
       found = false
       break
     }
    }
    
   if(!found){
     self.scene.fire("keypressed", [-1, self.move.length-1])
     self.reset()
     return
   }else{
     this.scene.fire("keypressed", [this.move[this.move.length-1], this.move.length])
   }
   
   if(command.code.length==self.move.length){
     this.move=[]
     this.startMove(command.index)
     return true
   }
  },
  
  startMove : function(commandIndex){
    this.scene.fire("beatMoving");
    this.scene.fire(this.currentCommand);
    this.scene.fire("correctMove")
    this.beatMoving = true;
    if(this.comboStart){
      this.comboStart = false
      this.combos++
      this.currentCombos++
      this.scene.fire('combo', [this.currentCombos])
    }    
  },
  
  //TODO: cache results
  commandText: function(command) {
  	var dict = this.keyText[game.properties.lang];
  	var textCodes = [];
  	this.moves[command].code.each(function(keyCode){textCodes.push(dict[keyCode]);});
  	return textCodes.join(' - ');
  },

  moveEnd : function(){
    this.beatMoving = false
  }
  
});
