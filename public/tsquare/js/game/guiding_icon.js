var GuidingIcon = Class.create({
  
  coords: {},
  scalable: false,
  circleFlag: false,  
  
  initialize: function(scene){
    this.scene = scene;
    this.coords = {x:450, y: 150};
    var self = this;
    this.scene.observe("circleEnd", function(){self.circleEnd()});
  },
  
  circleEnd: function(){
    this.circleFlag = false;
    console.log("end circle")
  },
  
  tick: function(){
    var command = 1;
    if(this.scene.handlers.enemy.objects[1] && this.scene.handlers.enemy.objects[1][0]){
      if(!this.scene.handlers.enemy.objects[1][0].chargeTolerance)
        command = 2;
      else
        command = 1;
    }

    if(this.scene.handlers.protection_unit.objects[1] && this.scene.handlers.protection_unit.objects[1][0]){
      if(!this.scene.handlers.protection_unit.objects[1][0].chargeTolerance && this.scene.collision && !this.circleFlag){
        this.circleFlag = true;
      }
      if(this.circleFlag) command = 2;
    }    
    
    switch(command){
      case 1: this.setState("march");break;
      case 2: this.setState("circle");break;
    }
    
  }
  
});