var AdvisorDisplay = Class.create(Display,{
  
  noOfFrames : 7,
   
  initialize : function($super,owner,properties){
    
    this.characterImg = Loader.images.characters[owner.type+'_idle.png']
    this.walkImg = Loader.images.characters[owner.type+'_walk.png']
    this.runImg = Loader.images.characters[owner.type+'_run.png']
    this.backImg = Loader.images.characters[owner.type+'_back.png']
    this.frontImg = Loader.images.characters[owner.type+'_front.png']
    this.holdImg = Loader.images.characters[owner.type+'_hold.png']
    this.blurImg = Loader.images.characters[owner.type+'_blur.png']

    this.baloonImg = Loader.images.gameElements['bubble.png']
    
    this.imgWidth = this.characterImg.width
    this.imgHeight = this.characterImg.height / this.noOfFrames
    $super(owner)
  },
  
  createShadow: function(){
    this.shadowImg = Loader.images.effects['crowd_shadow.png'];
    this.sprites.shadow = new DomImgSprite(this.owner, {img : this.shadowImg, noOfFrames : 1}, {
      width: this.shadowImg.width,
      height: this.shadowImg.height,
      shiftX : -(this.shadowImg.width-this.characterImg.width)-10,
      shiftY : -10
    })    
  },
  
  createSprites : function(){
    this.createShadow();
    this.sprites.character = new DomImgSprite(this.owner, {img : this.characterImg,noOfFrames : this.noOfFrames})

    this.sprites.character.createAnimation({name:'hold',img:this.holdImg,noOfFrames:1})
    this.sprites.character.createAnimation({name:'walk',img:this.walkImg,noOfFrames:8})
    this.sprites.character.createAnimation({name:'front',img:this.frontImg,noOfFrames:4})
    this.sprites.character.createAnimation({name:'back' ,img:this.backImg,noOfFrames:4})
    this.sprites.character.createAnimation({name:'run'  ,img:this.runImg,noOfFrames:6})
    this.sprites.character.createAnimation({name:'reverseWalk'  ,img:this.walkImg,noOfFrames:8, flipped : true})
    this.sprites.character.createAnimation({name:'reverseRun'  ,img:this.runImg, noOfFrames:6, flipped : true})

    this.showText();
  },
  
  showText: function(){
    this.sprites.baloon = new DomImgSprite(this.owner, {img : this.baloonImg},{
      width: this.baloonImg.width,
      height: this.baloonImg.height,
      shiftY:-100,
      shiftX:-10
    })
    
    this.sprites.text = new DomTextSprite(this.owner,"textInfo", {
        width: this.baloonImg.width,
        height: this.baloonImg.height,
        centered: true,
        shiftY: -70,
        shiftX: 15,
        styleClass: 'bubbleText'
    });
  },

  hideText: function(){
    this.sprites.baloon.destroy();
    this.sprites.text.destroy();
  },
  
  render : function($super){
    this.sprites.character.currentAnimationFrame = (this.sprites.character.currentAnimationFrame+1) % this.noOfFrames
    $super()
  }
})
