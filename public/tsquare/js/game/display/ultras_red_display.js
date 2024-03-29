var UltrasRedDisplay = Class.create(CrowdMemberDisplay,{
  initImages : function(){
    this.characterImg = Loader.images.characters['ultras_red_idle.png']
    this.walkImg = Loader.images.characters['ultras_red_walk.png']
    this.runImg = Loader.images.characters['ultras_red_run.png']
    this.backImg = Loader.images.characters['ultras_red_back.png']
    this.frontImg = Loader.images.characters['ultras_red_front.png']
    this.holdImg = Loader.images.characters['ultras_red_hold.png']
    this.blurImg = Loader.images.characters['ultras_red_blur.png']
    this.deadImg = Loader.images.characters['ultras_red_dead.png']
    this.hitImg = Loader.images.characters['ultras_red_hit.png']
  },
  
  configureAnimations: function($super){
  	$super()
  	this.noOfFramesPerAnimation['hit'] = 9;
  }
})
