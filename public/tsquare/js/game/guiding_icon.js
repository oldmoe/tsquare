var GuidingIcon = Class.create(Observer,{
  
  circleFlag: false,
  
  commands: ["normal", "retreat", "circle", "hold"],
  moveIndex : 0,
  currentCommandIndex: 0,
  
  moves : [
    {code:[0,0,0,0],index:0},
    {code:[1,1,1,1],index:1},
    {code:[0,1,0,1],index:2}, 
    {code:[2],index:3}
  ],
  
  initialize: function(game){
    
    this.scene = game.scene;
    
    $('guidingBar').innerHTML = game.templateManager.load('guidingBar');
    
    var self = this;
    game.scene.observe("keypressed", function(key, moveIndex, reset){self.keypressed(key, moveIndex, reset)});
    game.scene.observe("pressLate", function(){self.pressLate()});
    
    // game.scene.reactor.pushEvery(0, 1, function(){self.tick();});
    this.moveIndex = 1;
    
    // game.scene.observe("circleEnd", function(){self.circleEnd()});
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
      this.wrongKey();
    }else {
      this.correctPress(this.moveIndex);
    }
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

  wrongKey: function(){
    this.wrongPress(this.moveIndex);
    var self = this;
    this.scene.reactor.push(20, function(){self.reset(self.moveIndex);});
  },
  
  pressEarly: function(){
    var self = this;
    this.scene.reactor.push(10, function(){self.reset(self.moveIndex+1);});
    this.scene.reactor.push(50, function(){self.correctPress(1);});
  },

  pressLate: function(){
    var self = this;
    this.scene.reactor.push(50, function(){self.reset(self.moveIndex+1);});
  },
  
  circleEnd: function(){
    this.circleFlag = false;
  },
  
  tick: function(){
    
    var command = 0;
    if(this.scene.handlers.enemy.objects[1] && this.scene.handlers.enemy.objects[1][0]){
      if(!this.scene.handlers.enemy.objects[1][0].chargeTolerance)
        command = 2;
      else
        command = 0;
    }

    if(this.scene.handlers.protection_unit.objects[1] && this.scene.handlers.protection_unit.objects[1][0]){
      if(!this.scene.handlers.protection_unit.objects[1][0].chargeTolerance && this.scene.collision && !this.circleFlag){
        this.circleFlag = true;
      }
      if(this.circleFlag) command = 2;
    }
    
    if(this.currentCommandIndex != command){
      this.currentCommandIndex = command;
      this.displayCommand(this.currentCommandIndex)
    }
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
      this.loadButton(i, this.moves[index].code[i]);
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