var InGameMeterBar = Class.create({

  xPos: 0,
  currentEnergy: 0,
  showRemainingTime: false,
  

  initialize : function(game){
    this.game = game;
    this.templateManager = game.templateManager;
    this.scoreCalculator = game.scene.scoreCalculator;
    this.currentEnergy = -1;
    this.xPos = this.game.scene.view.xPos;

    var images = ["level_meter_crowd.png", "level_meter_highlighted.png", "level_meter.png", "timer.png", "power_bar.png", "power_level01.png", "power_level02.png", "power_level03.png", "power_level04.png"];
    var self = this;
    new Loader().load([{images: images, path: 'images/game_elements/', store: 'game_elements'}],
          {onFinish:function(){        
             self.display();
          }
        })
  },
  
  display: function(){
    $('inGameMeterBar').innerHTML = this.templateManager.load('inGameMeterBar');
    
    Game.addLoadedImagesToDiv('inGameMeterBar');
    
    $$('.inGameMeterBar .levelMeterHighlight')[0].style.width = "8%";
    
    this.game.scene.pushToRenderLoop('meters', this);
    var self = this;
    this.game.scene.observe("end", function(){
      self.game.scene.removeFromRenderLoop('meters', self);
    });
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
    $('timerTxt').innerHTML = hours + ":" + minutes + ":" + seconds;
    
    if(this.currentEnergy != this.game.scene.energy.current){
      this.currentEnergy = this.game.scene.energy.current;
      this.setPowerMeterStyle()
    }

    if(this.xPos != this.game.scene.view.xPos){
      this.xPos = this.game.scene.view.xPos;
      
      $$('.inGameMeterBar .levelMeterHighlight')[0].style.width = (8+91*(this.xPos/this.game.scene.view.length))+"%";
    }
    
    if(!this.showRemainingTime && this.scoreCalculator.gameTime <= this.scoreCalculator.remainingTime){
      this.showRemainingTime = true;
      
    }
    
  },
  
  setPowerMeterStyle : function(){
    var currentEnergy = this.game.scene.energy.current
    var c = 0;
    for(var i=0;i<4;i++){
      c++;
      var minEnergy = this.game.scene.speeds[i].energy
      var maxEnergy = 0
      if(this.game.scene.speeds[i+1]){
        maxEnergy = this.game.scene.speeds[i+1].energy
      }else{
        maxEnergy = this.game.scene.energy.max
      }
      if(currentEnergy > maxEnergy)      
        $$('.inGameMeterBar .powerbar .powerLevel0'+ c + ' div')[0].style.width = "100%"
      else if(currentEnergy < minEnergy){
        $$('.inGameMeterBar .powerbar .powerLevel0'+ c + ' div')[0].style.width = "00%"
      }else{
        var percent = (currentEnergy - minEnergy)*100/ (maxEnergy - minEnergy)
        $$('.inGameMeterBar .powerbar .powerLevel0'+ c + ' div')[0].style.width = percent+"%"
      } 
    }
    $$('.inGameMeterBar .powerbar .powerPercentage')[0].innerHTML = Math.floor(currentEnergy*100/ this.game.scene.energy.max) + "%"
  }
});
