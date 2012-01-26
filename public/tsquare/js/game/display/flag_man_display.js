var FlagManDisplay = Class.create(Display,{
  imgWidth: 194,
  imgHeight:194,
  animationChanged: false,
  animationForward: true,
  extraScale : 1,
  initialize : function($super,owner,properties){
    this.initImages();
    $super(owner,properties);
    this.createObservers();
  },
  
  createObservers : function(){
    var self = this
    var arrows = ['right', 'left', 'up', 'down']
    arrows.each(function(arrow){
      self.owner.scene.observe('arrow' + arrow.capitalize(), function(){
        self.animationChanged = true;
        self.animationForward = true;
        self.sprites.body.currentAnimationFrame = 1;
        self.sprites.body.switchAnimation(arrow);
      })  
    });
    ["normal", "walk", "jog", "run", "sprint"].each(function(state){
      self.owner.scene.observe(state, function(){
        self.sprites.leg.currentAnimationFrame = 0;
        var animation = "";
        if(state=="normal")animation = state
        else animation = "leg_"+state
        self.sprites.leg.switchAnimation(animation);
      })  
    })
  },
  
  initImages : function(){
    this.backImg = Loader.images.characters['flagman_back.png']
    this.downImg = Loader.images.characters['flagman_down.png']
    this.upImg = Loader.images.characters['flagman_up.png']
    this.forwardImg = Loader.images.characters['flagman_forward.png']
    this.idleImg = Loader.images.characters['flagman_idle.png']
    this.legImgWalk = Loader.images.characters['flagman_leg2_walk.png']
    this.idleLegImg = Loader.images.characters['flagman_leg_idle.png']
    this.runLegImg = Loader.images.characters['flagman_leg_run.png']
  },
  createShadows: function(){
    this.shadowImg = Loader.images.effects['crowd_shadow.png'];
    this.sprites.shadow = new DomImgSprite(this.owner, {img : this.shadowImg,noOfFrames : 1}, {
      width: this.shadowImg.width,
      height: this.shadowImg.height,
      shiftX : -(this.shadowImg.width-this.imgWidth)-60,
      shiftY : 65
    })    
  },
  createSprites: function(){
    this.configureAnimations();
    this.sprites.leg = new DomImgSprite(this.owner, {
      img: this.idleLegImg,
      noOfFrames: this.noOfFramesPerAnimation['leg_idle']
    }, {shiftX : 2})
    
    this.sprites.leg.createAnimation({name:'leg_walk',img:this.legImgWalk, noOfFrames:this.noOfFramesPerAnimation['leg_walk']})
    this.sprites.leg.createAnimation({name:'leg_jog',img:this.legImgWalk, noOfFrames:this.noOfFramesPerAnimation['leg_jog']})
    this.sprites.leg.createAnimation({name:'leg_run'  ,img:this.runLegImg, noOfFrames:this.noOfFramesPerAnimation['leg_run']})
    this.sprites.leg.createAnimation({name:'leg_sprint'  ,img:this.runLegImg, noOfFrames:this.noOfFramesPerAnimation['leg_sprint']})
    
    
    this.sprites.body = new DomImgSprite(this.owner, {
      img: this.idleImg,
      noOfFrames: this.noOfFramesPerAnimation['idle']
    })
    this.sprites.body.createAnimation({name:'left',img:this.backImg,noOfFrames:this.noOfFramesPerAnimation['left']});
    this.sprites.body.createAnimation({name:'right',img:this.forwardImg,noOfFrames:this.noOfFramesPerAnimation['right']});
    this.sprites.body.createAnimation({name:'up',img:this.upImg,noOfFrames:this.noOfFramesPerAnimation['up']});
    this.sprites.body.createAnimation({name:'down',img:this.downImg,noOfFrames:this.noOfFramesPerAnimation['down']});
  },
  configureAnimations: function(){
    this.noOfFramesPerAnimation = {};
    this.noOfFramesPerAnimation['leg_idle'] = 1;
    this.noOfFramesPerAnimation['leg_walk'] = 8;
    this.noOfFramesPerAnimation['leg_jog'] = 8;
    this.noOfFramesPerAnimation['leg_run'] = 6;
    this.noOfFramesPerAnimation['leg_sprint'] = 6;
    this.noOfFramesPerAnimation['idle'] = 5;
    this.noOfFramesPerAnimation['left'] = 5;
    this.noOfFramesPerAnimation['down'] = 5;
    this.noOfFramesPerAnimation['right'] = 5;
    this.noOfFramesPerAnimation['up'] = 5;
  },
  render: function($super){
    var legSprite = this.sprites.leg; 
    legSprite.currentAnimationFrame = (legSprite.currentAnimationFrame+1) % legSprite.currentAnimation.noOfFrames;
    var bodySprite = this.sprites.body
    if (this.animationChanged) {
      if(this.animationForward){
        bodySprite.currentAnimationFrame = (bodySprite.currentAnimationFrame + 1);
        if(bodySprite.currentAnimationFrame >= bodySprite.currentAnimation.noOfFrames - 1){
          this.animationForward = false
        }
      }else{
        bodySprite.currentAnimationFrame = (bodySprite.currentAnimationFrame - 1);
        if(bodySprite.currentAnimationFrame <= 0){
          this.animationForward = true;
          this.animationChanged = false;
          this.sprites.body.switchAnimation('normal')
        }   
      }
      
    }else{
      bodySprite.currentAnimationFrame = (bodySprite.currentAnimationFrame + 1) % bodySprite.currentAnimation.noOfFrames;
    }
    $super()
    
  }
})