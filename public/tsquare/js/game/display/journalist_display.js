JournalistDisplay = Class.create(CrowdMemberDisplay,{
  initImages : function(){
    this.characterImg = Loader.images.characters['journalist_idle.png']
    this.walkImg = Loader.images.characters['journalist_walk.png']
    this.runImg = Loader.images.characters['journalist_run.png']
    this.backImg = Loader.images.characters['journalist_back.png']
    this.frontImg = Loader.images.characters['journalist_front.png']
    this.holdImg = Loader.images.characters['journalist_hold.png']
    this.blurImg = Loader.images.characters['journalist_blur.png']
    this.deadImg = Loader.images.characters['journalist_dead.png']
    this.hitImg = Loader.images.characters['journalist_hit.png']
    this.shoutImg = Loader.images.characters['journalist_shout.png']
  }
})
