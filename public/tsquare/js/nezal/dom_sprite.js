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
    var changes = this.changedStyles(style, 'div');
    if (changes) {
      this.div.setStyle(changes);
    }
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
      if (this.visible) {
        var position = this.position();
        
        var styles = {
          left : position.x + this.shiftX + "px",
          top : position.y  + this.shiftY + "px",
          zIndex : position.zIndex
        }
        var changes = this.changedStyles(styles, 'div');
        //var changes = styles //enable this to cancel the optimization
        if (changes) {
          this.div.setStyle(changes);
        }
        this.updateRotation()
      }
  
    }catch(e){
      //console.log('Sprite#render: ',e)
    }
  },
  
  changedStyles : function(styles, element){
    var stylesChanged = {};
    var change = false;
    for( var style in styles ){
      var styleValue = styles[style];
      if( !this.lastStyleVlaues[element] || !this.lastStyleVlaues[element][style] || this.lastStyleVlaues[element][style] != styleValue ){
        //console.log(style, this.lastStyleVlaues[style], styleValue);
        stylesChanged[style] = styleValue;
        if(!this.lastStyleVlaues[element]){
          this.lastStyleVlaues[element] = {};
        }
        this.lastStyleVlaues[element][style] = styleValue;
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
    if (this.zIndex) {
      position.zIndex = Math.round(this.zIndex + Math.random() * 3)
    }
    else 
      position.zIndex = Math.max(1, Math.round(this.owner.coords.y + this.owner.zdim + this.shiftZ));
    return position;
  },
  
  updateRotation : function() {
    // TODO: boolean rotationChanged 
    if(!this.owner.theta) return;
    this.div.style.webkitTransformOrigin = this.owner.rx + "px " + this.owner.ry + "px"; 
    this.div.style.webkitTransform = "rotate("+this.owner.theta * 180 / Math.PI +"deg)";
    this.div.style.MozTransform = "rotate("+this.owner.theta * 180 / Math.PI +"deg)";
    this.div.style.OTransform = "rotate("+this.owner.theta * 180 / Math.PI +"deg)";
    this.div.style.msTransform = "rotate("+this.owner.theta * 180 / Math.PI +"deg)";

  },

  createDiv : function() {
    this.div = $(document.createElement('DIV'));
    $('gameCanvas').appendChild(this.div);
  }
	
})
