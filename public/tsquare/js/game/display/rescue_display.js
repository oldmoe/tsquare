var RescueDisplay = Class.create(Display,{

  noOfFrames : 7,  
  
  states : ["normal", "walk"],
  
  initialize : function($super,owner,properties){
    this.initImages()
    this.imgWidth = this.characterImg.width
    this.imgHeight = this.characterImg.height/this.noOfFrames
    $super(owner)
    this.sprites.character.currentAnimationFrame = Math.round((Math.random()* this.sprites.character.currentAnimation.noOfFrames-1))
  },
  
  initImages : function(){
  },

  createSprites : function(){
    this.sprites.character = new DomImgSprite(this.owner, {img : this.characterImg,noOfFrames : 7})
    this.sprites.character.createAnimation({name:'walk',img:this.walkImg,noOfFrames:8})
  },
  
  render : function($super){
    if( this.owner.helpMessage && !this.owner.messageDisplayed){
      this.owner.messageBubble = this.owner.scene.handlers.message.showRescueBubble( this.owner.helpMessage, this.owner );
      this.owner.messageDisplayed = true;
      
    }
    if (this.owner.scene.moveBack) {
      this.sprites.character.currentAnimationFrame = (this.sprites.character.currentAnimationFrame - 1)
      if (this.sprites.character.currentAnimationFrame == -1) {
        this.sprites.character.currentAnimationFrame = this.sprites.character.currentAnimation.noOfFrames - 1 
      }
    }else{
      this.sprites.character.currentAnimationFrame = (this.sprites.character.currentAnimationFrame+1) % this.sprites.character.currentAnimation.noOfFrames
    } 
    $super()
  },
  
  destroy : function($super){
    if( this.owner.messageDisplayed ){
      this.owner.scene.handlers.message.rescueBubble.destroy();
      this.owner.scene.handlers.message.rescueBubble = null;
    }
    $super();
  }
  

})


var JournalistRescueDisplay = Class.create(RescueDisplay,{

  initImages : function(){
    this.characterImg = Loader.images.characters['journalist_idle.png']
    this.walkImg = Loader.images.characters['journalist_walk.png']
  }

})


var SalafyRescueDisplay = Class.create(RescueDisplay,{

  initImages : function(){
    this.characterImg = Loader.images.characters['salafy_idle.png']
    this.walkImg = Loader.images.characters['salafy_walk.png']
  }

})


var GirlRescueDisplay = Class.create(RescueDisplay,{

  initImages : function(){
    this.characterImg = Loader.images.characters['girl_idle.png']
    this.walkImg = Loader.images.characters['girl_walk.png']
  }

})

var DoctorRescueDisplay = Class.create(RescueDisplay,{

  initImages : function(){
    this.characterImg = Loader.images.characters['medic_idle.png']
    this.walkImg = Loader.images.characters['medic_walk.png']
  }

})

var BottleguyRescueDisplay = Class.create(RescueDisplay,{

  initImages : function(){
    this.characterImg = Loader.images.characters['bottleguy_idle.png']
    this.walkImg = Loader.images.characters['bottleguy_walk.png']
  }

});

var Girl7egabRescueDisplay = Class.create(RescueDisplay,{

  initImages : function(){
    this.characterImg = Loader.images.characters['girl7egab_idle.png']
    this.walkImg = Loader.images.characters['girl7egab_walk.png']
  }

})

var UltrasRescueDisplay = Class.create(RescueDisplay,{

  initImages : function(){
    this.characterImg = Loader.images.characters['ultras_green_idle.png']
    this.walkImg = Loader.images.characters['ultras_green_walk.png']
  }

})