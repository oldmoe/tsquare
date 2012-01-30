var NormalDisplay = Class.create(CrowdMemberDisplay,{
  extraScale : 0.9,
  noOfFrames : 8,
  nofOfAnimations : {"follower1" : 6, "follower2" : 9, "follower3" : 6},
  followerNames : ['follower1', 'follower2', 'follower3'],        //random takes values from it
  initialize: function($super, owner){
    $super(owner);
  },
  
  initImages : function(){
    this.name = this.followerNames.random()
    this.followerNames.remove(this.name)
    if (this.followerNames.length == 0) {
      NormalDisplay.prototype.followerNames = ['follower1', 'follower2', 'follower3']
    }
    this.characterImg = Loader.images.characters[this.name+'_idle.png']
    this.walkImg = Loader.images.characters[this.name+'_walk.png']
    this.runImg = Loader.images.characters[this.name+'_run.png']
    this.backImg = Loader.images.characters[this.name+'_back.png']
    this.frontImg = Loader.images.characters[this.name+'_front.png']
    this.holdImg = Loader.images.characters[this.name+'_hold.png']
    this.blurImg = Loader.images.characters[this.name+'_blur.png']
    this.deadImg = Loader.images.characters[this.name+'_dead.png']
    this.hitImg = Loader.images.characters[this.name+'_hit.png']
  },
  
  configureAnimations: function($super){
  	$super()
  	this.noOfFramesPerAnimation['hit'] = this.nofOfAnimations[this.name];
    if(this.name=="follower2"){
      this.noOfFramesPerAnimation['walk'] = 12;
      this.noOfFramesPerAnimation['reverseWalk'] = 12;
      this.noOfFramesPerAnimation['jog'] = 12;
    }
  }, 
  
  destroy : function($super){
    $super()
  }
  
})
