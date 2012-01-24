var MovingBubble = Class.create(Unit,{

  scalable: false,
  
  initialize : function($super, scene, owner, message){
    this.following = { coords : owner.coords, 
                       textInfo : function(){
                         return message;
                       }
                     };
    $super(scene,owner.coords.x,0, {y:owner.coords.y});
    
  }

})
