var GuidingIcon = Class.create(Observer,{
  
  circleFlag: false,
  
  commands: ["normal", "retreat", "circle", "hold"],
  moveIndex : 0,
  currentCommandIndex: -1,
  
  moves : [
    {code:[0,0,0,0],index:0},
    {code:[1,1,1,1],index:1},
    {code:[0,1,0,1],index:2}, 
    {code:[2],index:3}
  ],
  
  initialize: function(game){
    
    this.scene = game.scene;
    this.moveIndex = 1;
    
    $('guidingBar').innerHTML = game.templateManager.load('guidingBar');
    
    $$("#guidingBarSlide")[0].observe("click", function(){
      if(this.hasClassName('trigger')){
        this.removeClassName('trigger');
        this.toggleClassName("triggered");
        $$('.movesIndicator')[0].style.left = "140px";
        // new Effect.Move($$('.movesIndicator')[0], {x:140,duration:2})
      }else if(this.hasClassName('triggered')){
        this.removeClassName('triggered');
        this.toggleClassName("trigger");
        $$('.movesIndicator')[0].style.left = "0px";
        // new Effect.Move($$('.movesIndicator')[0], {x:0,duration:2})
      }
    });
    
    var self = this;
    game.scene.observe("keypressed", function(key, moveIndex, reset){self.keypressed(key, moveIndex, reset)});
    game.scene.observe("pressLate", function(){self.pressLate()});
    game.scene.observe("beatMoving", function(){self.beatMoving()});
    game.scene.reactor.pushEvery(0 , 1, function(){self.tick()});
    
    game.scene.observe("targetCircleComplete", function(){self.targetCircleComplete()});
  },
  
  keypressed: function(key, moveIndex, flag){
    if(flag == 1){ //early
      this.pressEarly();
      this.moveIndex = 1;
      return ;
    }
    
    var moveLength = this.moves[this.currentCommandIndex].code.length;

    if(moveIndex)
      this.moveIndex = moveIndex;
    else 
      this.moveIndex = 1;
    
    if(key == -1){
      this.wrongKey(moveIndex+1);
    }else {
      if(key == this.moves[this.currentCommandIndex].code[this.moveIndex-1])
        this.correctPress(this.moveIndex);
      else{
        this.wrongKey(this.moveIndex);
      }
    }
  },
  
  beatMoving: function(){
    var self = this;
    this.scene.reactor.push(10, function(){self.reset(4)});
  },
  
  correctPress: function(moveIndex){
    var moveLength = this.moves[this.currentCommandIndex].code.length;
    $$('.movesIndicator')[0].children[moveLength-moveIndex].addClassName("right");
  },

  wrongPress: function(moveIndex){
    var moveLength = this.moves[this.currentCommandIndex].code.length;
    $$('.movesIndicator')[0].children[moveLength-moveIndex].addClassName("wrong");
  },
  
  reset: function(moveIndex){
    var moveLength = this.moves[this.currentCommandIndex].code.length;
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
    var command = 0;
    
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

    if(this.circleFlag) command = 2;
    
    if(this.currentCommandIndex != command){
      this.currentCommandIndex = command;
      this.displayCommand(this.currentCommandIndex)
    }
  },
  
  targetCircleComplete: function(){
    this.circleFlag = false;
  },
  
  displayCommand: function(index){
    
    if(index == 0) //march
      $$('.moveContainer img')[0].src = "images/game_elements/walk_move.png";
    else if(index == 1) //retreat  
      $$('.moveContainer img')[0].src = "images/game_elements/retreat_move.png";
    else if(index == 2) //cricle
      $$('.moveContainer img')[0].src = "images/game_elements/circle_move.png";

    //empty current command
    for(var i=0; i<4; i++){
      $$('.movesIndicator')[0].children[i].firstChild.src = "";
      $$('.movesIndicator')[0].children[i].removeClassName("right");
      $$('.movesIndicator')[0].children[i].removeClassName("wrong");
    }
        
    for(var i=0; i<this.moves[index].code.length; i++){
      this.loadButton(i, this.moves[index].code[this.moves[index].code.length-i-1]);
    }
  },

  loadButton: function(i, button){
    if(button == 0)
      $$('.movesIndicator')[0].children[i].firstChild.src = "images/game_elements/right_arrow.png";
    else  
      $$('.movesIndicator')[0].children[i].firstChild.src = "images/game_elements/left_arrow.png";
  },
    
  render: function(){
    
  },
  
  // new Effect.Move(element, {x:10,y:10,duration:1})

  
  
});