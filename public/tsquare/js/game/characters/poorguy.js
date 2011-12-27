var Poorguy = Class.create(ProtectionUnit,{
  initialize : function($super,scene,x,y,options){
    $super(scene,x,y,options)
    this.hp = this.maxHp = 1000
  },
  escape : function(){
    this.die();
  }
})
