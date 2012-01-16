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
    var images = ["walk_move.png", "hit_move.png", "circle_move.png", "push_move.png", "retreat_move.png", "move_indicator.png", "right_arrow.png", 'up_arrow.png','down_arrow.png', "left_arrow.png", "move_background.png", "moves_arrows.png"];
    var self = this;
    new Loader().load([{images: images, path: 'images/game_elements/', store: 'game_elements'}],
                      {onFinish:function(){self.display();}}) ;
  },
  
  display: function(){
    $('guidingBar').innerHTML = game.templateManager.load('guidingBar');
    Game.addLoadedImagesToDiv('guidingBar');
    
    var self = this;
    this.scene.observe('hideGuidingIcon', function(){self.hide()})
    this.scene.observe('showGuidingIcon', function(){self.show()})
    this.scene.observe("keypressed", function(key, moveIndex, reset){self.keypressed(key, moveIndex, reset)});
    this.scene.observe('correctCommand',function(){self.increaseCorrectCommandsCount()})
    this.scene.observe("pressLate", function(){self.pressLate()});
    this.scene.observe("beatMoving", function(){self.beatMoving()});
    this.scene.observe("targetComplete", function(){self.targetComplete()});
    this.scene.push(this);
    
    this.scene.pushToRenderLoop('meters', this);
    /* When play ends stop updating meter bar */ 
    this.scene.observe("end", function(){
      self.scene.removeFromRenderLoop('meters', self);
      self.scene.remove(self);
    });
    
    this.show();
  },
  
  hide: function(){
    $('guidingBar').hide();
  },

  show: function(){
    $('guidingBar').show();
  },
  
  keypressed: function(key, moveIndex, flag){
    if(flag == 1){ //early
      this.increaseWrongCommandsCount();
      this.pressEarly();
      this.moveIndex = 1;
      this.scene.fire("showGuidBubble", [this.currentCommand]);
      return ;
    }

    if(flag == 2){ //pressed while the waiting beats
      this.increaseWrongCommandsCount();
      this.wrongKey(1);
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
      this.wrongKey(moveIndex+1);
    }else {
      if(key == this.moves[this.currentCommand].code[this.moveIndex-1]){
        this.correctPress(this.moveIndex);
        this.scene.fire("removeGuidBubble");
      }else{//arrow key but not the right key
        this.increaseWrongCommandsCount();
        this.wrongKey(this.moveIndex);
        this.scene.fire("showGuidBubble", [this.currentCommand]);
      }
    }
  },
  
  beatMoving: function(){
    var self = this;
    this.scene.reactor.push(10, function(){self.reset(4)});
  },
  
  correctPress: function(moveIndex){
    var moveLength = this.moves[this.currentCommand].code.length;
    $$('.movesIndicator')[0].children[moveLength-moveIndex].addClassName("right");
  },

  wrongPress: function(moveIndex){
    var moveLength = this.moves[this.currentCommand].code.length;
    $$('.movesIndicator')[0].children[moveLength-moveIndex].addClassName("wrong");
  },
  
  reset: function(moveIndex){
    var moveLength = this.moves[this.currentCommand].code.length;
    if (moveIndex > moveLength) moveIndex = moveLength;
    for(var i=1; i<=moveIndex; i++){
      $$('.movesIndicator')[0].children[moveLength-i].removeClassName("right");
      $$('.movesIndicator')[0].children[moveLength-i].removeClassName("wrong");
    }
  },

  wrongKey: function(index){
    this.wrongPress(index);
    var self = this;
    this.scene.reactor.push(5, function(){self.reset(index);});
  },
  
  pressEarly: function(){
    var self = this;
    self.reset(self.moveIndex+1);
  },

  pressLate: function(){
    this.wrongPress(this.moveIndex+1);
    var self = this;
    this.scene.reactor.push(2, function(){self.reset(4);});
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
      this.displayCommand(this.currentCommand);
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
  },
  
  displayCommand: function(command){
    
    if(command == 'march') //march
      $$('.nextMove img')[0].src = "images/game_elements/walk_move.png";
    else if(command == 'retreat') //retreat  
      $$('.nextMove img')[0].src = "images/game_elements/retreat_move.png";
    else if(command == 'circle') //cricle
      $$('.nextMove img')[0].src = "images/game_elements/circle_move.png";
    else if(command == 'hit') //hit
      $$('.nextMove img')[0].src = "images/game_elements/hit_move.png";
    else if(command == 'push') //hit
      $$('.nextMove img')[0].src = "images/game_elements/push_move.png";
    //empty current command
    for(var i=0; i<4; i++){
      $$('.movesIndicator')[0].children[i].firstChild.src = "";
      $$('.movesIndicator')[0].children[i].removeClassName("right");
      $$('.movesIndicator')[0].children[i].removeClassName("wrong");
    }
        
    for(var i=0; i<this.moves[command].code.length; i++){
      this.loadButton(i, this.moves[command].code[this.moves[command].code.length-i-1]);
    }
  },

  loadButton: function(i, button){
    if(button == 0)
      $$('.movesIndicator')[0].children[i].firstChild.src = "images/game_elements/right_arrow.png";
    else if(button == 1)  
      $$('.movesIndicator')[0].children[i].firstChild.src = "images/game_elements/left_arrow.png";
    else if(button == 2)  
      $$('.movesIndicator')[0].children[i].firstChild.src = "images/game_elements/up_arrow.png";
    else if(button == 3)  
      $$('.movesIndicator')[0].children[i].firstChild.src = "images/game_elements/down_arrow.png";

  },
    
  render: function(){
    
  }
  
  // new Effect.Move(element, {x:10,y:10,duration:1})

  
  
});
