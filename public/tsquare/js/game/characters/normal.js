var Normal = Class.create(CrowdMember,{
  
  crowd: null,
  
  init: function(options){
    this.speed = 10 * Math.random();
    this.coords.x = 0;
    this.coords.y = options.y;
    this.originalPosition = {x:options.x,y:options.y}
    this.crowd =  options.crowd;
  },
  
  updateState: function(){
    
  },
  
  tick: function($super){
    $super();
    this.target = this.crowd.target;
    if(this.back){
      this.move(-10,0);
      if(this.coords.x < -150) {
        this.hp = -1;
      }
    }
  },
  
  move: function(dx,dy){
    this.coords.x += dx;
    this.coords.y += dy; 
  },
  
  die: function(){
    this.back = true;
    this.fire("reverseWalk");
  }
  
  
})
