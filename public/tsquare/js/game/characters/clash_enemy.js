var ClashEnemy = Class.create(Unit,{
  initialize : function($super,scene,x,y,options){
     $super(scene,x,y,options)
     
  },
  tick : function($super){
    $super()
    
    this.updatePosition();
    this.handleCollision();
  },
})
