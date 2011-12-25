var ProtectionUnit = Class.create(Unit,{
  
  chargeTolerance : 0,
  enemies : null,
  rotationTolerance : 10,
  text: "",
  
  initialize : function($super,scene,x,y,options){
    $super(scene,x,y,options)
    this.hp = this.maxHp = 1000
    this.neglected = false
    
    this.text = this.scene.handlers.message.messages.protectionUnit[Math.round(Math.random()*(this.scene.handlers.message.messages.protectionUnit.length-1))];
   },
   
   textInfo: function(){
     return this.text;
   },
  
  createEnemies : function(){
     var enemiesCoords = [{x:this.coords.x+this.getWidth()+10, y:this.coords.y}]
     this.enemies = [this.scene.handlers.enemy.createEnemyBlock(enemiesCoords[0])]
     
     this.enemies[0].setCoords (enemiesCoords[0])
     
     for(var i=0;i<this.enemies[0].elements.length;i++){
       this.enemies[0].elements[i][0].coords = {x:this.coords.x+this.getWidth()-50*i, y:this.coords.y+i*100}
     }
     
     this.enemies[0].setTarget(this)
  },
  
  tick : function($super){
    $super()
    this.updatePosition();
    if(this.doneProtection){
      this.escape()
      return
    }
    this.enemies[0].tick()
    this.checkTarget()
    this.checkHp()
    
  },
  checkHp : function(){
  },
  escape : function(){
  },
  checkTarget : function(){
    if(this.isProtected){
      var target = this.scene.handlers.crowd.getLargestXCrowd()
      this.enemies[0].setTarget(target)
    }
  },
  updatePosition: function(){
    this.move(-1 * this.scene.currentSpeed * this.scene.direction, 0);  
  },
  rotationComplete : function(attack){
    if(this.rotationTolerance == 0 ) return
    this.rotationTolerance-=1        
    if (this.rotationTolerance == 0) {
      this.doneProtection = true
      for(var i=0;i<this.enemies.length;i++){
        this.enemies[i].destroy()
      }
      this.scene.fire("targetCircleComplete");
      this.scene.collision = false;
    }
  },
  die : function(){
    for(var i=0;i<this.enemies.length;i++){
        this.enemies[i].destroy()
    }
    this.scene.fire("targetCircleComplete");
  }
  
})
