var AmnMarkazy = Class.create(Enemy,{
	hitting : false,
	hittingTime: 0,
	hitOffset: 10,
	hittingTime: 0,
	hitState : "amn_markazy_animation_"+"hit",
  normalState : "amn_markazy_animation_"+"normal",
  hitDone : false, 	
  initialize : function($super,scene,x,y, options){
     $super(scene,x,y, options) 
     this.type = "amn_markazy";
     this.hp = 30;
     this.maxHp = 30;
     this.power = 10;
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
          this.scene.fire(this.normalState)
      }
      
      if(this.target == null && target != null){
          this.scene.fire(this.hitState);
      }
        
      this.target = target;
  }
  
})
