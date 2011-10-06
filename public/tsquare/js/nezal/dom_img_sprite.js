var DomImgSprite = Class.create(DomSprite, {
	animated : false,
	clickable : false,
	minAreaZIndex : 10000000,
  animations : null,
  lastCoords : null,
  initialize : function($super, owner, imgAssets, properties){
    this.animations = {}
    this.createAnimation({
        name : 'normal',
        img : $(imgAssets.img),
        noOfFrames : imgAssets.noOfFrames || 1
     })
    this.currentAnimation = this.animations['normal']
    //owner.imgWidth = this.currentAnimation.imgWidth
    //owner.imgHeight = this.currentAnimation.imgHeight
    $super(owner, imgAssets, properties);
    //console.log( imgAssets )
    if(properties && properties.flipped){
      this.div.addClassName('flippedSprite');
      Util.flip(this.div)
    }
    if (this.owner.scene && this.owner.scalable) {
        this.scaleDiv()
    }
    this.img = this.currentAnimation.img
  	this.div.appendChild(this.img)
  	this.currentAnimationFrame = 0
  	this.currentDirectionFrame = 0
  	this.noOfAnimationFrames = this.currentAnimation.noOfFrames
  	this.noOfDirections = 8
  	this.img.setStyle({height:"auto"});
    this.render()
  },
  scaleDiv : function(){
      var scales = [0.8,1,1.2]
      //var scale = ((this.owner.coords.y) / (this.owner.scene.view.height - this.defaultShiftY)) * 0.8 + 0.4
      var scale = scales[this.owner.lane]
      this.div.style.WebkitTransform += ' scale(' + scale + ')';
      this.div.style.MozTransform += ' scale(' + scale + ')';
    
  },
  switchAnimation : function(name){
    var prevAnimation = this.currentAnimation
    this.currentAnimation = this.animations[name]
    this.currentAnimationFrame = 0
    this.currentDirectionFrame = 0
    this.replaceImg(this.currentAnimation.img)
    this.div.style.width = this.currentAnimation.imgWidth + "px"
    this.div.style.height = this.currentAnimation.imgHeight + "px"
    Util.removeTransform(this.div)
    if (this.currentAnimation.flipped) {
      this.flipped = true;
      Util.flip(this.div)
    }
    else 
      this.flipped = false;
    this.scaleDiv()
    this.img = this.currentAnimation.img
	  this.noOfAnimationFrames = this.currentAnimation.noOfFrames
  },
  
  //options contain {name,noOfFrames, img, imageWidth, imgHeight, direction, startY}
  createAnimation : function(options){
    var img = options.img
    var noOfFrames = options.noOfFrames
    var direction = options.direction || 0
    var startY = options.startY || 0
    var imgWidth = 0
    var imgHeight = 0
    if(direction == 1){
      imgWidth = img.width / noOfFrames
      imgHeight = img.height
    }else{
      imgWidth = img.width
      imgHeight = img.height / noOfFrames
    }
    var flipped = options.flipped || false 
    var animation = {img:img.clone(), noOfFrames : noOfFrames, imgWidth : imgWidth, imgHeight : imgHeight,
    startY:startY, direction:direction,flipped: flipped, name: options.name}
    this.animations[options.name] = animation
    return animation
  },
  
  setCursor : function( style ){
    this.img.setStyle({cursor : style});
  },
  
  setImgWidth : function(width){
		this.imgWidth = width
    this.img.setStyle({width:(width + "px")});
  },
  
	setImgHeight : function(height){
			this.imgHeight = height / this.noOfAnimationFrames
      this.img.setStyle({height:(height + "px")});
  },
	
  replaceImg : function(img){
    this.div.removeChild(this.img)
    this.img = img
    this.div.appendChild(this.img)  
  },
  
	render : function($super){
      $super();
    if (this.clickable) {
			this.div.setStyle({
				zIndex: (this.owner.coords.y + this.minAreaZIndex)
			})
    } else {
      var styles = {
        marginLeft: (-this.currentAnimation.imgWidth * this.owner.angle + "px"),
        marginTop: (-this.currentAnimationFrame * this.currentAnimation.imgHeight + "px")
      }
      var changes = this.changedStyles(styles, 'img');
      if (changes) {
        this.img.setStyle(changes);
      }
      
      if(this.owner.shake){
        Effect.Shake(this.div)
        this.owner.shake = false
      }
    }
  },
  
	destroy : function($super){
		$super()
		if(this.clickDiv && this.clickDiv.parentNode){
			this.clickDiv = $(this.clickDiv.parentNode.removeChild(this.clickDiv))
		}
	}
	
})
