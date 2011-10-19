var MedicDisplay = Class.create(CrowdMemberDisplay,{
  
  initImages : function(){
    this.characterImg = Loader.images.characters['medic_idle.png']
    this.walkImg = Loader.images.characters['medic_walk.png']
    this.runImg = Loader.images.characters['medic_run.png']
    this.backImg = Loader.images.characters['medic_back.png']
    this.frontImg = Loader.images.characters['medic_front.png']
    this.holdImg = Loader.images.characters['medic_hold.png']
    this.blurImg = Loader.images.characters['medic_blur.png']
  },
  
  createSprites : function(){
    this.sprites.runEffectForward = new DomImgSprite(this.owner,
    {
      img: this.blurImg,
      noOfFrames: 1
    }, {
      width: this.blurImg.width,
      height: this.blurImg.height,
      shiftX : this.characterImg.width - this.blurImg.width - 20,
      hidden : true
    })
    this.sprites.character = new DomImgSprite(this.owner, {img : this.characterImg,noOfFrames : 7})
    this.sprites.character.createAnimation({name:'hold',img:this.holdImg,noOfFrames:1})
    this.sprites.character.createAnimation({name:'walk',img:this.walkImg,noOfFrames:8})
    this.sprites.character.createAnimation({name:'jog',img:this.walkImg,noOfFrames:8})
    this.sprites.character.createAnimation({name:'front',img:this.frontImg,noOfFrames:4})
    this.sprites.character.createAnimation({name:'back' ,img:this.backImg,noOfFrames:4})
    this.sprites.character.createAnimation({name:'run'  ,img:this.runImg,noOfFrames:7})
    this.sprites.character.createAnimation({name:'reverseWalk'  ,img:this.walkImg,noOfFrames:8, flipped : true})
    this.sprites.character.createAnimation({name:'reverseRun'  ,img:this.runImg, noOfFrames:6, flipped : true})
  },
})
