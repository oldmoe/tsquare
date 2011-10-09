var ChargingAmnMarkazyDisplay = Class.create(AmnMarkazyDisplay,{
    
  initialize : function($super,owner){
      $super(owner) 
  },
  
  hit: function(){
    this.sprites.block.switchAnimation("hit");
  },

  normal: function(){
    this.sprites.block.switchAnimation("normal")
  }

})
