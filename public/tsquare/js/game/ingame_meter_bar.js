var InGameMeterBar = Class.create({

  initialize : function(game){
    this.game = game;
    this.templateManager = game.templateManager;
    this.scoreCalculator = game.scene.scoreCalculator;
    $('inGameMeterBar').innerHTML = this.templateManager.load('inGameMeterBar');
    
    var self = this;
    // this.game.scene.reactor.push(this.game.scene.reactor.everySeconds(1), function(){self.tick()});
//    new Loader().load([ {images : [], path: 'images/game_elements/', store: 'game_elements'}],
//                      {
//                        onFinish: function(){
                          // self.display();
//                        }
//                      });
    game.scene.reactor.pushEvery(0, game.scene.reactor.everySeconds(1), function(){self.tick();});
  },
  
  tick : function(){
    //console.log("ticking");
    this.scoreCalculator.updateTime();
  },
  
  render : function(){
    //console.log("render");
    var time = this.scoreCalculator.getTimeDetails();
    var hours = time[0]<10?"0"+time[0]:time[0];
    var minutes = time[1]<10?"0"+time[1]:time[1];
    var seconds = time[2]<10?"0"+time[2]:time[2];
    $('timer').innerHTML = hours + ":" + minutes + ":" + seconds;
    $('energy').innerHTML = this.game.scene.energy.current;
  }
});
