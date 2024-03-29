HalaManDisplay = Class.create(CrowdMemberDisplay,{
  initImages : function(){
    this.characterImg = Loader.images.characters['hala_man_idle.png']
    this.walkImg = Loader.images.characters['hala_man_walk.png']
    this.runImg = Loader.images.characters['hala_man_run.png']
    this.backImg = Loader.images.characters['hala_man_back.png']
    this.frontImg = Loader.images.characters['hala_man_front.png']
    this.holdImg = Loader.images.characters['hala_man_hold.png']
    this.blurImg = Loader.images.characters['hala_man_blur.png']
    this.deadImg = Loader.images.characters['hala_man_dead.png']
    this.hitImg = Loader.images.characters['hala_man_hit.png']
  },
  
  configureAnimations: function($super){
  	$super()
  	this.noOfFramesPerAnimation['hit'] = 9;
    this.noOfFramesPerAnimation['walk'] = 12;
    this.noOfFramesPerAnimation['reverseWalk'] = 12;
    this.noOfFramesPerAnimation['jog'] = 12;
  }
 })