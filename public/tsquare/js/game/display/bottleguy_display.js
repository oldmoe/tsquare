BottleguyDisplay = Class.create(CrowdMemberDisplay,{
  counter : 0,
  initImages : function(){
    this.characterImg = Loader.images.characters['bottleguy_idle.png']
    this.walkImg = Loader.images.characters['bottleguy_walk.png']
    this.runImg = Loader.images.characters['bottleguy_run.png']
    this.backImg = Loader.images.characters['bottleguy_back.png']
    this.frontImg = Loader.images.characters['bottleguy_front.png']
    this.holdImg = Loader.images.characters['bottleguy_hold.png']
    this.blurImg = Loader.images.characters['bottleguy_blur.png']
    this.deadImg = Loader.images.characters['bottleguy_dead.png']
    this.hydrateImg = Loader.images.effects['hydrate.png']
  },
  
  createSprites : function(){
    this.createShadow();
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
    var factor = 2
//    this.sprites.range = new DomImgSprite(this.owner, {
//      img: this.hydrateImg,
//      noOfFrames: 9
//    }, {
//      width: this.hydrateImg.width/ factor,
//      height: this.hydrateImg.height / (9*factor),
//      shiftX: -this.hydrateImg.width/(2* factor) + this.characterImg.width/2 + 5,
//      shiftY: -this.hydrateImg.height/(18 * factor) + 15,
//      shiftZ : 100
//    })
//    this.sprites.range.currentAnimationFrame = Math.floor(this.noOfFrames * Math.random()) 
//    this.sprites.range.setImgWidth(this.hydrateImg.width/ factor)
//    this.sprites.range.setImgHeight(this.hydrateImg.height/factor)
    this.sprites.character.createAnimation({name:'hold',img:this.holdImg,noOfFrames:1})
    this.sprites.character.createAnimation({name:'walk',img:this.walkImg,noOfFrames:8})
    this.sprites.character.createAnimation({name:'jog',img:this.walkImg,noOfFrames:8})
    this.sprites.character.createAnimation({name:'front',img:this.frontImg,noOfFrames:4})
    this.sprites.character.createAnimation({name:'back' ,img:this.backImg,noOfFrames:4})
    this.sprites.character.createAnimation({name:'run'  ,img:this.runImg,noOfFrames:6})
    this.sprites.character.createAnimation({name:'sprint'  ,img:this.runImg,noOfFrames:6})
    this.sprites.character.createAnimation({name:'reverseWalk'  ,img:this.walkImg,noOfFrames:8, flipped : true})
    this.sprites.character.createAnimation({name:'reverseRun'  ,img:this.runImg, noOfFrames:6, flipped : true})
    this.sprites.character.createAnimation({name:'dead',img:this.deadImg,noOfFrames:1})
    this.sprites.health = new ImgMeterSprite(this.owner,
    {empty:Loader.images.gameElements['health_meter_empty.png'] ,full:Loader.images.gameElements['health_meter.png']},
     {
      meterFunc: function(){
        return this.owner.hpRatio()
      },
      orientation : 'vertical',
      shiftX : 25,
      shiftY: -10
    });
    this.sprites.water = new ImgMeterSprite(this.owner,
    {empty:Loader.images.gameElements['hydration_meter_empty.png'] ,full:Loader.images.gameElements['hydration_meter.png']},
     {
      meterFunc: function(){
        return this.owner.waterRatio()
      },
      orientation : 'vertical',
      shiftX : 55,
      shiftY: -10
    });
  },
  render : function($super){
    $super()
    return
//    this.counter++
//    if (this.counter % 2 == 0) {
//      this.sprites.range.currentAnimationFrame = (this.sprites.range.currentAnimationFrame + 1) % this.sprites.range.currentAnimation.noOfFrames
//      this.sprites.range.setOpacity(Math.max(1 - this.sprites.range.currentAnimationFrame * 0.17,0))
//    }
  }
})
