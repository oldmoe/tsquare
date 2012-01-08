var WalkingManDisplay = Class.create(Display,{
  
  noOfFrames : 7,//idle =7
  states : ["normal","walk", "run", "reverseWalk", "reverseRun"],
  targetX:100,
  counter : 0,
  
  imgWidth: 96,
  imgHeight: 96,
     
  initialize : function($super, reactor, x0){
    
    $$(".walkingCrowdMemeber")[0].update("");
    this.container = $$(".walkingCrowdMemeber")[0];
    this.reactor = reactor;
    
    this.owner = {coords:{x:this.getRandomX(), y:0}, scalable:true, type: "ultras_red"}
    
    this.characterImg = Loader.images.characters[this.owner.type+'_idle.png']
    this.walkImg = Loader.images.characters[this.owner.type+'_walk.png']
    this.runImg = Loader.images.characters[this.owner.type+'_run.png']
    this.shadowImg = Loader.images.effects['crowd_shadow.png'];
    
    // this.imgWidth = this.characterImg.width
    // this.imgHeight = this.characterImg.height / this.noOfFrames

    $super(this.owner);
    
    this.render();
    
    this.switchAnimation("walk");
  },
  
  createSprites : function(){
    this.createShadow();
    this.sprites.character = new DomImgSprite(this.owner, {img : this.characterImg, noOfFrames : this.noOfFrames}, {
      width: 96,
      height: 96,
      parent: this.container,
      shiftY:-350,
      shiftX:0,
      zIndex: 6
    })
    this.sprites.character.createAnimation({name:'flippedNormal'  ,img:this.characterImg,noOfFrames:this.noOfFrames, flipped : true})
    this.sprites.character.createAnimation({name:'walk'  ,img:this.walkImg,noOfFrames:8})
    this.sprites.character.createAnimation({name:'run'  ,img:this.runImg,noOfFrames:6})
    this.sprites.character.createAnimation({name:'reverseWalk'  ,img:this.walkImg,noOfFrames:8, flipped : true})
    this.sprites.character.createAnimation({name:'reverseRun'  ,img:this.runImg, noOfFrames:6, flipped : true})
  },

  createShadow: function(){
    this.sprites.shadow = new DomImgSprite(this.owner, {img : this.shadowImg, noOfFrames : 1}, {
      width: this.shadowImg.width,
      height: this.shadowImg.height,
      parent: this.container,
      shiftX : -(this.shadowImg.width-this.characterImg.width)-20,
      shiftY : -350,
      zIndex: 4
    })    
  },
  
  render : function($super){
    
    if(Math.abs(this.owner.coords.x-this.targetX) < 7){
      if(this.sprites.character.currentAnimation.name == "walk")
        this.switchAnimation("normal")
      else if(this.sprites.character.currentAnimation.name == "reverseWalk")
        this.switchAnimation("flippedNormal")
    }else{
      if(this.owner.coords.x<this.targetX)
        this.owner.coords.x += 7;
      else if(this.owner.coords.x>this.targetX)
        this.owner.coords.x -= 7;
    }   
    this.counter++
    if(this.counter%2==0) this.sprites.character.currentAnimationFrame = (this.sprites.character.currentAnimationFrame+1) % this.sprites.character.currentAnimation.noOfFrames
    $super()
    
    var self = this;
    this.reactor.push(1, function(){self.render()});
  },
  
  switchAnimation: function(animation){
    if(this.sprites.character.currentAnimation.name != animation){
      this.sprites.character.switchAnimation(animation);
      this.sprites.character.currentAnimationFrame = Math.round((Math.random()* this.sprites.character.currentAnimation.noOfFrames-1));
    }  
  },
  
  getRandomX: function() {
  	return 300 + (0.5 - Math.random()) * 50;
  },
  
  moveTo: function(x){
  	x = x || this.getRandomX();
    if(Math.abs(this.targetX - x) < 3) return;
    this.targetX = x;
    var animation = "normal";
    if(this.owner.coords.x>this.targetX)
      animation = "reverseWalk"
    else if(this.owner.coords.x<this.targetX)
      animation = "walk"  
    
    this.switchAnimation(animation);
  }
  
})
