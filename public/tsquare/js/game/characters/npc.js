var Npc = Class.create(Unit,{
    speed : 4,
    tick : function($super){
      $super()
//      this.move(-(this.speed+ this.scene.currentSpeed*this.scene.direction),0)
    }
})
