var AmnMarkazy = Class.create(Enemy,{
	hitting : false,
	hittingTime: 0,
	hitOffset: 10,
	hittingTime: 0,
	showHoveringIcon: true,
		
  initialize : function($super,scene,x,y, options){
     $super(scene,x,y, options) 
     this.type = "amn_markazy";
     this.hp = 30;
     this.maxHp = 30;
     this.power = 10;
  },
  
  handleCollision: function(){
      if(this.target){
         if(this.hittingTime == 15){
            this.target.takeHit(this.power);
         }
         this.hittingTime += 1;              
         this.hittingTime = this.hittingTime % 16;
      }  
  },
  
  setTarget: function(target){
      if(this.target != null && target == null){
          this.scene.fire("amn_markazy_animation_"+"normal")
      }
      
      if(this.target == null && target != null){
          this.scene.fire("amn_markazy_animation_"+"hit");
      }
        
      this.target = target;
  }
  
})
