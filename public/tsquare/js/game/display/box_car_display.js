var BoxCarDisplay = Class.create(Display,{
   noOfFrames : 8,
  
  initialize: function($super, owner){
    this.img = Loader.images.enemies['box_car.png']
    this.shadowImg = Loader.images.effects['box_car_shadow.png'];
    this.imgHeight = this.img.height / this.noOfFrames
    this.imgWidth = this.img.width
    $super(owner)
  },
  createSprites : function(){
    this.sprites.shadow = new DomImgSprite(this.owner, {img : this.shadowImg,noOfFrames : 1}, {
      width: this.shadowImg.width,
      height: this.shadowImg.height,
      shiftX : -(this.shadowImg.width-this.img.width),
      shiftY : -10
    })    
    this.sprites.boxCar = new DomImgSprite(this.owner, {
      img: this.img,
      noOfFrames: this.noOfFrames
    })

  },
  
  render : function($super){
    this.sprites.boxCar.currentAnimationFrame = (this.sprites.boxCar.currentAnimationFrame + 1) % this.noOfFrames
    $super()
  }  
})
