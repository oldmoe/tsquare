var MovingBubble = Class.create(Unit,{

  scalable: false,
  
  initialize : function($super, scene, owner){
    this.following = { coords : owner.coords, 
                       textInfo : function(){
                         return owner.helpMessage;
                       }
                     };
    $super(scene,owner.coords.x,0, {y:owner.coords.y});
    
  }

})
