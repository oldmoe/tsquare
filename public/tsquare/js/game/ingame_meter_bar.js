var InGameMeterBar = Class.create({

  initialize : function(game){
    /* This should be MOVED to initialize game part */
    this.game = game;
    this.network = game.network;    
    this.templateManager = game.templateManager;
    this.scoreCalculator = game.scene.scoreCalculator;
    var self = this;
    // this.game.scene.reactor.push(this.game.scene.reactor.everySeconds(1), function(){self.tick()});
//    new Loader().load([ {images : [], path: 'images/game_elements/', store: 'game_elements'}],
//                      {
//                        onFinish: function(){
                          // self.display();
//                        }
//                      });
  },
  
  tick: function(){
    this.scoreCalculator.updateTime();
    var time = this.scoreCalculator.getTimeDetails(); 
    $('inGameMeterBar').innerHTML = this.templateManager.load('inGameMeterBar', {energy:this.game.scene.energy.current, hours:time[0]<10?"0"+time[0]:time[0], minutes:time[1]<10?"0"+time[1]:time[1], seconds:time[2]<10?"0"+time[2]:time[2]});
    var self = this;
    this.game.scene.reactor.push(this.game.scene.reactor.everySeconds(1), function(){self.tick()});
  }

});
