var Npc = Class.create(Unit,{
    speed : 5,
    moved : 0,
    maxDisplacement : 300,
    extraScale : 0.85,
    initialize : function($super,scene,x,lane, options){
      $super(scene,x,lane, options)
      this.coords.x+=Math.round(Math.randomSign()*Math.random()*this.scene.view.tileWidth/4)
      this.coords.y+=Math.random()*30
      this.direction = Math.randomSign()
      this.maxDisplacement = Math.round(this.maxDisplacement*Math.random()+100) 
    },
    tick : function($super){
      $super()
      var displacement = (this.direction*this.speed -  this.scene.currentSpeed*this.scene.direction)
      this.move(displacement,0)
      this.moved+=Math.abs(this.direction*this.speed)
      if(this.moved > this.maxDisplacement){
        this.moved = 0
        this.direction *= -1 
        this.directionReversed = true 
      }
      
    }
})
