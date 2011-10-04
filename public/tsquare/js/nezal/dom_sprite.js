var DomSprite = Class.create(Sprite, {
  
  shiftX : 0,
  shiftY : 0,
  shiftZ : 0,
  defaultShiftY : 360,
  lastStyleVlaues : null,
  initialize : function(owner, assets, properties){
  	properties = properties || {};
    this.lastStyleVlaues = {};
    this.createDiv();
    this.div.addClassName('DomSprite');
		if ( properties.divClass ) this.div.addClassName(properties.divClass);
    this.owner = owner;
    var z =0 ;
    if (properties.zIndex) {
      z = properties.zIndex
      this.zIndex = z
    } else {
      z = this.owner.coords.y + this.owner.zdim + this.shiftZ;
    }
    this.div.setStyle ({zIndex :(z)});
		if(properties.width)this.div.style.width = properties.width + "px";
    else this.div.style.width = this.owner.imgWidth + "px";
		if(properties.height)this.div.style.height = properties.height + "px";
    else this.div.style.height =  this.owner.imgHeight + "px";
    if(properties.hidden)this.div.hide()
    Object.extend( this, properties );
  },

  setStyle : function(style){
    this.div.setStyle(style)
  },
  
  setOpacity : function(opacity){
    this.div.setOpacity(opacity)
  },
  
  show : function(){
    this.visible = true
    this.div.show()
    return this
  },
  
  hide : function(){
    this.visible = false
    this.div.hide()
    return this
  },

  render : function(){
    try{
      if(this.owner.dead){
        return this.destroy()
      }
      if (this.visible) {
        var position = this.position();
        
        var styles = {
          left : position.x + this.shiftX + "px",
          top : position.y  + this.shiftY + "px",
          zIndex : position.zIndex
        }
        var changes = this.changedStyles(styles);
        if (changes) {
          this.div.setStyle(changes);
        }
      }
  
    }catch(e){
      //console.log('Sprite#render: ',e)
    }
  },
  
  changedStyles : function(styles){
    var stylesChanged = {};
    var change = false;
    for( var style in styles ){
      var styleValue = styles[style];
      if( !this.lastStyleVlaues[style] || this.lastStyleVlaues[style] != styleValue ){
        //console.log(style, this.lastStyleVlaues[style], styleValue);
        stylesChanged[style] = styleValue;
        this.lastStyleVlaues[style] = styleValue;
        change = stylesChanged;
      }
    }
    return change
  },
  
	destroy : function(){
		if(this.div.parentNode){
			this.div = $(this.div.parentNode.removeChild(this.div))
		}
	},

  position : function(){
    var position = {};
    position.x = Math.round(this.owner.coords.x);
    position.y = Math.round(this.owner.coords.y-this.owner.imgHeight/2) + this.defaultShiftY;
	if(this.zIndex) position.zIndex = this.zIndex + this.shiftZ
    else position.zIndex = Math.round(this.owner.coords.y + this.owner.zdim + this.shiftZ);
    return position;
  },

  createDiv : function() {
    this.div = $(document.createElement('DIV'));
    $('gameCanvas').appendChild(this.div);
  }
	
})
