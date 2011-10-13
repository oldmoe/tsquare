var MovementManager = Class.create({
  
  RIGHT : 0, LEFT : 1,
  move : [],
  movements : [],
  direction : 0,
  ticksPassed : 0,
  totalMoveTicks : 0,
  moveLength : 0,
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
    this.checkUserDelay()
    this.scene.push(this)
    this.time = new Date().getTime()
  },

  checkUserDelay : function(){
   var upperBound =  this.time + this.scene.audioManager.nextBeatTime()*this.move.length + 300
   var now = new Date().getTime()
   if(now > upperBound){
     if(this.move.length > 0)console.log(now-this.time);
     this.time = now
     console.log('reset1')
     this.reset()
   } 
  },
  
  reset : function(){
    this.move = []; 
    this.time = new Date().getTime()
    this.beatMoving = false;
    this.comboStart = false;
    this.currentCombos = 0
    this.beatAccelaration = 0
    this.ticksPassed = 0
    this.scene.fire('wrongMove')
  },
  getThreeDigits : function(num){
    return parseInt((num/1000 - parseInt(num/1000))* 1000)
  },
  tick : function(){
    if(this.beatMoving){
      var now = new Date().getTime()
      if (now > this.time + this.endTime * 2) {
        this.moveEnd()
        this.time = now      
      }
    }else{
      this.checkUserDelay()
    }
  },
  
  registerListeners  : function(){
    var self = this
    document.stopObserving('keydown')
    document.observe('keydown', function(e){
      if(self.beatMoving){
        self.reset()
        console.log('reset2')
      }
      var click = -1
      if (e.keyCode == 39) {
        click = 0
      }else if (e.keyCode == 37) {
          click = 1
      }else if (e.keyCode == 32) {
          click = 2
      }else{
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
      var now = new Date().getTime()
      var lowerBound =  this.time + this.scene.audioManager.nextBeatTime()*this.move.length - 300
      var upperBound =  this.time + this.scene.audioManager.nextBeatTime()*this.move.length + 300
      //console.log(this.getThreeDigits(now),this.getThreeDigits(lowerBound),this.getThreeDigits(upperBound))
      if(now  < lowerBound){
            console.log('<')
            self.reset()
            console.log('reset3')
            self.moveLength = 1
            self.move = [click]
            self.totalMoveTicks =0
      }
      else if(click!=-1 && now > lowerBound && now < upperBound){   
            console.log('=')
            self.move.push(click)
            self.moveLength++
      }
      else{
            //alert('!!!')            
      }
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
     console.log('reset4')
     
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
     this.startMove(this.moves[command].index,this.scene.audioManager.nextBeatTime()*4)
     this.moveLength = 0
     //Sounds.play(Sounds.gameSounds.correct_move)
   }
  },
  
  startMove : function(commandIndex,endTime){
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
    this.endTime = endTime    
  },

  moveEnd : function(){
      if(this.comboStart){
        this.comboStart= false
        this.combos++
        this.currentCombos++
        this.scene.fire('correctMove')
      }
      console.log('end move')
      this.beatMoving = false
  }
  
});
