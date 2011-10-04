var MeterBar = Class.create({

  energy : 50,

  initialize : function(gameManager){
    this.gameManager = gameManager;
    this.network = gameManager.network;    
    this.templateManager = gameManager.templateManager;
    var self = this;
    new Loader().load([ {images : ['energy_bar.png', 'experience_bar.png', 'game_currency_bar.png',
                                  'experience_bar_left.png', 'experience_bar_right.png', 'experience_bar_center.png',
                                  'energy_bar_left.png', 'energy_bar_right.png', 'energy_bar_center.png'],
                         path: 'images/game_elements/', store: 'game_elements'}],
                      {
                        onFinish: function(){
                          gameManager.reactor.pushPeriodical(0, 1, gameManager.reactor.everySeconds(1), function(){self.updateBars()});
                          self.display();
                        }
                      });
  },

  energyBar : function(){
    return $$('.energyBar .bar')[0];
  },

  experienceBar : function(){
    return $$('.experienceBar .bar')[0];
  },

  display : function(){
    $('meterBar').innerHTML = this.templateManager.load('meterBar', {score: this.gameManager.userData.scores.global,
                                energy : this.gameManager.userData.energy, coins : this.gameManager.userData.coins});
    Game.addLoadedImagesToDiv('meterBar');
    this.updateBars();
  },

  updateBars : function(){
    this.energyGain();
    if(!this.energyBarWidth) this.energyBarWidth = parseInt(this.energyBar().getStyle('width').split('px')[0]);
    if(!this.experienceBarWidth) this.experienceBarWidth = parseInt(this.experienceBar().getStyle('width').split('px')[0]);
    this.energyBar().childElements('table')[0].setStyle({ 'width' : Math.floor(this.gameManager.userData.energy)/this.maxEnergy()* this.energyBarWidth} );
    $$('.energyBar span')[0].innerHTML = Math.floor(this.gameManager.userData.energy);

    var experienceNewWidth = (this.gameManager.userData.scores.global-this.rank()['lower_exp'])/(this.rank()['upper_exp'] - this.rank()['lower_exp'])
    if(experienceNewWidth > 1) experienceNewWidth = 1
    this.experienceBar().childElements('table')[0].setStyle({width : experienceNewWidth * this.experienceBarWidth });
  },

  energyGain : function(){
    var energyUnitTime = 5 * 60
    if( this.gameManager.userData.energy >= this.maxEnergy() )
    {
      return
    }
    var time = parseInt(new Date().getTime() / 1000);
    if(!this.gameManager.userData.last_loaded) this.gameManager.userData.last_loaded = time
    var secondsPassed = time - this.gameManager.userData.last_loaded
    this.gameManager.userData.last_loaded = time;
    var netEnergyUnits = secondsPassed / energyUnitTime
    var neededEnergy = this.maxEnergy() - this.gameManager.userData.energy
    if( netEnergyUnits >= neededEnergy )
    {
      this.gameManager.userData.energy= this.maxEnergy();
      return
    }
    this.gameManager.userData.energy += netEnergyUnits
  },

  rank : function(){
    var self = this;
    var userRank = {lower_exp : 0, upper_exp : 0};
    for(var i in this.gameManager.gameData.ranks)
    {
      var rank = this.gameManager.gameData.ranks[i];
      if(this.gameManager.userData.scores.global > rank.lower_exp &&  this.gameManager.userData.scores.global < rank.upper_exp)
      {
        userRank = rank;
        break;
      }else if(rank['lower_exp'] > userRank['lower_exp'])
      {
        userRank = rank;
      }
    }
    return userRank;
  },

  maxEnergy : function(){
    return this.energy;
  }

});
