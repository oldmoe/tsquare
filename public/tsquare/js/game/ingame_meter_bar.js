var InGameMeterBar = Class.create({

  initialize : function(game){
    /* This should be MOVED to initialize game part */
    this.network = game.network;    
    this.templateManager = game.templateManager;
    this.scoreCalculator = game.scene.scoreCalculator;
    var self = this;
//    new Loader().load([ {images : [], path: 'images/game_elements/', store: 'game_elements'}],
//                      {
//                        onFinish: function(){
                          self.display();
//                        }
//                      });
  },

  display : function(){
    $('inGameMeterBar').innerHTML = this.templateManager.load('inGameMeterBar', {energy:"2500", hours:"05", minutes:"50", seconds:"10"});
  }
  
  

});
