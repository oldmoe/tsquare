GirlDisplay = Class.create(CrowdMemberDisplay,{
  initImages : function(){
    this.characterImg = Loader.images.characters['girl_idle.png']
    this.walkImg = Loader.images.characters['girl_walk.png']
    this.runImg = Loader.images.characters['girl_run.png']
    this.backImg = Loader.images.characters['girl_back.png']
    this.frontImg = Loader.images.characters['girl_front.png']
    this.holdImg = Loader.images.characters['girl_hold.png']
    this.blurImg = Loader.images.characters['girl_blur.png']
    this.deadImg = Loader.images.characters['girl_dead.png']
    this.hitImg = Loader.images.characters['girl_hit.png']
  }
})
