var CrowdMemberDisplay = Class.create(Display,{
  
  noOfFrames : 7,  
  
  states : ["normal", "hold", "walk","reverseWalk", "front", "back","run","reverseRun"],
  
  initialize : function($super,owner,properties){
    this.initImages()
    this.imgWidth = this.characterImg.width
    this.imgHeight = this.characterImg.height/this.noOfFrames
    $super(owner)
    this.sprites.character.currentAnimationFrame = Math.round((Math.random()* this.sprites.character.currentAnimation.noOfFrames-1))
    this.registerEvents()
  },
  registerEvents : function(){
    var self = this
    this.states.each(function(state){
      self.owner.scene.observe("crowd_member_animation_"+state,function(){
        self.sprites.character.switchAnimation(state)
        self.sprites.character.currentAnimationFrame = Math.round((Math.random()* self.sprites.character.currentAnimation.noOfFrames-1)) 
      })
    })
  },
  
  initImages : function(){
    this.characterImg = Loader.images.characters['crowd_member.png'];
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
//    this.sprites.runEffectBackward = new DomImgSprite(this.owner,{
//      img: this.blurImg,
//      noOfFrames: 1,
//      flipped: true
//    }, {
//      width: this.blurImg.width,
//      height: this.blurImg.height,
//      shiftX : -(this.characterImg.width - this.blurImg.width)
//    })
   
    this.sprites.character = new DomImgSprite(this.owner, {img : this.characterImg,noOfFrames : 7})
    this.sprites.character.createAnimation({name:'hold',img:this.holdImg,noOfFrames:1})
    this.sprites.character.createAnimation({name:'walk',img:this.walkImg,noOfFrames:8})
    this.sprites.character.createAnimation({name:'front',img:this.frontImg,noOfFrames:4})
    this.sprites.character.createAnimation({name:'back' ,img:this.backImg,noOfFrames:4})
    this.sprites.character.createAnimation({name:'run'  ,img:this.runImg,noOfFrames:6})
    this.sprites.character.createAnimation({name:'reverseWalk'  ,img:this.walkImg,noOfFrames:8, flipped : true})
    this.sprites.character.createAnimation({name:'reverseRun'  ,img:this.runImg, noOfFrames:6, flipped : true})
     this.sprites.health = new ImgMeterSprite(this.owner,
    {empty:Loader.images.gameElements['health_meter_empty.png'] ,full:Loader.images.gameElements['health_meter.png']},
     {
      meterFunc: function(){
        return this.owner.hpRatio()
      },
      orientation : 'vertical',
      shiftX : 20
    });
    this.sprites.water = new ImgMeterSprite(this.owner,
    {empty:Loader.images.gameElements['hydration_meter_empty.png'] ,full:Loader.images.gameElements['hydration_meter.png']},
     {
      meterFunc: function(){
        return this.owner.waterRatio()
      },
      orientation : 'vertical',
      shiftX : 50
    });
  },
  
  render : function($super){
    if(this.owner.stateChanged){
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
  }
  
})
