var RescueUnit = Class.create(Unit,{
  
  chargeTolerance : 0,
  enemies : null,
  rotationTolerance : 10,
  startX: 0,
  endX: 0,
  type : "rescue",
  mainCharacter : "",
  name : "",
  
  nameMapping : {'doctor' : 'healer',
                 'girl_7egab' : 'girl7egab',
                 'ultras' : 'ultras_green'},
  
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
      var mapName = this.nameMapping[rescue_unit_name];
      if( !mapName ) mapName = rescue_unit_name;
      this.scene.rescuing = this.scene.handlers.crowd.addCrowdMember( mapName, {} );
      this.scene.rescuing.targetTile = this.targetTile;
      this.scene.rescuing.mission = this.mission;
      this.destroy();
      this.neglected = true;
    }
  }

})


var JournalistRescue = Class.create(RescueUnit,{
  
})

var SalafyRescue = Class.create(RescueUnit,{
  
})

var GirlRescue = Class.create(RescueUnit,{
  
})

var DoctorRescue = Class.create(RescueUnit,{
  
})

var BottleguyRescue = Class.create(RescueUnit,{
  
})

var Girl7egabRescue = Class.create(RescueUnit,{
  
});

var Ultras = Class.create(RescueUnit,{
  
});