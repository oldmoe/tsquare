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
    
    var self = this;
    this.rotationTolerance -= 1;        
    if (this.rotationTolerance == 0) {
      self.doneProtection = true;
      self.scene.fire("targetCircleComplete");
      
      var rescue_unit_name = self.scene.handlers.crowd.target.name.split("_")[0];
      var mapName = self.nameMapping[rescue_unit_name];
      if( !mapName ) mapName = rescue_unit_name;
      self.scene.rescuing = self.scene.handlers.crowd.addCrowdMember( mapName, {x: self.coords.x, y: self.coords.y} );
      self.scene.rescuing.targetTile = self.targetTile;
      self.scene.rescuing.helpMessage = self.helpMessage;
      self.scene.rescuing.companyMessage = self.companyMessage;
      self.scene.rescuing.leaveMessage = self.leaveMessage;
      self.scene.rescuing.mission = self.mission;
      self.destroy();
      
      self.scene.rescuing.messageBubble = self.scene.handlers.message.showRescueBubble( self.scene.rescuing.companyMessage, self.scene.rescuing );
      
      
      self.neglected = true;
      var position = this.scene.handlers.crowd.calcPosition( this.lane, this.scene.handlers.crowd.objects[this.lane].length );
      self.scene.rescuing.fire("reverseWalk");
      self.scene.rescuing.moveToTarget( {x: position.x, y: position.y}, function(){
        self.scene.rescuing.fire(self.scene.speeds[self.scene.speedIndex].state);
      } );
    }
  },
  
  textInfo : function(){
    return this.helpMessage;
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