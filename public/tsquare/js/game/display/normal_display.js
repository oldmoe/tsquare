var NormalDisplay = Class.create(CrowdMemberDisplay,{
  
  initialize: function($super, owner){
    $super(owner);
  },
  
  initImages : function(){
    this.characterImg = Loader.images.characters['normal_idle.png']
    this.walkImg = Loader.images.characters['normal_walk.png']
    this.runImg = Loader.images.characters['normal_run.png']
    this.backImg = Loader.images.characters['normal_back.png']
    this.frontImg = Loader.images.characters['normal_front.png']
    this.holdImg = Loader.images.characters['normal_hold.png']
    this.blurImg = Loader.images.characters['normal_blur.png']
  }
})
