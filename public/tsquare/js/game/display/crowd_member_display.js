var CrowdMemberDisplay = Class.create(Display,{
  
  noOfFrames : 7,  
  
  states : ["normal", "hold", "walk","reverseWalk", "front", "back", "run", "reverseRun", "jog", "sprint"],
  
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
      self.owner.observe(state,function(){
        if(state == "run")self.sprites.runEffectForward.show(); else self.sprites.runEffectForward.hide();
        self.sprites.character.switchAnimation(state)
        self.sprites.character.currentAnimationFrame = Math.round((Math.random()* self.sprites.character.currentAnimation.noOfFrames-1)) 
      })
    })
  },
  
  initImages : function(){
    this.characterImg = Loader.images.characters['crowd_member.png'];
  },
  
  createShadow: function(){
    this.shadowImg = Loader.images.effects['crowd_shadow.png'];
    this.sprites.shadow = new DomImgSprite(this.owner, {img : this.shadowImg,noOfFrames : 1}, {
      width: this.shadowImg.width,
      height: this.shadowImg.height,
      shiftX : -(this.shadowImg.width-this.characterImg.width)-10,
      shiftY : -10
    })    
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
      shiftX : this.characterImg.width - this.blurImg.width,
      hidden : true
    })
   
    this.sprites.character = new DomImgSprite(this.owner, {img : this.characterImg,noOfFrames : 7})
    this.sprites.character.createAnimation({name:'hold',img:this.holdImg,noOfFrames:1})
    this.sprites.character.createAnimation({name:'walk',img:this.walkImg,noOfFrames:8})
    this.sprites.character.createAnimation({name:'jog',img:this.walkImg,noOfFrames:8})
    this.sprites.character.createAnimation({name:'front',img:this.frontImg,noOfFrames:4})
    this.sprites.character.createAnimation({name:'back' ,img:this.backImg,noOfFrames:4})
    this.sprites.character.createAnimation({name:'run'  ,img:this.runImg,noOfFrames:6})
    this.sprites.character.createAnimation({name:'sprint'  ,img:this.runImg,noOfFrames:6})
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
      var character = this.sprites.character;
      if(this.owner.scene.moveBack) {
        character.currentAnimationFrame = (character.currentAnimationFrame - 1)
        if (character.currentAnimationFrame == -1) {
          character.currentAnimationFrame = character.currentAnimation.noOfFrames - 1 
        }
      } else {
        character.currentAnimationFrame = (character.currentAnimationFrame+1) % character.currentAnimation.noOfFrames
      }
      $super()
    }
  }
  
})
