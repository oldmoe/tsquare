var BombSmoke = Class.create({
  coords : null,
  scale : 0.4,
  opacity : 1,
  maxScale : 6,
  minOpacity : 0.1,
  finished : false,
  initialize : function(scene,x,y, id){
    this.scene = scene
    this.coords = {x:x, y:y}
    this.id = id
  },
  tick : function(){
    this.scale+=0.02
    this.opacity-=0.015
    this.move(4, -3)
    this.move(-this.scene.currentSpeed * this.scene.direction, 0)
    if (this.scale > this.maxScale || this.opacity < this.minOpacity) {
      this.finished = true
    }
  },
  move : function(dx,dy){
    this.coords.x+=dx
    this.coords.y+=dy
  }
})
