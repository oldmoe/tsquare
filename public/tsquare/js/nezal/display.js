var Display = Class.create({
  xdim :0,
	ydim :0,
	zdim :0,
	sprites : null,
	
	initialize : function(owner,properties){
		Object.extend(this,properties)
		this.sprites = {}
		this.owner = owner
    this.removed = false
    Object.extend(this.owner,this)
    this.createSprites()
	},
	
  //To be overwridden
  createSprites : function(){
    
  },
  
  render : function(){
    for(var sprite in this.sprites){
      this.sprites[sprite].render()
    }
  },
  
	destroy : function(){
    this.removed = true
		for(var sprite in this.sprites){
			this.sprites[sprite].destroy();
	  }
	},
	
  getWidth : function(){
    return this.imgWidth 
  },
  
  getHeight: function(){
    return this.imgHeight
  }
  
});
