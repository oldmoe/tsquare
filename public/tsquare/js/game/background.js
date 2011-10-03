var Background = Class.create({
	imagesCount: 0 ,
	scene: null,
	speed: 0,
	images: null,
	y: 0,
	container: null,
	offsetX: null,
	
	   
	initialize: function(scene, options,style){
		this.imagesCount = options.imagesCount
		this.scene = scene
		this.speed = options.speed
		this.images = options.images
    if(options.alwaysMove) this.alwaysMove = true
		this.y = options.y || 0
		this.container = $(document.createElement('div'))
		$("container").appendChild(this.container)
		this.container.addClassName('skyline')
		if(style && style.opacity)this.container.style.opacity = style['opacity']
		var maxWidth = this.images[0].width
		for(var i=1; i<this.images.length; i++){
			if( maxWidth < this.images[i].width)
				maxWidth = this.images[i].width	
		}
		
    if(options.offsetX != null)
      this.offsetX = options.offsetX
    else
      this.offsetX = -Math.round(Math.random()*maxWidth)

		this.container.setStyle({width:(maxWidth*this.imagesCount)+"px", top:this.y+"px"})
		for(var i=0;i<this.imagesCount;i++){
			this.container.appendChild(this.images.random().clone())
		}
        this.render(true)
	},
	
	render: function(forceRender){
     if((this.scene.currentSpeed <=0 || this.speed() == 0) && !forceRender)return;
	   this.container.children[0].setStyle({marginLeft:this.offsetX+"px"})
	},
	
	tick : function(){
    if(this.scene.currentSpeed <=0 || this.speed() == 0)return;
    if(this.scene.direction==1){
  		this.offsetX -= this.speed()
  		var firstImg = this.container.children[0]
  		if((firstImg.getWidth()+this.offsetX) <= 0){
  			this.reset();
  		}
    }else if(this.scene.direction == -1){
      if (this.offsetX > 0) {
        this.offsetX = 0
      }if(this.offsetX == 0){
        this.reset()
      }
      this.offsetX-=this.speed()
      this.offsetX = Math.min(this.offsetX,0);
    }
	},
	
	reset : function(){
    if (this.scene.direction==1){
      this.offsetX = 0
      this.container.removeChild(this.container.children[0])
      this.container.appendChild(this.images.random().clone())
    }else{
      this.offsetX = -this.images[0].width
      if(this.container.children.length>0)this.container.removeChild(this.container.children[this.container.children.length-1])
      if(this.container.children.length>0)this.container.children[0].insert({before:this.images.random().clone()})
    }
	}
	
});