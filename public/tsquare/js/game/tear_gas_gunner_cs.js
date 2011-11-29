var TearGasGunnerCs = Class.create(Enemy,{
  rate : 0, 
  hitting : false,
  counter : 0,
  initialize : function($super,scene,x,lane, options){
     $super(scene,x,lane, options)
     this.rate = this.scene.reactor.everySeconds(gameData.enemies[this.mappingName].rate.time)
     this.coords.y+=20
     this.coords.x+=200
     var self = this
     
  },
  
  tick : function($super){
    $super()
    this.counter++
    if(this.counter % this.rate == 0){
      this.createTearGasBomb()
      this.fire("hit");
    }        
  },
  
//  hit : function(){
//      if(this.hp <=0)return
//      var self = this
//      this.scene.reactor.push(this.scene.reactor.everySeconds(this.rate),function(){
//          self.scene.fire("hit");
//          self.createTearGasBomb()
//      })
//  },
  
  createTearGasBomb : function(){
     this.bomb = new TearGasBomb(this.scene, this, {x:this.coords.x, y:this.coords.y, angle: 0},
      1.2, Math.PI /4, Math.PI* 5/4)
     this.scene.objects.push(this.bomb)
     var bombDisplay = new TearGasBombDisplay(this.bomb)
     this.scene.pushToRenderLoop('characters', bombDisplay)
  }
  
})
