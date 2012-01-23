var AmnMarkazy = Class.create(Enemy,{
	
	hitting : false,
	hittingTime: 0,
	hitOffset: 10,
	hittingTime: 0,
  hitDone : false, 	
  target : null,
  initialize : function($super,scene,x,lane, options){
     $super(scene,x,lane, options) 
     this.type = "amn_markazy";
     this.hp = this.maxHp = 30
     this.power = 10
     this.hittingTicks = this.scene.reactor.everySeconds(1)
  },
  handleCollision : function(){
      if(this.target){
         if(this.hittingTime == this.hittingTicks){
            this.target.takeHit(this.power);
            this.hitDone = true
         }
         this.hittingTime += 1;              
         this.hittingTime = this.hittingTime % (this.hittingTicks+1);
      }  
  },
  updatePosition : function(){
    
  }, 
  setTarget: function(target){
      if(this.target != null && target == null){
          this.fire("normal")
      }
      
      if(this.target == null && target != null){
          this.fire("hit");
      }
        
      this.target = target;
  }
  
})
