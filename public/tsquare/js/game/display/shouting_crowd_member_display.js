var ShoutingCrowdMemberDisplay = Class.create(CrowdMemberDisplay, {
  registerEvents : function($super){
    $super()
    var self = this
    this.owner.scene.observe("correctMove",function(){
      self.sprites.character.switchAnimation("shout")
      self.sprites.character.currentAnimationFrame = 0;
    })
    this.owner.scene.observe("endMove",function(){
      var scene = self.owner.scene
      var state = scene.speeds[scene.lastSpeedIndex].state
      self.sprites.character.switchAnimation("walk")
      self.sprites.character.currentAnimationFrame = 0;
    })
  },
  createSprites: function($super){
    $super()
      this.sprites.character.createAnimation({name:'shout',img:this.shoutImg,noOfFrames:this.noOfFramesPerAnimation['shout']})
  },
  configureAnimations: function($super){
    $super()
    this.noOfFramesPerAnimation['shout'] = 8;
  }
})
