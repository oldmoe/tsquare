var TearGasGunnerCs = Class.create(Enemy,{
  rate : 0, 
  hitting : false,
  counter : 0,
  shotComplete : false,
  initialize : function($super,scene,x,lane, options){
     $super(scene,x,lane, options)
     this.rate = this.scene.reactor.everySeconds(gameData.enemies[this.mappingName].rate.time)
     this.coords.y+=20 + 30 * Math.random()
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
      var r = Math.random()
      var theta = 0;
      var v0 = 0;
      if (this.block && this.block.chargeTolerance > 0) {
        theta = 45 * Math.PI / 40 + r * Math.PI / 4;
        v0 = 1.5 - 0.2*r;
      }
      else {
        theta = 55 * Math.PI / 40 + r * Math.PI / 8;
        v0 = 1.2 - 0.2*r;
      }
      var bomb = new TearGasBomb(this.scene, this, {
        x: this.coords.x,
        y: this.coords.y,
        angle: 0
      }, v0, Math.PI / 4, theta);
      this.scene.objects.push(bomb);
      var bombDisplay = new TearGasBombDisplay(bomb);
      this.scene.pushToRenderLoop('characters', bombDisplay);
      this.fire("hit");
    }
  }
  
})
