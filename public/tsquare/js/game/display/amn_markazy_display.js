var AmnMarkazyDisplay = Class.create(EnemyDisplay,{
    
  imgWidth:80,
  imgHeight:80,
  noOfFrames : 8,
  states : ["hit","normal"],
  
  initialize : function($super,owner){
  	this.loadImages();
    this.imgWidth = this.blockImg.width
    this.imgHeight = this.blockImg.height/this.noOfFrames
    $super(owner)
    this.registerEvents()
  },
  
  loadImages : function(){
    this.blockImg = Loader.images.enemies['amn_markazy_stick_walk.png'];
    this.hitImage = Loader.images.enemies['amn_markazy_stick_hit.png'];
    this.hitEffect = Loader.images.effects['hit1.png'];
  },

  registerEvents : function(){
    var self = this
    this.states.each(function(state){
      self.owner.observe(state,function(){
        self[state]();
      })
    })
  },

  createShadows: function(){
    this.shadowImg = Loader.images.effects['amn_markazy_shadow.png'];
    this.sprites.shadow = new DomImgSprite(this.owner, {img : this.shadowImg,noOfFrames : 1}, {
      width: this.shadowImg.width,
      height: this.shadowImg.height,
      shiftX : -(this.shadowImg.width-this.imgWidth)-10,
      shiftY : -10
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

  showText: function(){
    this.baloonImg = Loader.images.gameElements['bubble.png']
    this.sprites.baloon = new DomImgSprite(this.owner, {img : this.baloonImg},{
      width: this.baloonImg.width,
      height: this.baloonImg.height,
      shiftY:0,
      shiftX:0
    })
    
    this.sprites.text = new DomTextSprite(this.owner,"textInfo", {
        width: 100,
        height: 100,
        centered: true,
        shiftY: 0,
        shiftX: 0,
        styleClass: 'bubbleText'
    });
  },

  hideText: function(){
    if(this.sprites.baloon){
      this.sprites.baloon.destroy();
      this.sprites.text.destroy();
    }  
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
  },
  
  destroy : function($super, done){
    if(done){
      return $super()
    }
    this.owner.removed = true      // to remove the display object from render loop
    var self = this
    this.sprites.shadow.hide()
    Effects.pulsateFadeDown(this.sprites.block.div, function(){self.destroy(true)})
  }
  
})
