BottleguyDisplay = Class.create(CrowdMemberDisplay,{
  initImages : function(){
    this.characterImg = Loader.images.characters['bottleguy_idle.png']
    this.walkImg = Loader.images.characters['bottleguy_walk.png']
    this.runImg = Loader.images.characters['bottleguy_run.png']
    this.backImg = Loader.images.characters['bottleguy_back.png']
    this.frontImg = Loader.images.characters['bottleguy_front.png']
    this.holdImg = Loader.images.characters['bottleguy_hold.png']
    this.hydrateImg = Loader.images.effects['hydrate.png']
  },
  createSprites : function(){
    this.sprites.character = new DomImgSprite(this.owner, {img : this.characterImg,noOfFrames : 7})
    var factor = 2
    this.sprites.range = new DomImgSprite(this.owner, {
      img: this.hydrateImg,
      noOfFrames: 9
    }, {
      width: this.hydrateImg.width/ factor,
      height: this.hydrateImg.height / (9*factor),
      shiftX: -this.hydrateImg.width/(2* factor) + this.characterImg.width/2,
      shiftY: -this.hydrateImg.height/(18 * factor) + 15,
      shiftZ : 100
    })
    this.sprites.range.setImgWidth(this.hydrateImg.width/ factor)
    this.sprites.range.setImgHeight(this.hydrateImg.height/factor)
    this.sprites.character.createAnimation({name:'hold',img:this.holdImg,noOfFrames:1})
    this.sprites.character.createAnimation({name:'walk',img:this.walkImg,noOfFrames:8})
    this.sprites.character.createAnimation({name:'front',img:this.frontImg,noOfFrames:4})
    this.sprites.character.createAnimation({name:'back' ,img:this.backImg,noOfFrames:4})
    this.sprites.character.createAnimation({name:'run'  ,img:this.runImg,noOfFrames:6})
    this.sprites.character.createAnimation({name:'reverse'  ,img:this.walkImg,noOfFrames:8, flipped : true})
    this.sprites.character.createAnimation({name:'reverseRun'  ,img:this.runImg, noOfFrames:6, flipped : true})
  },
  render : function($super){
    this.sprites.range.currentAnimationFrame = (this.sprites.range.currentAnimationFrame + 1) % this.sprites.range.currentAnimation.noOfFrames
    this.sprites.range.setOpacity(1-this.sprites.range.currentAnimationFrame*0.1)
    $super() 
  }
})
