var Animation = Class.create(Display,{
  
  initialize : function($super,scene,coords,img,noOfFrames,properties){
    this.scene = scene
    this.noOfFrames = noOfFrames
    this.img = img
    this.imgWidth = img.width
    this.imgHeight = img.height/noOfFrames
    this.owner = {coords:coords, scalable:true}
    properties.shiftZ = 1000
    this.scene.pushToRenderLoop('characters',this)
    $super(this.owner,properties)
  },
  
  createSprites : function(){
    this.sprites.animation = new DomImgSprite(this.owner,{img:this.img, noOfFrames : this.noOfFrames})
  },
  
  render : function($super){
    this.sprites.animation.currentAnimationFrame+=1
    this.sprites.animation.setOpacity(0.9-0.1*this.sprites.animation.currentAnimationFrame)
    if(this.sprites.animation.currentAnimationFrame == this.noOfFrames){
      this.scene.removeFromRenderLoop('characters',this)
      this.destroy()
    }else{
      $super()
    }
  }
})
