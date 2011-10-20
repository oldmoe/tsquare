var NormalDisplay = Class.create(CrowdMemberDisplay,{
  extraScale : 0.75,
  initialize: function($super, owner){
    $super(owner);
  },
  
  initImages : function(){
    var names = ['normal','salafy','girl7egab','journalist','girl']
    var name = names.random()
    this.characterImg = Loader.images.characters[name+'_idle.png']
    this.walkImg = Loader.images.characters[name+'_walk.png']
    this.runImg = Loader.images.characters[name+'_run.png']
    this.backImg = Loader.images.characters[name+'_back.png']
    this.frontImg = Loader.images.characters[name+'_front.png']
    this.holdImg = Loader.images.characters[name+'_hold.png']
    this.blurImg = Loader.images.characters[name+'_blur.png']
  }
})
