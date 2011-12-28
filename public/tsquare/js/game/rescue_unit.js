var RescueUnit = Class.create(Unit,{
  
  chargeTolerance : 0,
  enemies : null,
  rotationTolerance : 10,
  startX: 0,
  endX: 0,
  type : "rescue",
  mainCharacter : "",
  name : "",
  
  initialize : function($super,scene,x,y,options){
    $super(scene,x,y,options)
    this.name = options.name;
    this.hp = this.maxHp = 1000
   },

  tick : function($super){
    $super()
    this.updatePosition();
    if(this.doneProtection){
      this.escape()
      return
    }

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
    }
  },

  updatePosition: function(){
    this.move(-1 * this.scene.currentSpeed * this.scene.direction, 0);  
  },

  rotationComplete : function(attack){
    if(this.rotationTolerance == 0 ) return;
    this.rotationTolerance -= 1;        
    if (this.rotationTolerance == 0) {
      this.doneProtection = true;
      this.scene.fire("targetCircleComplete");
      var rescue_unit_name = this.scene.handlers.crowd.target.name.split("_")[0];
      this.scene.rescuing = this.scene.handlers.crowd.addCrowdMember( rescue_unit_name, {} );
      this.scene.rescuing.targetTile = this.targetTile;
      this.scene.rescuing.mission = this.mission;
      this.destroy();
      this.neglected = true;
    }
  }

})
