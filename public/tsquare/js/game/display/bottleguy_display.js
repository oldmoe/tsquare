BottleguyDisplay = Class.create(CrowdMemberDisplay,{
  initImages : function(){
    this.characterImg = Loader.images.characters['bottleguy_idle.png']
    this.walkImg = Loader.images.characters['bottleguy_walk.png']
    this.runImg = Loader.images.characters['bottleguy_run.png']
    this.backImg = Loader.images.characters['bottleguy_back.png']
    this.frontImg = Loader.images.characters['bottleguy_front.png']
    this.holdImg = Loader.images.characters['bottleguy_hold.png']
    this.blurImg = Loader.images.characters['bottleguy_blur.png']
    this.deadImg = Loader.images.characters['bottleguy_dead.png']
    this.hitImg = Loader.images.characters['bottleguy_hit.png']
    this.hydrateImg = Loader.images.effects['hydrate.png']
  }
})
