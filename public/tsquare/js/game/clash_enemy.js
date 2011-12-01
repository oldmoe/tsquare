var ClashEnemy = Class.create(Unit,{
  running : false,
  runningSpeed : 18,
  pushSpeed : 20,
  boxCar : null,
  target : null,
  distanceFromLeft : 180,
  initialize : function($super,scene,x,y,options){
     $super(scene,x,y,options)
     this.hp = 30;
     this.maxHp = 30;
     this.power = 10;
     this.createObservers()
  },
  start : function(boxCar){
    this.boxCar = boxCar
    var self = this
    this.moveToTarget({x:this.scene.view.width - this.distanceFromLeft,y:this.coords.y}, function(){
      self.scene.clashDirectionsGenerator.setEnemy(self)
     })
  },
  createObservers : function(){
    var self = this
    // event clash win means crowds won, so function lose is called for the enemy
    this.scene.observe('clashWin', function(){
        self.running = false
        if(self.boxCar) self.boxCar.lose()
        else self.handler.removeObject(self,self.lane)
    })
    // event clash lose means crowds lost, so function win is called for the enemy
    this.scene.observe('clashLose', function(){
        self.running = false
        if(self.boxCar)self.boxCar.win()
        else self.handler.removeObject(self,self.lane)
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
