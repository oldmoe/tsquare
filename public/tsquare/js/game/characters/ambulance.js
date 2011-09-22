var Ambulance = Class.create(Unit,{
  doneProtection : false,
  chargeTolerance : 0,
  enemies : null,
  rotationTolerance : 10,
  isProtected : false,
  initialize : function($super,scene,x,y,options){
    $super(scene,x,y,options)
   },
  
  createEnemies : function(){
   var enemiesCoords = [{x:this.coords.x+this.getWidth()+20, y:this.coords.y},
   {x:this.coords.x+this.getWidth(),y:this.coords.y+10}]
   this.enemies = [this.scene.handlers.enemy.createOneManUnit(),this.scene.handlers.enemy.createOneManUnit()]
   this.enemies[0].setCoords (enemiesCoords[0])
   this.enemies[1].setCoords (enemiesCoords[1])
   this.enemies[0].setTarget(this)
   this.enemies[1].setTarget(this) 
  },
  tick : function($super){
    $super()
    this.enemies[0].tick()
    this.enemies[1].tick()
    this.checkTarget()
    this.updatePosition();
    
  },
  checkTarget : function(){
    if(this.isProtected){
      var target = this.scene.handlers.crowd.getLargestXCrowd()
      this.enemies[0].setTarget(target)
      this.enemies[1].setTarget(target)
    }
  },
  updatePosition: function(){
    this.move(-1 * this.scene.currentSpeed * this.scene.direction, 0);  
  },
  rotationComplete : function(attack){
    this.rotationTolerance-=1        
  }
})
