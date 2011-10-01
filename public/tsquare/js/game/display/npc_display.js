var NpcDisplay = Class.create(Display,{
  noOfFrames : 7,  
  initialize : function($super,owner,properties){
    this.characterImg = Loader.images.characters[owner.type+'_idle.png'];
    this.imgWidth = this.characterImg.width
    this.imgHeight = this.characterImg.height/this.noOfFrames
    $super(owner)
  },
  createSprites : function(){
    this.sprites.character = new DomImgSprite(this.owner, {img : this.characterImg,noOfFrames : this.noOfFrames},{flipped:true})
  },
  render : function($super){
      this.sprites.character.currentAnimationFrame = (this.sprites.character.currentAnimationFrame+1) % this.noOfFrames 
      $super()
  }
})
