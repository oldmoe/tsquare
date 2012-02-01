var GuidingIcon = Class.create(Observer,{
  
  commandLock: false,
  
  moveIndex : 0,
  currentCommand: "",
  correctCommands: 0,
  wrongCommands : 0,
  arrowsHidden: false,
  moves: null,
  
  initialize: function(game){
    this.scene = game.scene;
    this.moves = game.scene.movementManager.moves;
    this.moveIndex = 1;
    this.display();
  },
  
  display: function(){
    var self = this;
    this.scene.observe("keypressed", function(key, moveIndex, reset){self.keypressed(key, moveIndex, reset)});
    this.scene.observe('correctMove',function(){self.increaseCorrectCommandsCount();})
    this.scene.observe("pressLate", function(){self.pressLate()});
    this.scene.observe("targetComplete", function(){self.targetComplete()});
    this.scene.push(this);
    
    /* When play ends stop updating meter bar */ 
    this.scene.observe("end", function(){
      self.scene.remove(self);
    });
  },
  
  keypressed: function(key, moveIndex, flag){
    if(flag == 1){ //early
      this.increaseWrongCommandsCount();
      this.moveIndex = 1;
      this.scene.fire("showGuidBubble", [this.currentCommand]);
      this.scene.fire('wrongArrow');
      return;
    }

    if(flag == 2){ //pressed while the waiting beats
      this.increaseWrongCommandsCount();
      this.moveIndex = 1;
      this.scene.fire("showGuidBubble", [this.currentCommand]);
      return ;
    }
    
    if(moveIndex)
      this.moveIndex = moveIndex;
    else 
      this.moveIndex = 1;
    
    if(key == -1){//not arrow key
      this.scene.fire("showGuidBubble", [this.currentCommand]);
      this.increaseWrongCommandsCount();
      this.scene.fire('wrongArrow');
    }else {
      if(key == this.moves[this.currentCommand].code[this.moveIndex-1]){
        this.scene.fire('correctArrow');
        this.scene.fire("removeGuidBubble");
      }else{//arrow key but not the right key
        this.increaseWrongCommandsCount();
        this.scene.fire('correctArrow');
        this.scene.fire("showGuidBubble", [this.currentCommand]);
      }
    }
  },
  
  pressLate: function(){
    this.scene.fire('wrongArrow');
  },
  
  tick: function(){
    if(this.scene.movementManager.move.length > 0)return;
    var command = "march";
    var enemy = null;
    var protectionUnit = null;
    var target = this.scene.handlers.crowd.target;
    if (target) {
      if (target.type == "protection" || target.type == "rescue") 
        protectionUnit = target
      else 
        enemy = target
    }  

    var choice = -1; // 0: enemy, 1:protectionUnit

    if(enemy && !protectionUnit) choice = 0;
    else if(!enemy && protectionUnit) choice = 1;
    else if(enemy && protectionUnit){
      if(enemy.coords.x < protectionUnit.coords.x) 
        choice = 0; 
      else 
        choice = 1;
    } 

    if(choice == 0){
      if(!enemy.chargeTolerance && this.scene.collision) {
        this.commandLock = false;
        command = "hit";
      }else if(enemy.chargeTolerance && this.scene.collision){
        this.commandLock = false;
        command = "push";
      }
    }else if(choice == 1){
      if(!protectionUnit.doneProtection && this.scene.collision) {
        this.commandLock = false;
        command = "circle";
      }
    }

    if( this.scene.rescuing && !this.scene.rescuing.rescued && this.scene.rescuing.mission == "retrieve" ){
      this.commandLock = false;
      command = "retreat";
    }
    
    if( this.scene.rescuing && this.scene.rescuing.rescued && this.scene.rescuing.mission == "retrieve" ){
      this.commandLock = false;
      command = "march";
    }

    if(this.currentCommand != command && !this.commandLock){
      this.currentCommand = command;
      this.scene.movementManager.currentCommand = this.currentCommand;
    }
    this.commandLock = this.currentCommand != "march";
    
    if(this.correctCommands > 2 && !this.arrowsHidden){
      // $$('.movesIndicator')[0].hide();
      this.arrowsHidden = true;
    }
    
    if(this.wrongCommands > 1 && this.arrowsHidden){
      $$('.movesIndicator')[0].show();
      this.arrowsHidden = false;
    }

  },

  increaseWrongCommandsCount: function(){
    this.wrongCommands+=1;
    this.correctCommands = 0;
  },

  increaseCorrectCommandsCount: function(){
    this.correctCommands+=1;
    this.wrongCommands = 0;
  },
  
  targetComplete: function(){
    this.commandLock = false;
  } 
  // new Effect.Move(element, {x:10,y:10,duration:1})

  
  
});
