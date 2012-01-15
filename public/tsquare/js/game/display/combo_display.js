var ComboDisplay = Class.create(Display,{
  hidden : true,
  imgWidth : 0, imgHeight:0,
  initialize : function($super, scene){
    var self = this
    this.owner = {
      coords : {x:75,y:-300},
      angle : 0,
      combo : 0,
      textInfo : function(){
        return "X" + this.combo
      }
    }
    this.initImages();
    scene.observe('combo', function(combos){
      self.owner.combo = combos
      new Effect.Shake(self.sprites.txt.div, {duration: 0.2,distance: 2})
      if(self.hidden) self.show()
      self.hidden = false
    })
    scene.observe('wrongMove', function(){
      self.owner.combo = 0;
      if(!self.hidden)self.hide();
      self.hidden = true      
    })
    $super(this.owner)
    this.hide()
  },
  
  initImages : function(){
    this.img = Loader.images.game_elements['combo.png'];
    this.imgWidth = this.img.width
    this.imgHeight = this.img.height    
  },
  
  createSprites : function(){
    this.sprites.combo= new DomImgSprite(this.owner, {img:this.img, noOfFrames:1})
    this.sprites.txt = new DomTextSprite(this.owner, "textInfo", {
      width: 30,
      height: 30,
      centered: true,
      shiftY: 5,
      shiftX: this.imgWidth + 5,
      styleClass: '',
    }, {
      zIndex: 1000
    });
    this.sprites.txt.div.style.color = "white"
  }
});
