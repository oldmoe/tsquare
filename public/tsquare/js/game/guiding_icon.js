var GuidingIcon = Class.create(Observer,{
  
  circleFlag: false,
  
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
    this.correctCommands = 0;
    var images = ["circle_move.png", "move_indicator.png", "right_arrow.png", 'up_arrow.png','down_arrow.png', "left_arrow.png", "move_background.png", "moves_arrows.png"];
    var self = this;
    new Loader().load([{images: images, path: 'images/game_elements/', store: 'game_elements'}],
          {onFinish:function(){        
             self.display();
          }
        })
        
    this.scene.observe('correctCommand',function(){self.increaseCorrectCommandsCount()})    
  },
  
  display: function(){
    $('guidingBar').innerHTML = game.templateManager.load('guidingBar');
    
    Game.addLoadedImagesToDiv('guidingBar');
    
    this.scene.pushToRenderLoop('meters', this);
    this.scene.observe("keypressed", function(key, moveIndex, reset){self.keypressed(key, moveIndex, reset)});
    this.scene.observe("pressLate", function(){self.pressLate()});
    this.scene.observe("beatMoving", function(){self.beatMoving()});
    this.scene.push(this);
    var self = this;
    this.scene.observe("targetCircleComplete", function(){self.targetCircleComplete()});
    /* When play ends stop updating meter bar */ 
    this.scene.observe("end", function(){
      self.scene.removeFromRenderLoop('meters', self);
      self.scene.remove(self);
    });
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
    console.log("command" + this.moves[this.currentCommand].code)
    var moveLength = this.moves[this.currentCommand].code.length;
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
    this.scene.reactor.push(5, function(){self.reset(self.moveIndex+1);});
  },
  
  circleEnd: function(){
    this.circleFlag = false;
  },
  
  
  tick: function(){
    var command = "march";
    
    var enemy = null, protectionUnit = null;
    if(this.scene.handlers.enemy.objects[1] && this.scene.handlers.enemy.objects[1][0]) enemy =  this.scene.handlers.enemy.objects[1][0];
    if(this.scene.handlers.protection_unit.objects[1] && this.scene.handlers.protection_unit.objects[1][0]) protectionUnit = this.scene.handlers.protection_unit.objects[1][0];  
    
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
      if(!enemy.chargeTolerance && this.scene.collision)
        this.circleFlag = true;
        
        
    }else if(choice == 1){
      if(!protectionUnit.doneProtection && this.scene.collision)
        this.circleFlag = true;
    }

    if(this.circleFlag) command = "circle";
    
    if(this.currentCommand != command){
      this.currentCommand = command;
      this.displayCommand(this.currentCommand)
    }

    
    if(this.correctCommands > 2 && !this.arrowsHidden){
      $$('.movesIndicator')[0].hide();
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
  
  targetCircleComplete: function(){
    this.circleFlag = false;
  },
  
  displayCommand: function(command){
    
    if(command == 'march') //march
      $$('.nextMove img')[0].src = "images/game_elements/walk_move.png";
    else if(command == 'retreat') //retreat  
      $$('.nextMove img')[0].src = "images/game_elements/retreat_move.png";
    else if(command == 'circle') //cricle
      $$('.nextMove img')[0].src = "images/game_elements/circle_move.png";

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
