var InGameMeterBar = Class.create({

  initialize : function(game){
    this.game = game;
    this.templateManager = game.templateManager;
    this.scoreCalculator = game.scene.scoreCalculator;

    this.currentEnergyWidth = 0;
    this.currentEnergy = 0;
  
    $('inGameMeterBar').innerHTML = this.templateManager.load('inGameMeterBar');

    var self = this;
    game.scene.reactor.pushEvery(0, game.scene.reactor.everySeconds(1), function(){self.tick();});
  },
  
  tick : function(){
    this.scoreCalculator.updateTime();
  },
  
  render : function(){
    var time = this.scoreCalculator.getTimeDetails();
    var hours = time[0]<10?"0"+time[0]:time[0];
    var minutes = time[1]<10?"0"+time[1]:time[1];
    var seconds = time[2]<10?"0"+time[2]:time[2];
    $('timer').innerHTML = hours + ":" + minutes + ":" + seconds;
    
    // if(this.currentEnergy != this.game.scene.energy.current){
      // this.currentEnergy = this.game.scene.energy.current;
      // $$('.energyBar span')[0].innerHTML = Math.floor(this.game.scene.energy.current);
      // var energyBarFill = (Math.floor(this.game.scene.energy.current)/this.game.scene.energy.max) * this.energyBarWidth;
//       
    // }
//     
//     
//     
    // $$('.energyBar .bar table')[0].setStyle({ 'width' : energyBarFill } );
    // if(energyBarFill == 0) $$('.energyBar .bar table')[0].hide();
//     
    
    $('energy').innerHTML = this.game.scene.energy.current;
  }
});
