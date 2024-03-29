var DomMeterSprite = Class.create(DomSprite, {
  initialize : function($super, owner, properties){
    $super(owner, null, properties);
		properties = properties || {}
		this.orientation = properties['orientation'] || 'horizontal'
		this.width = properties['width'] || (this.orientation == 'horizontal' ? 30 : 5)
		this.height = properties['height'] || (this.orientation == 'horizontal' ? 5 : 30)
		this.meterFunc = properties['meterFunc'] || this.owner.getMeterFunc()
		this.hideWhenFull = properties['hideWhenFull']
    this.emptySpan = $(document.createElement('DIV'));
		this.fullSpan = $(document.createElement('DIV'));
		this.div.appendChild(this.emptySpan);
    this.div.appendChild(this.fullSpan);
		if(properties.styleClass){
			this.fullSpan.addClassName(properties.styleClass.full);
			this.emptySpan.addClassName(properties.styleClass.empty);	
		}
		
		this.emptySpan.setStyle({'position':'absolute'
													, top : '0px'
													, left: '0px'
													, height:this.height+"px"
													, width:this.width+"px"
													});
		this.fullSpan.setStyle({'position':'absolute'
													, top : '0px'
													, left: '0px'
													, height:this.height+"px"
													, width:this.width+"px"
													});
		this.setMeterStyle()
		this.div.style.width = this.width + "px";													
		this.div.style.height = this.height + "px";													
  },
  
  getMeterLength : function(){
  		return Math.round(this.meterFunc() * (this.orientation == 'horizontal' ? this.width : this.height))
  },
    
  setMeterStyle : function(){
    var styles = null;
    if(this.orientation == 'horizontal'){
      styles = {width:this.getMeterLength()+"px"};
  	}else{
  	  var height = this.getMeterLength();
      styles = {height:height+"px", top:this.height-height+"px"};
  	}
    var changes = this.changedStyles(styles, 'fullSpan');
    if (changes) {
      this.fullSpan.setStyle(changes);
    }
  },

  render : function($super){
    //$super();
    if (this.hideWhenFull) {
      if (this.meterFunc() == 1) {
        this.div.hide()
        return
      }else{
        this.div.show()
      }
    }
    //this.div.show()
    try{
      if(this.owner.dead){
        return this.destroy();
      }
      var styles = {left : this.owner.coords.x + this.owner.imgHeight/2 - this.width/2,
                    top : this.owner.coords.y -Math.round(this.owner.imgHeight/2)+this.shiftY + this.defaultShiftY+ "px",
                    zIndex : this.owner.coords.y+ this.shiftZ}
        var changes = this.changedStyles(styles, 'div');
        if (changes) {
          this.div.setStyle(changes);
        }
  	  this.setMeterStyle()
    }catch(e){
 //     console.log('Sprite#render: ',e)
    }
  }
})
