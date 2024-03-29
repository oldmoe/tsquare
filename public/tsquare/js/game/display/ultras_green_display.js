var UltrasGreenDisplay = Class.create(CrowdMemberDisplay,{
  initImages : function(){
    this.characterImg = Loader.images.characters['ultras_green_idle.png']
    this.walkImg = Loader.images.characters['ultras_green_walk.png']
    this.runImg = Loader.images.characters['ultras_green_run.png']
    this.backImg = Loader.images.characters['ultras_green_back.png']
    this.frontImg = Loader.images.characters['ultras_green_front.png']
    this.holdImg = Loader.images.characters['ultras_green_hold.png']
    this.blurImg = Loader.images.characters['ultras_green_blur.png']
    this.deadImg = Loader.images.characters['ultras_green_dead.png']
    this.hitImg = Loader.images.characters['ultras_green_hit.png']
  },
  
  configureAnimations: function($super){
  	$super()
  	this.noOfFramesPerAnimation['hit'] = 9;
  }
})
