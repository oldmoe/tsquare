var InGameMeterBar = Class.create({

  initialize : function(game){
    this.game = game;
    this.templateManager = game.templateManager;
    this.scoreCalculator = game.scene.scoreCalculator;
    this.currentEnergy = -1;
    $('inGameMeterBar').innerHTML = this.templateManager.load('inGameMeterBar');
    this.energyBarWidth = parseInt($$('.inGameMeterBar .energyBar .bar')[0].getStyle('width').split('px')[0]);
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
    
    if(this.currentEnergy != this.game.scene.energy.current){
      this.currentEnergy = this.game.scene.energy.current;
      $$('.inGameMeterBar .energyBar span')[0].innerHTML = Math.floor(this.game.scene.energy.current);
      var energyBarFill = (Math.floor(this.game.scene.energy.current)/this.game.scene.energy.max) * this.energyBarWidth;
      console.log(energyBarFill);
      $$('.inGameMeterBar .energyBar .bar table')[0].setStyle({ 'width' : energyBarFill } );
      if(energyBarFill == 0) $$('.inGameMeterBar .energyBar .bar table')[0].hide();
      else $$('.inGameMeterBar .energyBar .bar table')[0].show();
    }
  }
});
