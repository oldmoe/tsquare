var MovementManager = Class.create({
  
  RIGHT : 0, LEFT : 1,
  move : [],
  movements : [],
  direction : 0,
  ticksPassed : 0,
  totalMoveTicks : 0,
  beatAccelaration : 0,
  lastMoveClicked : false,
  beatDelay : 15,
  moves : {march:{code:[0,0,0,0],index:0},retreat:{code:[1,1,1,1],index:1},circle:{code:[0,1,0,1],index:2}, hold:{code:[2],index:3}},  
  beatMoving: false,
  comboStart: false,
  currentCombos: 0,
  counter:0,
  tolerance :250,
  beatTime : 0,  
  beatsPerAudio : 1,
  initialize : function(scene){
    this.scene = scene
    this.registerListeners()
    this.time = new Date().getTime()
    this.move = []
    this.sound = this.scene.audioManager.nowPlaying[0]
  },


  reset : function(){
    this.move = []; 
    this.time = new Date().getTime()
    this.beatMoving = false;
    this.comboStart = false;
    this.currentCombos = 0
    this.beatAccelaration = 0
    this.checkDelay(this.counter, this.beatTime)
    this.scene.fire('wrongMove');
  },
    
  registerListeners  : function(){
    var self = this
    document.stopObserving('keydown')
    document.observe('keydown', function(e){
      if (e.preventDefault) {
            e.preventDefault();
      }
      self.sound = self.scene.audioManager.nowPlaying[0]
      if(self.beatMoving){
        self.reset()
        return
      }
      var click = -1
      if (e.keyCode == 39) {
        click = 0
      }else if (e.keyCode == 37) {
          click = 1
      }else if (e.keyCode == 32) {
          click = 2
      }else{
        self.scene.fire("keypressed", [click, self.move.length])
        self.reset();
        return
      }
      self.process(click)
		})
    /* When play ends : stop observing movement */
    this.scene.observe('end', function(params){
      document.stopObserving('keydown')
    });
  },
  
  process : function(click){
      var self = this
      if(self.scene.currentSpeed > 0){
        self.comboStart = true
      }
      if(!this.sound)return
      var position = this.sound.position
      var beatTime  = this.sound.duration/this.beatsPerAudio
      this.beatTime = beatTime
      var found = false
      var now = new Date().getTime()
      var timeDiff = 0
      if(this.move.length == 0){
          if(position > this.sound.duration - this.tolerance){
              timeDiff = this.sound.duration - position
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
           if(found){ 
              this.move.push(click)
              this.scene.fire("keypressed", [click, this.move.length])
              this.counter++
              this.checkDelay(this.counter,beatTime + this.tolerance+ timeDiff)
              this.time = now + timeDiff
            }else{
              this.scene.fire("keypressed", [click, self.move.length,1])
            }
      }else{
        if(now > this.time + beatTime - this.tolerance){
          this.move.push(click)
          this.scene.fire("keypressed", [click, this.move.length])
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
      setTimeout(function(){
        self.beatMoving = false;
        self.moveEnd()
        self.checkDelay(self.counter,self.beatTime + self.tolerance)
      }, delay)
   },
  checkDelay : function(counter,delay){
      var self = this
      setTimeout(function(){self.doCheckDelay(counter)}, delay)
   },
  doCheckDelay : function(counter){
      if (this.counter == counter) {
        if(this.move.length>0)this.scene.fire("pressLate")
        this.reset()
        var self = this
      }
  },  
  getNextMoveIndex : function(){
    return 0
  },
  
  checkMove : function(){
  	var index = 0
    var found = false
    var moveIndex = this.getNextMoveIndex()
    var self = this
    var found  = false
    var command = null
    for(var move in this.moves){
      var found = true
      var code = this.moves[move].code
      command = move
      for (var i = 0; i < self.move.length; i++) {
       if (self.move[i] != code[i]) {
         found = false
         break
       }
     }
     if(found){
       break
     }
   }
   if(!found){
     if(this.move[this.move.length-1] == this.RIGHT){
        this.scene.fire('rightWrong')
     }else{
       this.scene.fire('leftWrong')
     }   
     self.scene.fire("keypressed", [-1, self.move.length-1])
     self.reset()
     return
   }
   var code = this.moves[command].code
   if(this.move[this.move.length-1] == this.RIGHT){
      this.scene.fire('rightCorrect')
   }else{
     this.scene.fire('leftCorrect')
   }   
   if(code.length==self.move.length){
     this.move=[]
     this.startMove(this.moves[command].index)
     return true
   }
  },
  
  startMove : function(commandIndex){
    this.scene.audioManager.playHetaf()
    var collision = this.scene.detectCollisions()
    this.scene.fire("beatMoving");
    if(commandIndex == this.moves.march.index){
        if(this.scene.currentSpeed == 0)this.scene.increaseEnergy()
        this.scene.fire('march')
        this.beatMoving = true    
    }else if(commandIndex == this.moves.retreat.index){
        if(this.scene.currentSpeed == 0)this.scene.increaseEnergy()
        this.scene.fire('retreat')
        this.beatMoving = true    
    }else if(commandIndex == this.moves.circle.index){
        this.scene.fire('circle')
        this.beatMoving = true
    }else if(commandIndex == this.moves.hold.index){
        this.scene.fire('hold')
        this.beatMoving = true
    }
  },

  moveEnd : function(){
      if(this.comboStart){
        this.comboStart= false
        this.combos++
        this.currentCombos++
        this.scene.fire('correctMove')
      }
      this.beatMoving = false
  }
  
});
