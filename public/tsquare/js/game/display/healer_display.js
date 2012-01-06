var HealerDisplay = Class.create(CrowdMemberDisplay,{
  initImages : function(){
    this.characterImg = Loader.images.characters['medic_idle.png']
    this.walkImg = Loader.images.characters['medic_walk.png']
    this.runImg = Loader.images.characters['medic_run.png']
    this.backImg = Loader.images.characters['medic_back.png']
    this.frontImg = Loader.images.characters['medic_front.png']
    this.holdImg = Loader.images.characters['medic_hold.png']
    this.blurImg = Loader.images.characters['medic_blur.png']
    this.deadImg = Loader.images.characters['medic_dead.png']
    this.hitImg = Loader.images.characters['medic_hit.png']
  },
  
  configureAnimations: function($super){
    $super()
    this.noOfFramesPerAnimation['run'] = 7;
    this.noOfFramesPerAnimation['reverseRun'] = 7;
    this.noOfFramesPerAnimation['sprint'] = 7;
  }
  
})
