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
    
  initialize : function(scene){
    this.scene = scene
    this.registerListeners()
    this.playSounds()
    this.scene.push(this)
  },

  playSounds : function(){
   if(this.ticksPassed > this.nextTick+5){
      // console.log("et2a5rt keteer ya 7biby");
      this.reset()
      // this.scene.fire("pressDelay")
   } 
   this.nextTick = this.scene.audioManager.nextBeatTicks()
   //Sounds.play(Sounds.gameSounds.beat)
   var self = this
   this.scene.reactor.push(this.nextTick,function(){self.playSounds()})
  },
  
  reset : function(){
    this.move = []; 
    this.beatMoving = false;
    this.comboStart = false;
    this.currentCombos = 0
    this.beatAccelaration = 0
    this.ticksPassed = 0
    this.scene.fire('wrongMove')
  },
  
  tick : function(){
    if(this.beatMoving){
      this.ticksPassed = 0
      return
    }
    this.ticksPassed++
    this.totalMoveTicks++  
  },
  
  registerListeners  : function(){
    var self = this
    document.stopObserving('keydown')
    document.observe('keydown', function(e){
      if(self.beatMoving){
        self.reset()
      }
      var click = -1
      if (e.keyCode == 39) {
        click = 0
      }else if (e.keyCode == 37) {
          click = 1
      }else if (e.keyCode == 32) {
          click = 2
      }else{
        // self.scene.fire("keypressed", [click, self.move.length])
        return
      }
      self.process(click)
		})
  },
  
  process : function(click){
      var self = this
      if(self.scene.currentSpeed > 0){
        self.comboStart = true
      }
      if(click!=-1 && self.ticksPassed >= self.nextTick-8 && self.ticksPassed <= self.nextTick+8){   
            console.log('=')
            self.move.push(click)
            // self.scene.fire("keypressed", [click, self.move.length])
      }else if(self.ticksPassed <  self.nextTick-10){
            console.log('<')
            self.reset()
            self.move = [click]
            self.totalMoveTicks = 0
            // self.scene.fire("keypressed", [click, self.move.length, 1])
      }else if(self.ticksPassed > self.nextTick+10){
            console.log('>')
            self.reset()
            self.move = [click]
            self.totalMoveTicks = 0
            // self.scene.fire("keypressed", [click, self.move.length, 1])
      }else{
            alert('!!!')            
      }
      // console.log(click, self.move.length);
      self.checkMove()
      self.ticksPassed = 0
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
     this.startMove(this.moves[command].index,self.nextTick*code.length)
     //Sounds.play(Sounds.gameSounds.correct_move)
   }
  },
  
  startMove : function(commandIndex,noOfTicks){
//    if(this.conversationOn) return
    var collision = this.scene.detectCollisions()
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

    var self = this
    this.scene.reactor.push(noOfTicks, function(){
      self.moveEnd()
    })
    
  },

  moveEnd : function(){
    console.log('combo start',this.comboStart)
    if(this.comboStart){
        this.comboStart= false
        this.combos++
        if(this.beatAccelaration<9)this.beatAccelaration+=2
        this.currentCombos++
        console.log('correctMove')
        this.scene.fire('correctMove')
      }
      this.beatMoving = false
  }
  
});
