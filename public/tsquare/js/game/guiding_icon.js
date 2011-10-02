var GuidingIcon = Class.create({
  
  coords: {},
  scalable: false,  
  
  initialize: function(scene){
    this.scene = scene;
    this.coords = {x:450, y: 150};
  },
  
  tick: function(){
    if(this.scene.handlers.enemy.objects[1] && this.scene.handlers.enemy.objects[1][0]){
      if(!this.scene.handlers.enemy.objects[1][0].chargeTolerance)
        this.setState("circle");
      else
        this.setState("march");
    }
    
  }
  
});