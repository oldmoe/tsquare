var Ambulance = Class.create(Unit,{
  doneProtection : false,
  chargeTolerance : 0,
  tick : function($super){
    $super()
    
    this.updatePosition();
    
  },
  updatePosition: function(){
    this.move(-1 * this.scene.currentSpeed * this.scene.direction, 0);  
  },
})
