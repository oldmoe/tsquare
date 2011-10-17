var Follower = Class.create(Unit,{
  water : 100,
  maxWater : 100,  
  enterSpeed : 3,
    
  initialize : function($super,scene,x,y,options){
    $super(scene,x,y,options)
    this.crowd = options.crowd
    this.target = this.crowd.target
  	this.hp = 1;
  },
  
  init: function($super, options){
    $super(options)
  },
  
  die: function(){
  }
  
})
