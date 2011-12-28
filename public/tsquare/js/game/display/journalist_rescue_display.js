var JournalistRescueDisplay = Class.create(Display,{

  noOfFrames : 7,  
  
  states : ["normal", "walk"],
  
  initialize : function($super,owner,properties){
    this.initImages()
    this.imgWidth = this.characterImg.width
    this.imgHeight = this.characterImg.height/this.noOfFrames
    $super(owner)
    this.sprites.character.currentAnimationFrame = Math.round((Math.random()* this.sprites.character.currentAnimation.noOfFrames-1))
  },
  
  initImages : function(){
    this.characterImg = Loader.images.characters['journalist_idle.png']
    this.walkImg = Loader.images.characters['journalist_walk.png']
  },

  createSprites : function(){
    this.sprites.character = new DomImgSprite(this.owner, {img : this.characterImg,noOfFrames : 7})
    this.sprites.character.createAnimation({name:'walk',img:this.walkImg,noOfFrames:8})
  },
  
  render : function($super){
      if (this.owner.scene.moveBack) {
        this.sprites.character.currentAnimationFrame = (this.sprites.character.currentAnimationFrame - 1)
        if (this.sprites.character.currentAnimationFrame == -1) {
          this.sprites.character.currentAnimationFrame = this.sprites.character.currentAnimation.noOfFrames - 1 
        }
      }else{
        this.sprites.character.currentAnimationFrame = (this.sprites.character.currentAnimationFrame+1) % this.sprites.character.currentAnimation.noOfFrames
      } 
      $super()
  }
  

})
