var PowerupsHandler = Class.create(UnitHandler,{
  
  initialize: function($super, scene){
    $super(scene);
  },
  
  start: function(){
    this.hotKeys = this.scene.movementManager.HOT_KEYS;
    this.userPowerups = this.scene.game.gameManager.userData.powerups;
    var self = this;
    this.scene.observe('activatePowerups', function(key){self.activatePowerups(key)})
    this.loadUserPowerups();
  },
  
  loadUserPowerups: function(){
    $('powerUpsWrapper').update("");
    var container = $('powerUpsWrapper');
    if(this.userPowerups && this.userPowerups.length > 0){
      for (var i=0; i < this.userPowerups.length && i < this.hotKeys.length; i++) {
        if(this.userPowerups[i].count > 0)
          container.insert({bottom: this.scene.game.templateManager.load('powerUpSlot', {type: this.userPowerups[i].type, name: this.userPowerups[i].name, key: (i+1), count: this.userPowerups[i].count})});
      }
      Game.addLoadedImagesToDiv('powerUpsWrapper');
    }
  },
  
  activatePowerups: function(key){
    var powerup = this.userPowerups[key];
    if(powerup && powerup.count > 0){
      powerup.changed = true;
      powerup.count -= 1;
      
      if(powerup.attribute == "health"){
        this.scene.fire("increaesHealth", [powerup.effect]);        
      }else if(powerup.attribute == "hydration"){
        this.scene.fire("increaesHydration", [powerup.effect]);
      }
      this.scene.fire("playPowerupSound");
      Effect.Pulsate($('powerUpsWrapper').children[key])
      var coords = {x:100, y:100};
      new Animation(this.scene, coords, Loader.images['effects']['hydrate.png'], 9, {});
      if(powerup.count == 0){
        $('powerUpsWrapper').children[key].remove();
      }else{
        $('powerUpsWrapper').select("[class=powerupCount]")[key].update(powerup.count+"");
      }
    }else{
      //no powerups for this hot key
    }
  }
  
});