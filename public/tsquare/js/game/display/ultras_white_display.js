var UltrasWhiteDisplay = Class.create(CrowdMemberDisplay,{
  initImages : function(){
    this.characterImg = Loader.images.characters['ultras_white_idle.png']
    this.walkImg = Loader.images.characters['ultras_white_walk.png']
    this.runImg = Loader.images.characters['ultras_white_run.png']
    this.backImg = Loader.images.characters['ultras_white_back.png']
    this.frontImg = Loader.images.characters['ultras_white_front.png']
    this.holdImg = Loader.images.characters['ultras_white_hold.png']
    this.blurImg = Loader.images.characters['ultras_white_blur.png']
    this.deadImg = Loader.images.characters['ultras_white_dead.png']
    this.hitImg = Loader.images.characters['ultras_white_hit.png']
  },
  
  configureAnimations: function($super){
  	$super()
  	this.noOfFramesPerAnimation['hit'] = 9;
  }
})
