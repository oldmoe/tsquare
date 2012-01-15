var Normal = Class.create(CrowdMember,{
  
  crowd: null,
  
  init: function(options){
    this.speed = 10 * Math.random();
    this.coords.x = -50;
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
      this.move(-15,0);
      if(this.coords.x < -150) {
        this.hp = -1;
        this.remove()
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
  },
  
  remove : function(){
    this.scene.remove(this);
    this.destroy();    
  },
  
  pushPrepare : function(){
    if (this.moved == 0) {
      this.fire('walk')
      this.moveBack = true
    }
    displacement = -1 *(this.pushPrepareSpeed + (this.maxPushDisplacement-this.moved)*0.1)
    console.log(displacement, "follower", this.coords.x)
    this.moved+= Math.abs(displacement)
    this.move(displacement,0)
    if (this.moved > this.maxPushDisplacement) {
        this.moveBack = false
        return true
    }
  },
})
