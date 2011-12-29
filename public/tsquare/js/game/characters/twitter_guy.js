var TwitterGuy = Class.create(ProtectionUnit,{
  initialize : function($super,scene,x,y,options){
    $super(scene,x,y,options)
    this.hp = this.maxHp = 750;
  },
  
  escape : function(){
    this.neglected = true
    //removes the element from the start of the objects array and push it to its end
    this.handler.objects[this.lane].remove(this)
    this.handler.objects[this.lane].push(this)
  }
})
