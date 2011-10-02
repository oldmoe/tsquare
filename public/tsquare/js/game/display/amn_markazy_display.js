var AmnMarkazyDisplay = Class.create(EnemyDisplay,{
    
  imgWidth:80,
  imgHeight:80,
  noOfFrames : 8,
  states : ["hit","normal"],
  
  initialize : function($super,owner){
    this.blockImg = Loader.images.enemies['amn_markazy_stick_walk.png']
    this.hitImage = Loader.images.enemies['amn_markazy_stick_hit.png']
    this.hitEffect = Loader.images.effects['hit1.png']
    this.imgWidth = this.blockImg.width
    this.imgHeight = this.blockImg.height/this.noOfFrames
    $super(owner)
    this.registerEvents()
  },

  registerEvents : function(){
    var self = this
    this.states.each(function(state){
      self.owner.scene.observe("amn_markazy_animation_"+state,function(){
        self[state]();
      })
    })
  },
  
  hit: function(){
    this.sprites.block.switchAnimation("hit");
    this.sprites.block.currentAnimationFrame = Math.floor(Math.random()*this.sprites.block.noOfAnimationFrames)
  },

  normal: function(){
    this.sprites.block.switchAnimation("normal")
  },

  createSprites:function(){
    this.sprites.block = new DomImgSprite(this.owner,{img:this.blockImg, noOfFrames : 8})
    this.sprites.block.createAnimation({name:'hit',img:this.hitImage, noOfFrames:9})
    this.sprites.hitEffect = new DomImgSprite(this.owner, {
      img: this.hitEffect,
      noOfFrames: 3
    }, {
      width: this.hitEffect.width,
      height: this.hitEffect.height / 3,
      shiftY : -50,
      shiftX : -70,
      shiftZ : 100
    })
    this.sprites.hitEffect.hide()
  },
  
  render : function($super){
      var sprite = this.sprites.block
      sprite.currentAnimationFrame = (sprite.currentAnimationFrame+1) % sprite.noOfAnimationFrames
//      if(this.owner.hitDone &&  this.sprites.hitEffect.currentAnimationFrame ==0 
//      && sprite.currentAnimationFrame == sprite.noOfAnimationFrames - 3){
//        this.sprites.hitEffect.show()
//        this.hitEffect = true
//      } 
//      if(this.owner.hitDone && this.hitEffect){
//        this.sprites.hitEffect.currentAnimationFrame+=1
//        if(this.sprites.hitEffect.currentAnimationFrame == this.sprites.hitEffect.noOfAnimationFrames){
//          this.sprites.hitEffect.currentAnimationFrame = 0
//          this.sprites.hitEffect.hide()
//          this.owner.hitDone = false 
//          this.hitEffect = false
//        }
//      }
      $super()
  }
  
})
