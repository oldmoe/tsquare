var CrowdMemberDisplay = Class.create(Display,{
  
  noOfFrames : 7,
  states : ["normal", "hold", "walk","reverseWalk", "front", "back", "run", "reverseRun", "jog", "sprint", "dead", "hit"],
  
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
        if(["sprint"].indexOf(state) != -1)self.sprites.runEffectForward.show(); else self.sprites.runEffectForward.hide();
        self.sprites.character.switchAnimation(state)
        self.sprites.character.currentAnimationFrame = Math.round((Math.random()* self.sprites.character.currentAnimation.noOfFrames-1)) 
      })
    })
  },
  
  initImages : function(){
    this.characterImg = Loader.images.characters['crowd_member.png'];
  },
  
  configureAnimations: function(){
    this.noOfFramesPerAnimation = {};
  	this.noOfFramesPerAnimation['hold'] = 1;
  	this.noOfFramesPerAnimation['walk'] = 8;
  	this.noOfFramesPerAnimation['jog'] = 8;
  	this.noOfFramesPerAnimation['front'] = 4;
  	this.noOfFramesPerAnimation['back'] = 4;
  	this.noOfFramesPerAnimation['run'] = 6;
  	this.noOfFramesPerAnimation['sprint'] = 6;
  	this.noOfFramesPerAnimation['reverseWalk'] = 8;
  	this.noOfFramesPerAnimation['reverseRun'] = 6;
  	this.noOfFramesPerAnimation['dead'] = 1;
  	this.noOfFramesPerAnimation['hit'] = 6;
  },
  
  createShadows: function(){
    this.shadowImg = Loader.images.effects['crowd_shadow.png'];
    this.sprites.shadow = new DomImgSprite(this.owner, {img : this.shadowImg,noOfFrames : 1}, {
      width: this.shadowImg.width,
      height: this.shadowImg.height,
      shiftX : -(this.shadowImg.width-this.imgWidth)-10,
      shiftY : -10
    })    
  },
  
  createSprites : function(){
  	this.configureAnimations();
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
   
    this.sprites.character = new DomImgSprite(this.owner, {img : this.characterImg,noOfFrames : this.noOfFrames})
    this.sprites.character.createAnimation({name:'hold',img:this.holdImg,noOfFrames:this.noOfFramesPerAnimation['hold']})
    this.sprites.character.createAnimation({name:'front',img:this.frontImg,noOfFrames:this.noOfFramesPerAnimation['front']})
    this.sprites.character.createAnimation({name:'back' ,img:this.backImg,noOfFrames:this.noOfFramesPerAnimation['back']})
    this.sprites.character.createAnimation({name:'walk',img:this.walkImg,noOfFrames:this.noOfFramesPerAnimation['walk']})
    this.sprites.character.createAnimation({name:'jog',img:this.walkImg,noOfFrames:this.noOfFramesPerAnimation['jog']})
    this.sprites.character.createAnimation({name:'run'  ,img:this.runImg,noOfFrames:this.noOfFramesPerAnimation['run']})
    this.sprites.character.createAnimation({name:'sprint'  ,img:this.runImg,noOfFrames:this.noOfFramesPerAnimation['sprint']})
    this.sprites.character.createAnimation({name:'reverseWalk'  ,img:this.walkImg,noOfFrames:this.noOfFramesPerAnimation['reverseWalk'], flipped : true})
    this.sprites.character.createAnimation({name:'reverseRun'  ,img:this.runImg, noOfFrames:this.noOfFramesPerAnimation['reverseRun'], flipped : true})
    this.sprites.character.createAnimation({name:'dead',img:this.deadImg,noOfFrames:this.noOfFramesPerAnimation['dead'], shiftY:20, shiftX : -10})
    this.sprites.character.createAnimation({name:'hit',img:this.hitImg,noOfFrames:this.noOfFramesPerAnimation['hit']})

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
    if( this.owner.rescued && !this.owner.messageDisplayed ){
      this.owner.messageBubble = this.owner.scene.handlers.message.showRescueBubble( this.owner.leaveMessage, this.owner);
      this.owner.messageDisplayed = true;
    }
    if(this.owner.stateChanged){
      var character = this.sprites.character;
      if(this.owner.moveBack) {
        character.currentAnimationFrame = (character.currentAnimationFrame - 1)
        if (character.currentAnimationFrame == -1) {
          character.currentAnimationFrame = character.currentAnimation.noOfFrames - 1 
        }
      } else {
        character.currentAnimationFrame = (character.currentAnimationFrame+1) % character.currentAnimation.noOfFrames
      }
      $super()
    }
  },
  
  destroy : function($super, done){
    if( done ){
      return $super()
    }
    if( this.owner.messageBubble ){
      this.owner.messageBubble.destroy();
    }
    this.owner.removed = true      // to remove the display object from render loop
    var self = this
    this.sprites.shadow.hide()
    Effects.pulsateFadeUp(this.sprites.character.div, function(){self.destroy(true)})
  }
  
})
