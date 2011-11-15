var ClashEnemy = Class.create(Unit,{
  running : false,
  runningSpeed : 18,
  pushSpeed : 20,
  initialize : function($super,scene,x,y,options){
     $super(scene,x,y,options)
     this.hp = 30;
     this.maxHp = 30;
     this.power = 10;
     var self = this
     this.moveToTarget({x:this.scene.view.width - 180,y:this.coords.y}, function(){
       self.scene.fire('clashUnit')
       self.scene.clashDirectionsGenerator.setEnemy(self)
     })
  },
  tick : function($super){
    $super()
    if(this.running && this.coords.x > this.target.coords.x + this.target.getWidth() - 35){
      this.move(-this.runningSpeed,0)
    }
  },
  clashPush : function(){
      this.move(-this.pushSpeed,0)
      this.target.move(-this.pushSpeed,0)
  },
  startClash : function(target){
    this.running = true
    this.target = target
    this.fire('run')
  }
})
