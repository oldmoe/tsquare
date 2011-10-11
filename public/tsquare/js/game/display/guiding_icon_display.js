var GuidingIconDisplay = Class.create(Display, {

  imgWidth:0,
  imgHeight:0,
  currentState: "march",
  hoveringIcons: {march: "march.png", circle: "circle.png", push: "push.png", hold: "lock.png"},
  
  initialize: function($super, owner){
    
    this.hoverIcon = Loader.images.hoveringIcons[this.hoveringIcons.march]
    this.imgWidth = this.hoverIcon.width
    this.imgHeight = this.hoverIcon.height
    
    $super(owner);
    this.sprites.hoverIcon = new DomImgSprite(this.owner,{img:this.hoverIcon, noOfFrames : 1}, {shiftY:-360}) 
  },
  
  setState: function(state){
    if(this.currentState != state){
      this.sprites.hoverIcon.replaceImg(Loader.images.hoveringIcons[this.hoveringIcons[state]].clone());
      this.currentState = state;
    }
      
  }
  
/*  
  initImages : function(){
    this.circleImg = Loader.images.guidingBar['normal_idle.png']
    this.marchImg = Loader.images.guidingBar['normal_walk.png']
    this.blockImg = Loader.images.guidingBar['normal_run.png']
  },
  
  createSprites : function(){
    this.sprites.character = new DomImgSprite(this.owner, {img : this.characterImg,noOfFrames : 7})
    this.sprites.character.createAnimation({name:'hold',img:this.holdImg,noOfFrames:1})
    this.sprites.character.createAnimation({name:'walk',img:this.walkImg,noOfFrames:8})
  },

  registerCommands : function(){
    var self = this
    this.commands.each(function(state){
      self.observe(state,function(){
        self.sprites.character.switchAnimation(state)
        self.sprites.character.currentAnimationFrame = Math.round((Math.random()* self.sprites.character.currentAnimation.noOfFrames-1)) 
      })
    })
  },
*/
  
  
  
});