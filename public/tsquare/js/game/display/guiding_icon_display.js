var GuidingIconDisplay = Class.create(Display, {

  imgWidth:0,
  imgHeight:0,
  currentState: "march",
  hoveringIcons: {march: "march.png", circle: "circle.png", push: "push.png", hold: "lock.png"},
  
  initialize: function($super, owner){
    
    this.hoverIcon = Loader.images.hoveringIcons[this.hoveringIcons.march]
    this.imgWidth = this.hoverIcon.width
    this.imgHeight = this.hoverIcon.height
    
    $super(owner);
    this.sprites.hoverIcon = new DomImgSprite(this.owner,{img:this.hoverIcon, noOfFrames : 1}, {shiftY:-360}) 
  },
  
  setState: function(state){
    if(this.currentState != state){
      this.sprites.hoverIcon.replaceImg(Loader.images.hoveringIcons[this.hoveringIcons[state]].clone());
      this.currentState = state;
    }
      
  }
  
  
  
});