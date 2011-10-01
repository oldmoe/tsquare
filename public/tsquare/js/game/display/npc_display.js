var NpcDisplay = Class.create(Display,{
  noOfFrames : 8, 
  initialize : function($super,owner,properties){
    this.characterImg = Loader.images.characters[owner.type+'_walk.png'];
    this.imgWidth = this.characterImg.width
    this.imgHeight = this.characterImg.height / this.noOfFrames
    $super(owner)
  },
  createSprites : function(){
      if (this.owner.direction == -1) 
        this.sprites.character = new DomImgSprite(this.owner, {
          img: this.characterImg,
          noOfFrames: this.noOfFrames
        }, {
          flipped: true
        })
      else {
        this.sprites.character = new DomImgSprite(this.owner, {
          img: this.characterImg,
          noOfFrames: this.noOfFrames
        })
      }
  },
  render : function($super){
      this.sprites.character.currentAnimationFrame = (this.sprites.character.currentAnimationFrame+1) % this.noOfFrames
      if(this.owner.directionReversed){
        this.destroy()
        this.createSprites()
        this.owner.directionReversed = false
      } 
      $super()
  }
})
