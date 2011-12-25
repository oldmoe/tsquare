var SalafyDisplay = Class.create(CrowdMemberDisplay,{
  initImages : function(){
    this.characterImg = Loader.images.characters['salafy_idle.png']
    this.walkImg = Loader.images.characters['salafy_walk.png']
    this.runImg = Loader.images.characters['salafy_run.png']
    this.backImg = Loader.images.characters['salafy_back.png']
    this.frontImg = Loader.images.characters['salafy_front.png']
    this.holdImg = Loader.images.characters['salafy_hold.png']
    this.blurImg = Loader.images.characters['salafy_blur.png']
    this.deadImg = Loader.images.characters['salafy_dead.png']
    this.hitImg = Loader.images.characters['salafy_hit.png']
  }
})
