var TearGasGunnerCs = Class.create(Enemy,{
  rate : 0, 
  hitting : false,
  counter : 0,
  shotComplete : false,
  initialize : function($super,scene,x,lane, options){
     $super(scene,x,lane, options)
     this.rate = this.scene.reactor.everySeconds(gameData.enemies[this.mappingName].rate.time)
     this.coords.y+=20
     var self = this
     
  },
  
  tick : function($super){
    $super();
    this.counter++;
    if(this.counter % this.rate == 0){
      this.createTearGasBomb();
    }        
  },
  
  updatePosition : function(){
    
  },
  
  createTearGasBomb : function(){
    if (!this.shoftComplete) {
      var v0 = 1.1 + Math.random() * 0.3 - 0.15;
      var bomb = new TearGasBomb(this.scene, this, {
        x: this.coords.x,
        y: this.coords.y,
        angle: 0
      }, v0, Math.PI / 4, Math.PI * 5 / 4);
      this.scene.objects.push(bomb);
      var bombDisplay = new TearGasBombDisplay(bomb);
      this.scene.pushToRenderLoop('characters', bombDisplay);
      this.fire("hit");
    }
  }
  
})
