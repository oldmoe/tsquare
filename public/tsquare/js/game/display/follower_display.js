var FollowerDisplay = Class.create(Display,{
  
  noOfFrames : 9,
    
  initialize : function($super,owner,properties){
    this.characterImg = Loader.images.characters['follower.png'];
    this.imgWidth = this.characterImg.width
    this.imgHeight = this.characterImg.height/this.noOfFrames
    $super(owner)
    this.sprites.character.currentAnimationFrame = Math.round((Math.random()* this.noOfFrames-1))
  },
  
  configureAnimations: function($super){
  	$super()
  },
  
  createSprites : function(){
    this.sprites.character = new DomImgSprite(this.owner, {img : this.characterImg, noOfFrames:9})
  },
  
  render : function($super){
    if(this.owner.stateChanged){
      this.sprites.character.currentAnimationFrame = (this.sprites.character.currentAnimationFrame+1) % this.noOfFrames 
      $super()
    }
  }
  
})
