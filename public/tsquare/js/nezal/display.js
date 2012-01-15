var Display = Class.create({
  xdim :0,
	ydim :0,
	zdim :0,
	sprites : null,
	
	initialize : function(owner,properties){
    this.owner = owner
    this.sprites = {}
    this.removed = false
		Object.extend(this,properties)
    Object.extend(owner,this)
    owner.initDisplay()
    if (owner.scene) {
      owner.scene.observe('end', function(){
        owner.destroyAudio()
      })
    }
	},
	
  initDisplay : function(){
    this.createShadows();
    this.createSprites()
    
    this.initAudio();    
  },
  
	initAudio: function(){
	  
	},
	
	destroyAudio: function(){
	  
	},
	
	createShadows: function(){
	  
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
	  this.destroyAudio();
    this.owner.removed = true
		for(var sprite in this.sprites){
			this.sprites[sprite].destroy();
	  }
	},
	
  getWidth : function(){
    return this.imgWidth 
  },
  
  getHeight: function(){
    return this.imgHeight
  },
  
  show : function(){
    for(var sprite in this.sprites){
      this.sprites[sprite].show()
    }
  },
  
  hide : function(){
    for(var sprite in this.sprites){
      this.sprites[sprite].hide()
    }
  }
  
});
