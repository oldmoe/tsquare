var InGameMeterBar = Class.create({

  xPos: 0,
  currentEnergy: 0,
  

  initialize : function(game){
    this.game = game;
    this.templateManager = game.templateManager;
    this.scoreCalculator = game.scene.scoreCalculator;
    this.currentEnergy = -1;
    this.xPos = this.game.scene.view.xPos;
    
    $('inGameMeterBar').innerHTML = this.templateManager.load('inGameMeterBar');
    
    $$('.inGameMeterBar .levelMeterHighlight')[0].style.width = "8%";
    
    var self = this;
    this.game.scene.reactor.pushEvery(0, game.scene.reactor.everySeconds(1), function(){self.tick();});
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
      this.setPowerMeterStyle()
    }

    if(this.xPos != this.game.scene.view.xPos){
      this.xPos = this.game.scene.view.xPos;
      
      $$('.inGameMeterBar .levelMeterHighlight')[0].style.width = (8+92*(this.xPos/this.game.scene.view.length))+"%";
    }
    
  },
  
  setPowerMeterStyle : function(){
    for(var i=1;i<5;i++){
      var minEnergy = this.game.scene.speeds[i].energy
      var maxEnergy = 0
      if(this.game.scene.speeds[i+1]){
        maxEnergy = this.game.scene.speeds[i+1].energy
      }else{
        maxEnergy = this.game.scene.energy.max
      }
      var currentEnergy = this.game.scene.energy.current
      if(currentEnergy > maxEnergy)      
        $$('.inGameMeterBar .powerbar .powerLevel0'+(i) + ' div')[0].style.width = "100%"
      else if(currentEnergy < minEnergy){
        $$('.inGameMeterBar .powerbar .powerLevel0'+(i) + ' div')[0].style.width = "00%"
      }else{
        var percent = (currentEnergy - minEnergy)*100/ (maxEnergy - minEnergy)
          $$('.inGameMeterBar .powerbar .powerLevel0'+(i) + ' div')[0].style.width = percent+"%"
      } 
    }
    $$('.inGameMeterBar .powerbar .powerPercentage')[0].innerHTML = Math.floor(this.game.scene.energy.current*100/ this.game.scene.energy.max) + "%"
  }
});
