var ClashEnemyDisplay = Class.create(EnemyDisplay,{
  noOfFrames : 8,
   states : ["normal", "front", "back", "run", 'reverseWalk' ],
  initialize : function($super,owner){
    this.walkImg = Loader.images.enemies['amn_kalabsh_walk.png']
    this.runImg = Loader.images.enemies['amn_kalabsh_run.png']
    this.frontImg = Loader.images.enemies['amn_kalabsh_front.png']
    this.backImg = Loader.images.enemies['amn_kalabsh_back.png']
    this.blurImg = Loader.images.enemies['amn_kalabsh_blur.png']
    this.imgWidth = this.walkImg.width
    this.imgHeight = this.walkImg.height/this.noOfFrames
    $super(owner)
    this.createShadow();
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
   createSprites:function(){
     this.sprites.runEffectForward = new DomImgSprite(this.owner,
    {
      img: this.blurImg,
      noOfFrames: 1
    }, {
      width: this.blurImg.width,
      height: this.blurImg.height,
      shiftX : -(this.walkImg.width - this.blurImg.width),
      shiftY : 30,
      flipped : true,
      hidden : true,
    })
    this.sprites.character = new DomImgSprite(this.owner,{img:this.walkImg, noOfFrames : 8},{
      shiftY : 25,
      shiftX : 15
    })
    this.sprites.character.createAnimation({name:'run',img:this.runImg, noOfFrames:6})
    this.sprites.character.createAnimation({name:'front',img:this.frontImg, noOfFrames:4})
    this.sprites.character.createAnimation({name:'back',img:this.backImg, noOfFrames:4})
    this.sprites.character.createAnimation({name:'reverseWalk'  ,img:this.walkImg,noOfFrames:8, flipped : true})
   },
   createShadow: function(){
    this.shadowImg = Loader.images.effects['amn_markazy_shadow.png'];
    this.sprites.shadow = new DomImgSprite(this.owner, {img : this.shadowImg,noOfFrames : 1}, {
      width: this.shadowImg.width,
      height: this.shadowImg.height,
      shiftX : -(this.shadowImg.width-this.walkImg.width) + 30,
      shiftY : -20
    })    
  },
  render: function($super){
    var sprite = this.sprites.character
    sprite.currentAnimationFrame = (sprite.currentAnimationFrame + 1) % sprite.noOfAnimationFrames
    $super()
  }
})
