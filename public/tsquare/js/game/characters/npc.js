var Npc = Class.create(Unit,{
    speed : 0,
    initialize : function($super,scene,x,lane, options){
      $super(scene,x,lane, options)
      this.coords.x+=Math.round(Math.randomSign()*Math.random()*this.scene.view.tileWidth/4)
      this.coords.y+=Math.random()*60
    },
    tick : function($super){
      $super()
      this.move(-(this.speed+ this.scene.currentSpeed*this.scene.direction),0)
    }
})
