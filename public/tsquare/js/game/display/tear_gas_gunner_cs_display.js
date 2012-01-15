var TearGasGunnerCsDisplay = Class.create(EnemyDisplay,{
  imgWidth:80,
  imgHeight:80,
  noOfFrames : 8,
  states : ["hit","normal"],
  hoverIcon: null,
  initialize : function($super,owner){
    this.walkingImg = Loader.images.enemies['amn_markazy_tear_gas_walk.png']
    this.hitImage = Loader.images.enemies['amn_markazy_tear_gas_shooting.png']
    this.imgWidth = this.walkingImg.width
    this.imgHeight = this.walkingImg.height/this.noOfFrames
    $super(owner)
    this.registerEvents()
    this.createShadow()
  },
 
  registerEvents : function(){
    var self = this
    this.states.each(function(state){
      self.owner.observe(state,function(){
        self[state]();
      })
    })
  },
  
  hit: function(){
    this.sprites.walking.switchAnimation("hit");
  },

  normal: function(){
    this.sprites.walking.switchAnimation("normal")
  },

  createSprites:function(){
    this.sprites.walking = new DomImgSprite(this.owner,{img:this.walkingImg, noOfFrames : 8})
    this.sprites.walking.createAnimation({name:'hit',img:this.hitImage, noOfFrames:16})
  },
  
  createShadow: function(){
    this.shadowImg = Loader.images.effects['amn_markazy_tear_gas_shadow.png'];
    this.sprites.shadow = new DomImgSprite(this.owner, {img : this.shadowImg,noOfFrames : 1}, {
      width: this.shadowImg.width,
      height: this.shadowImg.height,
      shiftX : -(this.shadowImg.width-this.walkingImg.width)-10,
      shiftY : -10
    })    
  },
    
  render : function($super){
    var sprite = this.sprites.walking
    if (sprite.currentAnimation.name == "hit" &&
       sprite.currentAnimationFrame == sprite.noOfAnimationFrames - 1) {
      this.normal()
      this.owner.shotComplete = true
      sprite.currentAnimationFrame = 0
    }
    sprite.currentAnimationFrame = (sprite.currentAnimationFrame+1) % sprite.noOfAnimationFrames
    $super()
  },
  
  destroy : function($super, done){
    if(done){
      return $super()
    }
    this.owner.removed = true      // to remove the display object from render loop
    var self = this
    this.sprites.shadow.hide()
    Effects.pulsateFadeDown(this.sprites.walking.div, function(){self.destroy(true)})
  }


}) 