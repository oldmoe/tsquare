var Normal = Class.create(CrowdMember,{
  
  crowd: null,
  
  init: function(options){
    this.coords.x = options.x;
    this.coords.y = options.y;
    this.originalPosition = {x:options.x,y:options.y}
    this.crowd = options.crowd;
  },
  
  updateState: function(){
    
  },
  
  tick: function($super){
    $super();
    this.target = this.crowd.target;
  },
  
  move: function(dx,dy){
    this.coords.x += dx;
    this.coords.y += dy; 
  }
  
  
  
})
